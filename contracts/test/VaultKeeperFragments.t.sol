
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/VaultKeeperFragments.sol";

contract VaultKeeperFragmentsTest is Test {
    VaultKeeperFragments public fragments;
    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");
    bytes32 public constant LOOKUP_HASH = keccak256("test-recovery-id");
    bytes public constant PAYLOAD_1 = hex"deadbeef01020304";
    bytes public constant PAYLOAD_2 = hex"cafe0102aabb";


    event FragmentStored(bytes32 indexed lookupIdHash, address indexed owner);
    event FragmentUpdated(bytes32 indexed lookupIdHash, address indexed owner);
    event FragmentDeleted(bytes32 indexed lookupIdHash, address indexed owner);

    function setUp() public {
        fragments = new VaultKeeperFragments();
    }



    function test_storeFragment_createsNew() public {
        vm.prank(user1);
        fragments.storeFragment(LOOKUP_HASH, PAYLOAD_1);

        assertEq(fragments.getFragment(LOOKUP_HASH), PAYLOAD_1);
        assertTrue(fragments.hasFragment(LOOKUP_HASH));
        assertEq(fragments.getFragmentOwner(LOOKUP_HASH), user1);
    }

    function test_storeFragment_emitsStoredEvent() public {
        vm.prank(user1);
        vm.expectEmit(true, true, false, false);
        emit FragmentStored(LOOKUP_HASH, user1);
        fragments.storeFragment(LOOKUP_HASH, PAYLOAD_1);
    }



    function test_storeFragment_ownerCanUpdate() public {
        vm.prank(user1);
        fragments.storeFragment(LOOKUP_HASH, PAYLOAD_1);

        vm.prank(user1);
        fragments.storeFragment(LOOKUP_HASH, PAYLOAD_2);

        assertEq(fragments.getFragment(LOOKUP_HASH), PAYLOAD_2);
        assertEq(fragments.getFragmentOwner(LOOKUP_HASH), user1);
    }

    function test_storeFragment_updateEmitsUpdatedEvent() public {
        vm.prank(user1);
        fragments.storeFragment(LOOKUP_HASH, PAYLOAD_1);

        vm.prank(user1);
        vm.expectEmit(true, true, false, false);
        emit FragmentUpdated(LOOKUP_HASH, user1);
        fragments.storeFragment(LOOKUP_HASH, PAYLOAD_2);
    }

    function test_storeFragment_nonOwnerCannotUpdate() public {
        vm.prank(user1);
        fragments.storeFragment(LOOKUP_HASH, PAYLOAD_1);

        vm.prank(user2);
        vm.expectRevert(VaultKeeperFragments.NotFragmentOwner.selector);
        fragments.storeFragment(LOOKUP_HASH, PAYLOAD_2);
    }



    function test_storeFragment_revertsOnEmptyPayload() public {
        vm.prank(user1);
        vm.expectRevert(VaultKeeperFragments.InvalidPayload.selector);
        fragments.storeFragment(LOOKUP_HASH, "");
    }

    function test_storeFragment_revertsOnTooLargePayload() public {
        bytes memory bigPayload = new bytes(1025);
        vm.prank(user1);
        vm.expectRevert(VaultKeeperFragments.InvalidPayload.selector);
        fragments.storeFragment(LOOKUP_HASH, bigPayload);
    }

    function test_storeFragment_acceptsMaxPayload() public {
        bytes memory maxPayload = new bytes(1024);
        vm.prank(user1);
        fragments.storeFragment(LOOKUP_HASH, maxPayload);
        assertEq(fragments.getFragment(LOOKUP_HASH).length, 1024);
    }



    function test_deleteFragment_ownerCanDelete() public {
        vm.prank(user1);
        fragments.storeFragment(LOOKUP_HASH, PAYLOAD_1);

        vm.prank(user1);
        fragments.deleteFragment(LOOKUP_HASH);

        assertFalse(fragments.hasFragment(LOOKUP_HASH));
        assertEq(fragments.getFragment(LOOKUP_HASH).length, 0);
        assertEq(fragments.getFragmentOwner(LOOKUP_HASH), address(0));
    }

    function test_deleteFragment_emitsDeletedEvent() public {
        vm.prank(user1);
        fragments.storeFragment(LOOKUP_HASH, PAYLOAD_1);

        vm.prank(user1);
        vm.expectEmit(true, true, false, false);
        emit FragmentDeleted(LOOKUP_HASH, user1);
        fragments.deleteFragment(LOOKUP_HASH);
    }

    function test_deleteFragment_nonOwnerCannotDelete() public {
        vm.prank(user1);
        fragments.storeFragment(LOOKUP_HASH, PAYLOAD_1);

        vm.prank(user2);
        vm.expectRevert(VaultKeeperFragments.NotFragmentOwner.selector);
        fragments.deleteFragment(LOOKUP_HASH);
    }

    function test_deleteFragment_revertsIfNotFound() public {
        vm.prank(user1);
        vm.expectRevert(VaultKeeperFragments.FragmentNotFound.selector);
        fragments.deleteFragment(LOOKUP_HASH);
    }

    function test_deleteFragment_thenRestore() public {

        vm.prank(user1);
        fragments.storeFragment(LOOKUP_HASH, PAYLOAD_1);

        vm.prank(user1);
        fragments.deleteFragment(LOOKUP_HASH);


        vm.prank(user2);
        fragments.storeFragment(LOOKUP_HASH, PAYLOAD_2);

        assertEq(fragments.getFragment(LOOKUP_HASH), PAYLOAD_2);
        assertEq(fragments.getFragmentOwner(LOOKUP_HASH), user2);
    }



    function test_getFragment_returnsEmptyForUnknown() public view {
        bytes memory result = fragments.getFragment(keccak256("unknown"));
        assertEq(result.length, 0);
    }

    function test_hasFragment_returnsFalseForUnknown() public view {
        assertFalse(fragments.hasFragment(keccak256("unknown")));
    }

    function test_getFragmentOwner_returnsZeroForUnknown() public view {
        assertEq(fragments.getFragmentOwner(keccak256("unknown")), address(0));
    }



    function test_pause_blocksStore() public {
        fragments.pause();

        vm.prank(user1);
        vm.expectRevert("Pausable: paused");
        fragments.storeFragment(LOOKUP_HASH, PAYLOAD_1);
    }

    function test_pause_blocksDelete() public {

        vm.prank(user1);
        fragments.storeFragment(LOOKUP_HASH, PAYLOAD_1);

        fragments.pause();

        vm.prank(user1);
        vm.expectRevert("Pausable: paused");
        fragments.deleteFragment(LOOKUP_HASH);
    }

    function test_unpause_allowsOperations() public {
        fragments.pause();
        fragments.unpause();

        vm.prank(user1);
        fragments.storeFragment(LOOKUP_HASH, PAYLOAD_1);
        assertEq(fragments.getFragment(LOOKUP_HASH), PAYLOAD_1);
    }

    function test_pause_onlyOwner() public {
        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        fragments.pause();
    }



    function test_multipleFragments_independent() public {
        bytes32 hash1 = keccak256("id-1");
        bytes32 hash2 = keccak256("id-2");

        vm.prank(user1);
        fragments.storeFragment(hash1, PAYLOAD_1);

        vm.prank(user2);
        fragments.storeFragment(hash2, PAYLOAD_2);

        assertEq(fragments.getFragment(hash1), PAYLOAD_1);
        assertEq(fragments.getFragmentOwner(hash1), user1);
        assertEq(fragments.getFragment(hash2), PAYLOAD_2);
        assertEq(fragments.getFragmentOwner(hash2), user2);
    }
}
