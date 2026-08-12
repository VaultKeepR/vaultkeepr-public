
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract VaultKeeperLegacy is ReentrancyGuard, Pausable, Ownable {



    uint256 public constant MAX_BENEFICIARIES = 5;
    uint256 public constant MIN_DELAY = 30 days;
    uint256 public constant MAX_DELAY = 730 days;        
    uint256 public constant MIN_GRACE_PERIOD = 3 days;
    uint256 public constant MAX_GRACE_PERIOD = 30 days;
    uint256 public constant HEARTBEAT_COOLDOWN = 1 hours;



    struct LegacyConfig {
        string envelopeCid;         
        uint256 delaySeconds;       
        uint256 gracePeriodSeconds; 
        uint256 lastHeartbeat;      
        uint256 registeredAt;       
        address[] beneficiaries;    
        bool active;                
        bool claimed;               
        address claimedBy;          
    }

    mapping(address => LegacyConfig) private _legacies;



    event LegacyRegistered(address indexed owner, uint256 delaySeconds, uint256 beneficiaryCount);
    event HeartbeatSent(address indexed owner, uint256 timestamp);
    event LegacyClaimed(address indexed owner, address indexed beneficiary, uint256 timestamp);
    event LegacyRevoked(address indexed owner);
    event BeneficiariesUpdated(address indexed owner, uint256 newCount);
    event DelayUpdated(address indexed owner, uint256 newDelay, uint256 newGracePeriod);



    error InvalidDelay();
    error InvalidGracePeriod();
    error TooManyBeneficiaries();
    error NoBeneficiaries();
    error AlreadyActive();
    error NotActive();
    error NotBeneficiary();
    error NotClaimable();
    error AlreadyClaimed();
    error HeartbeatCooldown();
    error EmptyEnvelopeCid();
    error DuplicateBeneficiary();



    modifier onlyLegacyOwner() {
        if (!_legacies[msg.sender].active) revert NotActive();
        _;
    }



    
    function registerLegacy(
        string calldata envelopeCid,
        uint256 delaySeconds,
        uint256 gracePeriodSeconds,
        address[] calldata beneficiaries
    ) external nonReentrant whenNotPaused {
        if (_legacies[msg.sender].active) revert AlreadyActive();
        if (bytes(envelopeCid).length == 0) revert EmptyEnvelopeCid();
        if (delaySeconds < MIN_DELAY || delaySeconds > MAX_DELAY) revert InvalidDelay();
        if (gracePeriodSeconds < MIN_GRACE_PERIOD || gracePeriodSeconds > MAX_GRACE_PERIOD) revert InvalidGracePeriod();
        if (beneficiaries.length == 0) revert NoBeneficiaries();
        if (beneficiaries.length > MAX_BENEFICIARIES) revert TooManyBeneficiaries();

        _checkNoDuplicates(beneficiaries);

        _legacies[msg.sender] = LegacyConfig({
            envelopeCid: envelopeCid,
            delaySeconds: delaySeconds,
            gracePeriodSeconds: gracePeriodSeconds,
            lastHeartbeat: block.timestamp,
            registeredAt: block.timestamp,
            beneficiaries: beneficiaries,
            active: true,
            claimed: false,
            claimedBy: address(0)
        });

        emit LegacyRegistered(msg.sender, delaySeconds, beneficiaries.length);
    }



    
    function heartbeat() external nonReentrant whenNotPaused onlyLegacyOwner {
        LegacyConfig storage cfg = _legacies[msg.sender];
        if (block.timestamp < cfg.lastHeartbeat + HEARTBEAT_COOLDOWN) revert HeartbeatCooldown();

        cfg.lastHeartbeat = block.timestamp;
        emit HeartbeatSent(msg.sender, block.timestamp);
    }



    
    function claimLegacy(address legacyOwner) external nonReentrant whenNotPaused {
        LegacyConfig storage cfg = _legacies[legacyOwner];

        if (!cfg.active) revert NotActive();
        if (cfg.claimed) revert AlreadyClaimed();
        if (!_isBeneficiary(cfg, msg.sender)) revert NotBeneficiary();
        if (!_isClaimable(cfg)) revert NotClaimable();

        cfg.claimed = true;
        cfg.claimedBy = msg.sender;

        emit LegacyClaimed(legacyOwner, msg.sender, block.timestamp);
    }



    
    function revokeLegacy() external nonReentrant whenNotPaused onlyLegacyOwner {
        delete _legacies[msg.sender];
        emit LegacyRevoked(msg.sender);
    }



    
    function updateBeneficiaries(
        address[] calldata newBeneficiaries
    ) external nonReentrant whenNotPaused onlyLegacyOwner {
        if (newBeneficiaries.length == 0) revert NoBeneficiaries();
        if (newBeneficiaries.length > MAX_BENEFICIARIES) revert TooManyBeneficiaries();
        _checkNoDuplicates(newBeneficiaries);

        LegacyConfig storage cfg = _legacies[msg.sender];
        cfg.beneficiaries = newBeneficiaries;
        cfg.lastHeartbeat = block.timestamp;

        emit BeneficiariesUpdated(msg.sender, newBeneficiaries.length);
    }

    
    function updateDelay(
        uint256 newDelaySeconds,
        uint256 newGracePeriodSeconds
    ) external nonReentrant whenNotPaused onlyLegacyOwner {
        if (newDelaySeconds < MIN_DELAY || newDelaySeconds > MAX_DELAY) revert InvalidDelay();
        if (newGracePeriodSeconds < MIN_GRACE_PERIOD || newGracePeriodSeconds > MAX_GRACE_PERIOD) revert InvalidGracePeriod();

        LegacyConfig storage cfg = _legacies[msg.sender];
        cfg.delaySeconds = newDelaySeconds;
        cfg.gracePeriodSeconds = newGracePeriodSeconds;
        cfg.lastHeartbeat = block.timestamp;

        emit DelayUpdated(msg.sender, newDelaySeconds, newGracePeriodSeconds);
    }

    
    function updateEnvelopeCid(
        string calldata newCid
    ) external nonReentrant whenNotPaused onlyLegacyOwner {
        if (bytes(newCid).length == 0) revert EmptyEnvelopeCid();

        LegacyConfig storage cfg = _legacies[msg.sender];
        cfg.envelopeCid = newCid;
        cfg.lastHeartbeat = block.timestamp;
    }



    
    function getLegacy(address legacyOwner) external view returns (
        string memory envelopeCid,
        uint256 delaySeconds,
        uint256 gracePeriodSeconds,
        uint256 lastHeartbeat,
        uint256 registeredAt,
        bool active,
        bool claimed,
        address claimedBy,
        uint256 beneficiaryCount
    ) {
        LegacyConfig storage cfg = _legacies[legacyOwner];
        return (
            cfg.envelopeCid,
            cfg.delaySeconds,
            cfg.gracePeriodSeconds,
            cfg.lastHeartbeat,
            cfg.registeredAt,
            cfg.active,
            cfg.claimed,
            cfg.claimedBy,
            cfg.beneficiaries.length
        );
    }

    
    function getLastHeartbeat(address legacyOwner) external view returns (uint256) {
        return _legacies[legacyOwner].lastHeartbeat;
    }

    
    function isClaimable(address legacyOwner) external view returns (bool) {
        LegacyConfig storage cfg = _legacies[legacyOwner];
        if (!cfg.active || cfg.claimed) return false;
        return _isClaimable(cfg);
    }

    
    function getBeneficiaries(address legacyOwner) external view returns (address[] memory) {
        return _legacies[legacyOwner].beneficiaries;
    }

    
    function isBeneficiary(address legacyOwner, address candidate) external view returns (bool) {
        return _isBeneficiary(_legacies[legacyOwner], candidate);
    }

    
    function getDeadline(address legacyOwner) external view returns (uint256) {
        LegacyConfig storage cfg = _legacies[legacyOwner];
        if (!cfg.active) return 0;
        return cfg.lastHeartbeat + cfg.delaySeconds + cfg.gracePeriodSeconds;
    }



    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }



    function _isClaimable(LegacyConfig storage cfg) internal view returns (bool) {
        return block.timestamp >= cfg.lastHeartbeat + cfg.delaySeconds + cfg.gracePeriodSeconds;
    }

    function _isBeneficiary(LegacyConfig storage cfg, address candidate) internal view returns (bool) {
        for (uint256 i = 0; i < cfg.beneficiaries.length; i++) {
            if (cfg.beneficiaries[i] == candidate) return true;
        }
        return false;
    }

    function _checkNoDuplicates(address[] calldata addrs) internal pure {
        for (uint256 i = 0; i < addrs.length; i++) {
            for (uint256 j = i + 1; j < addrs.length; j++) {
                if (addrs[i] == addrs[j]) revert DuplicateBeneficiary();
            }
        }
    }
}
