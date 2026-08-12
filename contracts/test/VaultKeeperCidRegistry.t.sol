
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/VaultKeeperCidRegistry.sol";

contract VaultKeeperCidRegistryTest is Test {
    VaultKeeperCidRegistry public registry;
    address public owner;
    address public alice;
    address public bob;


    event CidUpdated(address indexed account, string cid, uint256 timestamp);
    event CidDeleted(address indexed account, uint256 timestamp);
    event CooldownUpdated(uint256 oldCooldown, uint256 newCooldown);

    function setUp() public {
        owner = address(this);
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        registry = new VaultKeeperCidRegistry();
    }



    function test_setCid_basic() public {
        vm.prank(alice);
        registry.setCid("bafkreia_test_cid_123");

        assertEq(registry.getCid(alice), "bafkreia_test_cid_123");
        assertTrue(registry.hasCid(alice));
        assertGt(registry.getUpdatedAt(alice), 0);
    }

    function test_setCid_update() public {
        vm.prank(alice);
        registry.setCid("bafkreia_old");


        vm.warp(block.timestamp + 31);

        vm.prank(alice);
        registry.setCid("bafkreia_new");

        assertEq(registry.getCid(alice), "bafkreia_new");
    }

    function test_setCid_differentUsers() public {
        vm.prank(alice);
        registry.setCid("alice_cid");

        vm.prank(bob);
        registry.setCid("bob_cid");

        assertEq(registry.getCid(alice), "alice_cid");
        assertEq(registry.getCid(bob), "bob_cid");
    }

    function test_setCid_emitEvent() public {
        vm.prank(alice);
        vm.expectEmit(true, false, false, true);
        emit CidUpdated(alice, "test_cid", block.timestamp);
        registry.setCid("test_cid");
    }

    function test_setCid_revertEmpty() public {
        vm.prank(alice);
        vm.expectRevert(VaultKeeperCidRegistry.EmptyCid.selector);
        registry.setCid("");
    }

    function test_setCid_revertTooLong() public {

        bytes memory longCid = new bytes(129);
        for (uint256 i = 0; i < 129; i++) longCid[i] = "a";

        vm.prank(alice);
        vm.expectRevert(VaultKeeperCidRegistry.CidTooLong.selector);
        registry.setCid(string(longCid));
    }

    function test_setCid_maxLength() public {

        bytes memory maxCid = new bytes(128);
        for (uint256 i = 0; i < 128; i++) maxCid[i] = "b";

        vm.prank(alice);
        registry.setCid(string(maxCid));

        assertEq(bytes(registry.getCid(alice)).length, 128);
    }



    function test_cooldown_revert() public {
        vm.prank(alice);
        registry.setCid("first");


        vm.prank(alice);
        vm.expectRevert(
            abi.encodeWithSelector(
                VaultKeeperCidRegistry.CooldownNotExpired.selector,
                block.timestamp + 30 
            )
        );
        registry.setCid("second");
    }

    function test_cooldown_afterExpiry() public {
        vm.prank(alice);
        registry.setCid("first");


        vm.warp(block.timestamp + 31);

        vm.prank(alice);
        registry.setCid("second"); 
        assertEq(registry.getCid(alice), "second");
    }

    function test_cooldown_noAffectDifferentUsers() public {
        vm.prank(alice);
        registry.setCid("alice_cid");


        vm.prank(bob);
        registry.setCid("bob_cid"); 
    }

    function test_nextAllowedUpdate() public {

        assertEq(registry.nextAllowedUpdate(alice), 0);

        vm.prank(alice);
        registry.setCid("test");


        assertGt(registry.nextAllowedUpdate(alice), 0);


        vm.warp(block.timestamp + 31);
        assertEq(registry.nextAllowedUpdate(alice), 0);
    }



    function test_deleteCid() public {
        vm.prank(alice);
        registry.setCid("to_delete");

        assertTrue(registry.hasCid(alice));

        vm.warp(block.timestamp + 31);

        vm.prank(alice);
        registry.deleteCid();

        assertFalse(registry.hasCid(alice));
        assertEq(bytes(registry.getCid(alice)).length, 0);
    }

    function test_deleteCid_emitEvent() public {
        vm.prank(alice);
        registry.setCid("to_delete");

        vm.warp(block.timestamp + 31);

        vm.prank(alice);
        vm.expectEmit(true, false, false, true);
        emit CidDeleted(alice, block.timestamp);
        registry.deleteCid();
    }



    function test_getCid_nonExistent() public view {
        assertEq(bytes(registry.getCid(alice)).length, 0);
    }

    function test_hasCid_false() public view {
        assertFalse(registry.hasCid(alice));
    }

    function test_getUpdatedAt_zero() public view {
        assertEq(registry.getUpdatedAt(alice), 0);
    }



    function test_pause_blocksSetCid() public {
        registry.pause();

        vm.prank(alice);
        vm.expectRevert("Pausable: paused");
        registry.setCid("blocked");
    }

    function test_pause_blocksDeleteCid() public {
        vm.prank(alice);
        registry.setCid("existing");

        registry.pause();

        vm.warp(block.timestamp + 31);
        vm.prank(alice);
        vm.expectRevert("Pausable: paused");
        registry.deleteCid();
    }

    function test_unpause_restoresAccess() public {
        registry.pause();
        registry.unpause();

        vm.prank(alice);
        registry.setCid("works_again");
        assertEq(registry.getCid(alice), "works_again");
    }

    function test_pause_onlyOwner() public {
        vm.prank(alice);
        vm.expectRevert("Ownable: caller is not the owner");
        registry.pause();
    }



    function test_setCooldown() public {
        registry.setCooldown(60);
        assertEq(registry.cooldownSeconds(), 60);
    }

    function test_setCooldown_zero() public {
        registry.setCooldown(0);
        assertEq(registry.cooldownSeconds(), 0);


        vm.prank(alice);
        registry.setCid("first");

        vm.prank(alice);
        registry.setCid("second"); 
        assertEq(registry.getCid(alice), "second");
    }

    function test_setCooldown_revertTooHigh() public {
        vm.expectRevert(VaultKeeperCidRegistry.CooldownTooHigh.selector);
        registry.setCooldown(3601); 
    }

    function test_setCooldown_onlyOwner() public {
        vm.prank(alice);
        vm.expectRevert("Ownable: caller is not the owner");
        registry.setCooldown(60);
    }

    function test_setCooldown_emitEvent() public {
        vm.expectEmit(false, false, false, true);
        emit CooldownUpdated(30, 120);
        registry.setCooldown(120);
    }



    function testFuzz_setCid(string calldata cid) public {
        vm.assume(bytes(cid).length > 0 && bytes(cid).length <= 128);

        vm.prank(alice);
        registry.setCid(cid);
        assertEq(registry.getCid(alice), cid);
    }

    function testFuzz_cooldown(uint256 cooldown) public {
        cooldown = bound(cooldown, 0, 3600);
        registry.setCooldown(cooldown);
        assertEq(registry.cooldownSeconds(), cooldown);
    }
}
