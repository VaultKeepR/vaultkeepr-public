
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";


contract VaultKeeperFragments is ReentrancyGuard, Pausable, Ownable, EIP712 {
    using ECDSA for bytes32;
    struct Fragment {
        address owner;
        bytes data;
    }

    mapping(bytes32 => Fragment) private _fragments;

    event FragmentStored(bytes32 indexed lookupIdHash, address indexed owner);
    event FragmentUpdated(bytes32 indexed lookupIdHash, address indexed owner);
    event FragmentDeleted(bytes32 indexed lookupIdHash, address indexed owner);

    error InvalidPayload();
    error NotFragmentOwner();
    error FragmentNotFound();

    error InvalidSignature();

    bytes32 constant STORE_FRAGMENT_TYPEHASH = keccak256(
        "StoreFragmentMeta(bytes32 lookupIdHash,bytes encryptedPayload,address owner)"
    );

    constructor() EIP712("VaultKeeperFragments", "1") {}

    
    function storeFragment(bytes32 lookupIdHash, bytes calldata encryptedPayload)
        external
        nonReentrant
        whenNotPaused
    {
        if (encryptedPayload.length == 0 || encryptedPayload.length > 1024) revert InvalidPayload();

        Fragment storage frag = _fragments[lookupIdHash];

        if (frag.owner == address(0)) {

            frag.owner = msg.sender;
            frag.data = encryptedPayload;
            emit FragmentStored(lookupIdHash, msg.sender);
        } else {

            if (frag.owner != msg.sender) revert NotFragmentOwner();
            frag.data = encryptedPayload;
            emit FragmentUpdated(lookupIdHash, msg.sender);
        }
    }

    
    function storeFragmentMeta(
        bytes32 lookupIdHash,
        bytes calldata encryptedPayload,
        address owner,
        bytes calldata signature
    ) external nonReentrant whenNotPaused {
        if (encryptedPayload.length == 0 || encryptedPayload.length > 1024) revert InvalidPayload();


        bytes32 structHash = keccak256(
            abi.encode(STORE_FRAGMENT_TYPEHASH, lookupIdHash, keccak256(encryptedPayload), owner)
        );
        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = digest.recover(signature);
        if (signer != owner) revert InvalidSignature();

        Fragment storage frag = _fragments[lookupIdHash];

        if (frag.owner == address(0)) {

            frag.owner = owner;
            frag.data = encryptedPayload;
            emit FragmentStored(lookupIdHash, owner);
        } else {

            if (frag.owner != owner) revert NotFragmentOwner();
            frag.data = encryptedPayload;
            emit FragmentUpdated(lookupIdHash, owner);
        }
    }

    
    function deleteFragment(bytes32 lookupIdHash)
        external
        nonReentrant
        whenNotPaused
    {
        Fragment storage frag = _fragments[lookupIdHash];
        if (frag.owner == address(0)) revert FragmentNotFound();
        if (frag.owner != msg.sender) revert NotFragmentOwner();

        delete _fragments[lookupIdHash];
        emit FragmentDeleted(lookupIdHash, msg.sender);
    }

    
    function getFragment(bytes32 lookupIdHash) external view returns (bytes memory) {
        return _fragments[lookupIdHash].data;
    }

    
    function hasFragment(bytes32 lookupIdHash) external view returns (bool) {
        return _fragments[lookupIdHash].owner != address(0);
    }

    
    function getFragmentOwner(bytes32 lookupIdHash) external view returns (address) {
        return _fragments[lookupIdHash].owner;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
