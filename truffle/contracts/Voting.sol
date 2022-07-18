// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/// @title A voting contract (Alyra Project)
/// @author Guillaume Verbiguié
/// @notice You can use this contract for test purposes only
/// @dev All function calls are currently implemented without side effects
/// @custom:educational This is an educational contract.
contract Voting is Ownable {

    uint public winningProposalID;
    uint128 winningVote;
    
    ///@dev Structure of Voter
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
    ///@dev Structure of Proposal
    struct Proposal {
        string description;
        uint voteCount;
    }
    ///@dev WorkflowStatus
    ///@notice 6 states 
    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;

    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }
    

    // ::::::::::::: GETTERS ::::::::::::: //
    ///@notice Send description of one voter
    ///@param _addr voter address
    ///@return Voter description of one voter
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }
    ///@notice Send description of one proposal
    ///@param _id proposal id
    ///@return Proposal description of one proposal
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }

 
    // ::::::::::::: REGISTRATION ::::::::::::: // 
    ///@notice Add a voter
    ///@dev Emit the event about the voter registration
    ///@param _addr address of new voter
     function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');
    
        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }
 

    // ::::::::::::: PROPOSAL ::::::::::::: // 
    ///@notice Add a proposal
    ///@dev Emit event about the proposal
    ///@param _desc description of new proposal
    function addProposal(string memory _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), 'Vous ne pouvez pas ne rien proposer'); // facultatif
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1);
    }

    // ::::::::::::: VOTE ::::::::::::: //
    ///@notice Add a vote 
    ///@dev Keep the temporary winning proposal ID
    ///@param _id index of proposal to vote
    function setVote(uint128 _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session have not started yet");
        require(voters[msg.sender].hasVoted != true, "You have already voted");
        require(_id < proposalsArray.length, "Proposal not found");

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        if (proposalsArray[_id].voteCount > winningVote) {
            winningVote = uint128(proposalsArray[_id].voteCount);
            winningProposalID = _id;
        }

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //

    ///@notice Change status to ProposalsRegistrationStarted
    ///@dev  Emit relative event for change workflow status
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }
    ///@notice Change status to ProposalsRegistrationEnded
    ///@dev  Emit relative event for change workflow status
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }
    ///@notice Change status to VotingSessionStarted
    ///@dev  Emit relative event for change workflow status
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }
    ///@notice Change status to VotingSessionEnded
    ///@dev  Emit relative event for change workflow status
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    ///@notice Change status to VotesTallied
    ///@dev  Emit relative event for change workflow status
    function tallyVotes() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}