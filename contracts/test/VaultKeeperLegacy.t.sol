
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/VaultKeeperLegacy.sol";

contract VaultKeeperLegacyTest is Test {
    VaultKeeperLegacy public legacy;
    address public owner1 = makeAddr("owner1");
    address public owner2 = makeAddr("owner2");
    address public beneficiary1 = makeAddr("beneficiary1");
    address public beneficiary2 = makeAddr("beneficiary2");
    address public beneficiary3 = makeAddr("beneficiary3");
    address public outsider = makeAddr("outsider");

    string public constant CID = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
    string public constant CID_2 = "bafybeihykld7uyxzogax6vgyvag42y7464eywpf55gxi5qpk7ry25pey7e";
    uint256 public constant DELAY_60_DAYS = 60 days;
    uint256 public constant GRACE_7_DAYS = 7 days;


    event LegacyRegistered(address indexed owner, uint256 delaySeconds, uint256 beneficiaryCount);
    event HeartbeatSent(address indexed owner, uint256 timestamp);
    event LegacyClaimed(address indexed owner, address indexed beneficiary, uint256 timestamp);
    event LegacyRevoked(address indexed owner);
    event BeneficiariesUpdated(address indexed owner, uint256 newCount);
    event DelayUpdated(address indexed owner, uint256 newDelay, uint256 newGracePeriod);

    function setUp() public {
        legacy = new VaultKeeperLegacy();
    }



    function _beneficiaries1() internal view returns (address[] memory) {
        address[] memory b = new address[](1);
        b[0] = beneficiary1;
        return b;
    }

    function _beneficiaries2() internal view returns (address[] memory) {
        address[] memory b = new address[](2);
        b[0] = beneficiary1;
        b[1] = beneficiary2;
        return b;
    }

    function _beneficiaries3() internal view returns (address[] memory) {
        address[] memory b = new address[](3);
        b[0] = beneficiary1;
        b[1] = beneficiary2;
        b[2] = beneficiary3;
        return b;
    }

    function _beneficiaries5() internal view returns (address[] memory) {
        address[] memory b = new address[](5);
        b[0] = beneficiary1;
        b[1] = beneficiary2;
        b[2] = beneficiary3;
        b[3] = address(0x4444);
        b[4] = address(0x5555);
        return b;
    }

    function _registerDefault() internal {
        vm.prank(owner1);
        legacy.registerLegacy(CID, DELAY_60_DAYS, GRACE_7_DAYS, _beneficiaries2());
    }



    function test_register_with1Beneficiary() public {
        vm.prank(owner1);
        legacy.registerLegacy(CID, DELAY_60_DAYS, GRACE_7_DAYS, _beneficiaries1());

        (,,,, , bool active,,, uint256 count) = legacy.getLegacy(owner1);
        assertTrue(active);
        assertEq(count, 1);
    }

    function test_register_with5Beneficiaries() public {
        vm.prank(owner1);
        legacy.registerLegacy(CID, DELAY_60_DAYS, GRACE_7_DAYS, _beneficiaries5());

        (,,,, , bool active,,, uint256 count) = legacy.getLegacy(owner1);
        assertTrue(active);
        assertEq(count, 5);
    }

    function test_register_emitsEvent() public {
        vm.prank(owner1);
        vm.expectEmit(true, false, false, true);
        emit LegacyRegistered(owner1, DELAY_60_DAYS, 2);
        legacy.registerLegacy(CID, DELAY_60_DAYS, GRACE_7_DAYS, _beneficiaries2());
    }

    function test_register_setsLastHeartbeat() public {
        vm.warp(1000);
        vm.prank(owner1);
        legacy.registerLegacy(CID, DELAY_60_DAYS, GRACE_7_DAYS, _beneficiaries1());

        assertEq(legacy.getLastHeartbeat(owner1), 1000);
    }

    function test_register_storesEnvelopeCid() public {
        vm.prank(owner1);
        legacy.registerLegacy(CID, DELAY_60_DAYS, GRACE_7_DAYS, _beneficiaries1());

        (string memory cid,,,,,,,,) = legacy.getLegacy(owner1);
        assertEq(cid, CID);
    }



    function test_register_revertsWith6Beneficiaries() public {
        address[] memory b = new address[](6);
        b[0] = address(0x1001);
        b[1] = address(0x1002);
        b[2] = address(0x1003);
        b[3] = address(0x1004);
        b[4] = address(0x1005);
        b[5] = address(0x1006);

        vm.prank(owner1);
        vm.expectRevert(VaultKeeperLegacy.TooManyBeneficiaries.selector);
        legacy.registerLegacy(CID, DELAY_60_DAYS, GRACE_7_DAYS, b);
    }

    function test_register_revertsWithZeroBeneficiaries() public {
        address[] memory b = new address[](0);

        vm.prank(owner1);
        vm.expectRevert(VaultKeeperLegacy.NoBeneficiaries.selector);
        legacy.registerLegacy(CID, DELAY_60_DAYS, GRACE_7_DAYS, b);
    }

    function test_register_revertsWithDelayTooShort() public {
        vm.prank(owner1);
        vm.expectRevert(VaultKeeperLegacy.InvalidDelay.selector);
        legacy.registerLegacy(CID, 29 days, GRACE_7_DAYS, _beneficiaries1());
    }

    function test_register_revertsWithDelayTooLong() public {
        vm.prank(owner1);
        vm.expectRevert(VaultKeeperLegacy.InvalidDelay.selector);
        legacy.registerLegacy(CID, 731 days, GRACE_7_DAYS, _beneficiaries1());
    }

    function test_register_revertsWithGraceTooShort() public {
        vm.prank(owner1);
        vm.expectRevert(VaultKeeperLegacy.InvalidGracePeriod.selector);
        legacy.registerLegacy(CID, DELAY_60_DAYS, 2 days, _beneficiaries1());
    }

    function test_register_revertsWithGraceTooLong() public {
        vm.prank(owner1);
        vm.expectRevert(VaultKeeperLegacy.InvalidGracePeriod.selector);
        legacy.registerLegacy(CID, DELAY_60_DAYS, 31 days, _beneficiaries1());
    }

    function test_register_revertsIfAlreadyActive() public {
        _registerDefault();

        vm.prank(owner1);
        vm.expectRevert(VaultKeeperLegacy.AlreadyActive.selector);
        legacy.registerLegacy(CID, DELAY_60_DAYS, GRACE_7_DAYS, _beneficiaries1());
    }

    function test_register_revertsWithEmptyCid() public {
        vm.prank(owner1);
        vm.expectRevert(VaultKeeperLegacy.EmptyEnvelopeCid.selector);
        legacy.registerLegacy("", DELAY_60_DAYS, GRACE_7_DAYS, _beneficiaries1());
    }

    function test_register_revertsWithDuplicateBeneficiaries() public {
        address[] memory b = new address[](2);
        b[0] = beneficiary1;
        b[1] = beneficiary1;

        vm.prank(owner1);
        vm.expectRevert(VaultKeeperLegacy.DuplicateBeneficiary.selector);
        legacy.registerLegacy(CID, DELAY_60_DAYS, GRACE_7_DAYS, b);
    }



    function test_heartbeat_resetsTimer() public {
        _registerDefault();

        vm.warp(block.timestamp + 10 days);
        vm.prank(owner1);
        legacy.heartbeat();

        assertEq(legacy.getLastHeartbeat(owner1), block.timestamp);
    }

    function test_heartbeat_emitsEvent() public {
        _registerDefault();
        vm.warp(block.timestamp + 2 hours);

        vm.prank(owner1);
        vm.expectEmit(true, false, false, true);
        emit HeartbeatSent(owner1, block.timestamp);
        legacy.heartbeat();
    }

    function test_heartbeat_revertsCooldown() public {
        _registerDefault();


        vm.prank(owner1);
        vm.expectRevert(VaultKeeperLegacy.HeartbeatCooldown.selector);
        legacy.heartbeat();
    }

    function test_heartbeat_succeedsAfterCooldown() public {
        _registerDefault();

        vm.warp(block.timestamp + 1 hours + 1);
        vm.prank(owner1);
        legacy.heartbeat(); 
    }

    function test_heartbeat_revertsIfNotActive() public {
        vm.prank(outsider);
        vm.expectRevert(VaultKeeperLegacy.NotActive.selector);
        legacy.heartbeat();
    }



    function test_claim_succeedsAfterFullExpiry() public {
        _registerDefault();


        vm.warp(block.timestamp + DELAY_60_DAYS + GRACE_7_DAYS + 1);

        vm.prank(beneficiary1);
        legacy.claimLegacy(owner1);

        (,,,,, , bool claimed, address claimedBy,) = legacy.getLegacy(owner1);
        assertTrue(claimed);
        assertEq(claimedBy, beneficiary1);
    }

    function test_claim_emitsEvent() public {
        _registerDefault();
        vm.warp(block.timestamp + DELAY_60_DAYS + GRACE_7_DAYS + 1);

        vm.prank(beneficiary1);
        vm.expectEmit(true, true, false, true);
        emit LegacyClaimed(owner1, beneficiary1, block.timestamp);
        legacy.claimLegacy(owner1);
    }

    function test_claim_revertsBeforeExpiry() public {
        _registerDefault();


        vm.warp(block.timestamp + DELAY_60_DAYS - 1);
        vm.prank(beneficiary1);
        vm.expectRevert(VaultKeeperLegacy.NotClaimable.selector);
        legacy.claimLegacy(owner1);
    }

    function test_claim_revertsDuringGracePeriod() public {
        _registerDefault();


        vm.warp(block.timestamp + DELAY_60_DAYS + GRACE_7_DAYS - 1);
        vm.prank(beneficiary1);
        vm.expectRevert(VaultKeeperLegacy.NotClaimable.selector);
        legacy.claimLegacy(owner1);
    }

    function test_claim_revertsForNonBeneficiary() public {
        _registerDefault();
        vm.warp(block.timestamp + DELAY_60_DAYS + GRACE_7_DAYS + 1);

        vm.prank(outsider);
        vm.expectRevert(VaultKeeperLegacy.NotBeneficiary.selector);
        legacy.claimLegacy(owner1);
    }

    function test_claim_revertsIfAlreadyClaimed() public {
        _registerDefault();
        vm.warp(block.timestamp + DELAY_60_DAYS + GRACE_7_DAYS + 1);

        vm.prank(beneficiary1);
        legacy.claimLegacy(owner1);

        vm.prank(beneficiary2);
        vm.expectRevert(VaultKeeperLegacy.AlreadyClaimed.selector);
        legacy.claimLegacy(owner1);
    }

    function test_claim_revertsAfterRevocation() public {
        _registerDefault();

        vm.prank(owner1);
        legacy.revokeLegacy();

        vm.warp(block.timestamp + DELAY_60_DAYS + GRACE_7_DAYS + 1);
        vm.prank(beneficiary1);
        vm.expectRevert(VaultKeeperLegacy.NotActive.selector);
        legacy.claimLegacy(owner1);
    }

    function test_claim_preventedByHeartbeat() public {
        _registerDefault();


        vm.warp(block.timestamp + 50 days);
        vm.prank(owner1);
        legacy.heartbeat(); 


        vm.warp(block.timestamp + 50 days);
        vm.prank(beneficiary1);
        vm.expectRevert(VaultKeeperLegacy.NotClaimable.selector);
        legacy.claimLegacy(owner1);


        vm.warp(block.timestamp + 17 days + 1); 
        vm.prank(beneficiary1);
        legacy.claimLegacy(owner1); 
    }



    function test_revoke_success() public {
        _registerDefault();

        vm.prank(owner1);
        legacy.revokeLegacy();

        (,,,,, bool active,,,) = legacy.getLegacy(owner1);
        assertFalse(active);
    }

    function test_revoke_emitsEvent() public {
        _registerDefault();

        vm.prank(owner1);
        vm.expectEmit(true, false, false, false);
        emit LegacyRevoked(owner1);
        legacy.revokeLegacy();
    }

    function test_revoke_revertsForNonOwner() public {
        _registerDefault();

        vm.prank(outsider);
        vm.expectRevert(VaultKeeperLegacy.NotActive.selector);
        legacy.revokeLegacy();
    }

    function test_revoke_allowsReRegistration() public {
        _registerDefault();

        vm.prank(owner1);
        legacy.revokeLegacy();


        vm.prank(owner1);
        legacy.registerLegacy(CID_2, 90 days, 14 days, _beneficiaries3());

        (string memory cid,,,, , bool active,,, uint256 count) = legacy.getLegacy(owner1);
        assertTrue(active);
        assertEq(count, 3);
        assertEq(cid, CID_2);
    }



    function test_updateBeneficiaries_success() public {
        _registerDefault();

        vm.prank(owner1);
        legacy.updateBeneficiaries(_beneficiaries3());

        address[] memory b = legacy.getBeneficiaries(owner1);
        assertEq(b.length, 3);
        assertTrue(legacy.isBeneficiary(owner1, beneficiary3));
    }

    function test_updateBeneficiaries_resetsHeartbeat() public {
        _registerDefault();
        uint256 initialHeartbeat = legacy.getLastHeartbeat(owner1);

        vm.warp(block.timestamp + 10 days);
        vm.prank(owner1);
        legacy.updateBeneficiaries(_beneficiaries3());

        assertTrue(legacy.getLastHeartbeat(owner1) > initialHeartbeat);
    }

    function test_updateBeneficiaries_revertsTooMany() public {
        _registerDefault();
        address[] memory b = new address[](6);
        b[0] = address(0x2001);
        b[1] = address(0x2002);
        b[2] = address(0x2003);
        b[3] = address(0x2004);
        b[4] = address(0x2005);
        b[5] = address(0x2006);

        vm.prank(owner1);
        vm.expectRevert(VaultKeeperLegacy.TooManyBeneficiaries.selector);
        legacy.updateBeneficiaries(b);
    }



    function test_updateDelay_success() public {
        _registerDefault();

        vm.warp(block.timestamp + 10 days);
        vm.prank(owner1);
        legacy.updateDelay(90 days, 14 days);

        (, uint256 delay, uint256 grace,,,,,,) = legacy.getLegacy(owner1);
        assertEq(delay, 90 days);
        assertEq(grace, 14 days);
    }

    function test_updateDelay_resetsHeartbeat() public {
        _registerDefault();
        vm.warp(block.timestamp + 10 days);

        vm.prank(owner1);
        legacy.updateDelay(90 days, 14 days);

        assertEq(legacy.getLastHeartbeat(owner1), block.timestamp);
    }

    function test_updateDelay_revertsInvalidDelay() public {
        _registerDefault();

        vm.prank(owner1);
        vm.expectRevert(VaultKeeperLegacy.InvalidDelay.selector);
        legacy.updateDelay(1 days, GRACE_7_DAYS);
    }



    function test_isClaimable_falseWhenFresh() public {
        _registerDefault();
        assertFalse(legacy.isClaimable(owner1));
    }

    function test_isClaimable_trueAfterExpiry() public {
        _registerDefault();
        vm.warp(block.timestamp + DELAY_60_DAYS + GRACE_7_DAYS + 1);
        assertTrue(legacy.isClaimable(owner1));
    }

    function test_isClaimable_falseAfterClaim() public {
        _registerDefault();
        vm.warp(block.timestamp + DELAY_60_DAYS + GRACE_7_DAYS + 1);
        vm.prank(beneficiary1);
        legacy.claimLegacy(owner1);

        assertFalse(legacy.isClaimable(owner1));
    }

    function test_getDeadline_calculatesCorrectly() public {
        vm.warp(1000);
        vm.prank(owner1);
        legacy.registerLegacy(CID, DELAY_60_DAYS, GRACE_7_DAYS, _beneficiaries1());

        uint256 deadline = legacy.getDeadline(owner1);
        assertEq(deadline, 1000 + DELAY_60_DAYS + GRACE_7_DAYS);
    }

    function test_getDeadline_zeroWhenNotActive() public view {
        assertEq(legacy.getDeadline(outsider), 0);
    }

    function test_isBeneficiary_trueForRegistered() public {
        _registerDefault();
        assertTrue(legacy.isBeneficiary(owner1, beneficiary1));
        assertTrue(legacy.isBeneficiary(owner1, beneficiary2));
    }

    function test_isBeneficiary_falseForOutsider() public {
        _registerDefault();
        assertFalse(legacy.isBeneficiary(owner1, outsider));
    }



    function test_updateEnvelopeCid_success() public {
        _registerDefault();

        vm.warp(block.timestamp + 2 hours);
        vm.prank(owner1);
        legacy.updateEnvelopeCid(CID_2);

        (string memory cid,,,,,,,,) = legacy.getLegacy(owner1);
        assertEq(cid, CID_2);
    }

    function test_updateEnvelopeCid_revertsEmpty() public {
        _registerDefault();

        vm.prank(owner1);
        vm.expectRevert(VaultKeeperLegacy.EmptyEnvelopeCid.selector);
        legacy.updateEnvelopeCid("");
    }



    function test_pause_blocksRegistration() public {
        legacy.pause();

        vm.prank(owner1);
        vm.expectRevert("Pausable: paused");
        legacy.registerLegacy(CID, DELAY_60_DAYS, GRACE_7_DAYS, _beneficiaries1());
    }

    function test_pause_blocksHeartbeat() public {
        _registerDefault();
        legacy.pause();

        vm.warp(block.timestamp + 2 hours);
        vm.prank(owner1);
        vm.expectRevert("Pausable: paused");
        legacy.heartbeat();
    }

    function test_pause_blocksClaim() public {
        _registerDefault();
        vm.warp(block.timestamp + DELAY_60_DAYS + GRACE_7_DAYS + 1);
        legacy.pause();

        vm.prank(beneficiary1);
        vm.expectRevert("Pausable: paused");
        legacy.claimLegacy(owner1);
    }

    function test_unpause_allowsOperations() public {
        legacy.pause();
        legacy.unpause();

        vm.prank(owner1);
        legacy.registerLegacy(CID, DELAY_60_DAYS, GRACE_7_DAYS, _beneficiaries1());

        (,,,,, bool active,,,) = legacy.getLegacy(owner1);
        assertTrue(active);
    }

    function test_pause_onlyAdmin() public {
        vm.prank(owner1);
        vm.expectRevert("Ownable: caller is not the owner");
        legacy.pause();
    }



    function test_multipleOwners_independent() public {
        vm.prank(owner1);
        legacy.registerLegacy(CID, DELAY_60_DAYS, GRACE_7_DAYS, _beneficiaries1());

        vm.prank(owner2);
        legacy.registerLegacy(CID_2, 90 days, 14 days, _beneficiaries2());

        (string memory cid1,,,, , bool active1,,, uint256 count1) = legacy.getLegacy(owner1);
        (string memory cid2,,,, , bool active2,,, uint256 count2) = legacy.getLegacy(owner2);

        assertTrue(active1);
        assertTrue(active2);
        assertEq(cid1, CID);
        assertEq(cid2, CID_2);
        assertEq(count1, 1);
        assertEq(count2, 2);
    }
}
