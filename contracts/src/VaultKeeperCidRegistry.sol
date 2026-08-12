
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract VaultKeeperCidRegistry is ReentrancyGuard, Pausable, Ownable {




    mapping(address => string) private _cids;


    mapping(address => uint256) private _updatedAt;


    uint256 public cooldownSeconds;




    uint256 public constant MAX_CID_LENGTH = 128;


    uint256 public constant DEFAULT_COOLDOWN = 30;


    uint256 public constant MAX_COOLDOWN = 3600;



    event CidUpdated(
        address indexed account,
        string cid,
        uint256 timestamp
    );

    event CidDeleted(
        address indexed account,
        uint256 timestamp
    );

    event CooldownUpdated(
        uint256 oldCooldown,
        uint256 newCooldown
    );




    error EmptyCid();


    error CidTooLong();


    error CooldownNotExpired(uint256 nextAllowedTimestamp);


    error CooldownTooHigh();



    constructor() {
        cooldownSeconds = DEFAULT_COOLDOWN;
    }



    
    modifier cooldownExpired() {
        _checkCooldown();
        _;
    }

    function _checkCooldown() internal view {
        uint256 lastUpdate = _updatedAt[msg.sender];
        if (lastUpdate > 0) {
            uint256 nextAllowed = lastUpdate + cooldownSeconds;
            if (block.timestamp < nextAllowed) {
                revert CooldownNotExpired(nextAllowed);
            }
        }
    }



    
    function setCid(string calldata cid)
        external
        nonReentrant
        whenNotPaused
        cooldownExpired
    {
        uint256 len = bytes(cid).length;
        if (len == 0) revert EmptyCid();
        if (len > MAX_CID_LENGTH) revert CidTooLong();

        _cids[msg.sender] = cid;
        _updatedAt[msg.sender] = block.timestamp;

        emit CidUpdated(msg.sender, cid, block.timestamp);
    }

    
    function deleteCid()
        external
        nonReentrant
        whenNotPaused
        cooldownExpired
    {
        delete _cids[msg.sender];
        _updatedAt[msg.sender] = block.timestamp;

        emit CidDeleted(msg.sender, block.timestamp);
    }



    
    function getCid(address account) external view returns (string memory) {
        return _cids[account];
    }

    
    function getUpdatedAt(address account) external view returns (uint256) {
        return _updatedAt[account];
    }

    
    function hasCid(address account) external view returns (bool) {
        return bytes(_cids[account]).length > 0;
    }

    
    function nextAllowedUpdate(address account) external view returns (uint256) {
        uint256 lastUpdate = _updatedAt[account];
        if (lastUpdate == 0) return 0;
        uint256 nextAllowed = lastUpdate + cooldownSeconds;
        if (block.timestamp >= nextAllowed) return 0;
        return nextAllowed;
    }



    
    function setCooldown(uint256 newCooldown) external onlyOwner {
        if (newCooldown > MAX_COOLDOWN) revert CooldownTooHigh();

        uint256 oldCooldown = cooldownSeconds;
        cooldownSeconds = newCooldown;

        emit CooldownUpdated(oldCooldown, newCooldown);
    }

    
    function pause() external onlyOwner {
        _pause();
    }

    
    function unpause() external onlyOwner {
        _unpause();
    }
}
