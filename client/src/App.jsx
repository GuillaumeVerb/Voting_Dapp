import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class Workflow extends React.Component {

   startDapp() {
        
        if (this.props.workflowStatus === '0') {
            return <div>
                Registering Voters
            </div>
        } else {
            return <div>
                Voters Registeration Ended
            </div>
        }
    }

    startProposalsRegistering() {

        if (this.props.workflowStatus === '0' && this.props.voterOwner) {
            return <div>
            <button onClick={async () => {
                await this.props.contract.methods.startProposalsRegistering().send({ from: this.props.accounts[0] });
                this.props.onWorkflowChange()
            }}>Start proposals registering</button>
        </div>
        } else {
            return <div>
                Proposals Registration Started
            </div>
        }
    }


    endProposalsRegistering() {
        
        if (this.props.workflowStatus === '1' && this.props.voterOwner) {
            return <div>
                <button onClick={async () => {
                    await this.props.contract.methods.endProposalsRegistering().send({ from: this.props.accounts[0] });
                    this.props.onWorkflowChange()
                }}>End proposals registering</button>
            </div>
        } else {
            return <div>
                Proposals Registration Ended
            </div>
        }
    }

    startVotingSession() {
        
        if (this.props.workflowStatus === '2' && this.props.voterOwner) {
            return <div>
                <button onClick={async () => {
                    await this.props.contract.methods.startVotingSession().send({ from: this.props.accounts[0] });
                    this.props.onWorkflowChange()
                }}>Start voting session</button>
            </div>
        } else {
            return <div>
                Voting Session Started
            </div>
        }
    }

    endVotingSession() {
       
        if (this.props.workflowStatus === '3' && this.props.voterOwner) {
            return <div>
                <button onClick={async () => {
                    await this.props.contract.methods.endVotingSession().send({ from: this.props.accounts[0] });
                    this.props.onWorkflowChange()
                }}>End voting session</button>
            </div>
        } else {
            return <div>
                Voting Session Ended
            </div>
        }
    }

    tallyVotes() {
        
        if (this.props.workflowStatus === '4' && this.props.voterOwner) {
            return <div>
                <button onClick={async () => {
                    await this.props.contract.methods.tallyVotes().send({ from: this.props.accounts[0] });
                    this.props.onWorkflowChange()
                }}>Tally votes</button>
            </div>
        } else {
            return <div>
                Votes Tallied
            </div>
        }
    }

    render() {
        return(
            <div>
                { this.startDapp() }
                { this.startProposalsRegistering() }
                { this.endProposalsRegistering() }
                { this.startVotingSession() }
                { this.endVotingSession() }
                { this.tallyVotes() }
            </div>
        )
    }
}


class ListVoterProp extends React.Component {

    addVoter = async () => {
        let voterAddress = document.getElementById("addVoterButton").value;
        if (voterAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
            await this.props.contract.methods.addVoter(voterAddress).send({from: this.props.accounts[0]});
            await this.props.voterListChange();
        } 
        document.getElementById('addVoterButton').value = "";
    };

    addProposal = async () => {
        let proposalDescription = document.getElementById("addPropButton").value;
        if (proposalDescription.match(/.*\S.*/)) {
            await this.props.contract.methods.addProposal(proposalDescription).send({ from: this.props.accounts[0] });
            await this.props.onProposalChange();
        } 
        document.getElementById('addPropButton').value = "";
    };



    voterWhitelist() {
        if(this.props.voterOwner) {
            if (this.props.workflowStatus === '0') {
                return <div>
                    <h3>Voter whitelist : </h3>
                    <input type="text" id="addVoterButton"/>
                    <button class="button" onClick={this.addVoter}>Add on Whitelist</button>
                    <p>There is the Voter whitelist :</p>
                    <table>
                        <tbody>
                        {this.props.whitelist.map((a) => (
                            <tr key={a}><td>{a}</td></tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            } else {
                return <div>
                    <h3>Voter whitelist : </h3>
                    <p>You can't add voter at this step.</p>
                    <p>There is the Voter whitelist :</p>
                    <table>
                        <tbody>
                        {this.props.whitelist.map((a) => (
                            <tr key={a}><td>{a}</td></tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            }
        }
        if(this.props.rightVoter && this.props.workflowStatus === '5') {
                const list = [];
                list.push(<tr><td>Voter address</td><td>vote</td></tr>);
                for (let i = 0; i < this.props.voteList.length; i++) {
                    list.push(<tr>
                        <td>{this.props.voteList[i].voterAddress.toString()}</td>
                        <td>{this.props.voteList[i].proposal.toString()}</td>
                    </tr>);
                }
                return <div>
                    <p>List of voters.</p>
                    <table>
                        <tbody>
                            {list}
                        </tbody>
                    </table>
                <p>You have been registered.</p>
                </div>
        } else {
            return <p>You are not registered.</p>
        }
    }

    voteProposal = async (_param) => {
        if (!this.props.hasVoted) {
            await this.props.contract.methods.setVote(_param).send({ from: this.props.accounts[0] });
            await this.props.onVoteChange();
        }
    };

    proposals () {
        const proposalList =
        <table>
            <tbody>
            {this.props.proposalList.map((prop) => (
                <tr>
                    <td>{prop.description}</td>
                </tr>
            ))}
            </tbody>
        </table>;

        if (!this.props.rightVoter) {
            return <div>
                <p>You are not registered yet, if you want to participate, you have to be registered</p>
            </div>
        } else {
            if (this.props.workflowStatus === '0' || this.props.workflowStatus === '1' || this.props.workflowStatus === '2') {
                return <div>
                    <p>You are registered, the vote session has not started. </p>
                    {proposalList}
                </div>
            }
            if(this.props.workflowStatus === '0') {
                return <div>
                    <p>The proposal registration has not started yet.</p>
                </div>
            } else if (this.props.workflowStatus === '1') {
                return <div>
                    <input type="text" id="addPropButton"/>
                    <button className="button" onClick={this.addProposal}>Add proposal</button>
                </div>
            } else if (this.props.workflowStatus === '2') {
                return <div>
                    <p>The proposal registration has Ended.</p>
                </div>
            } else if (this.props.workflowStatus === '3' && !this.props.hasVoted) {
                return <div>
                    <p>The vote session is open.</p>
                </div>
            } else if (this.props.workflowStatus === '3' && this.props.hasVoted) {
                if (this.props.hasVoted) {
                    return <div>
                        <p>You are registered and have already voted. </p>
                        {proposalList}
                    </div>
                } else {
                    const list = [];
                    for (let i = 0; i < this.props.proposalList.length; i++) {
                        list.push(
                            <tr><td>{this.props.proposalList[i].description}</td>
                                <td><button className="button" onClick={() => this.voteProposal(i)}>Vote for this proposal</button></td></tr>
                        );
                    }
                    return <table>
                        <tbody>
                        {list}
                        </tbody>
                    </table>
                }
            } 
            else if (this.props.workflowStatus === '4') {
                return <div>
                    <p>The vote session has ended.</p>
                </div>
            }

            if (this.props.workflowStatus === '5') {
                return <div>
                    <p>The vote has ended. The proposal with the most votes is : </p>
                    <span>
                        {this.props.winningProposal}
                    </span>
                </div>
            }
        }

    };

    render(){
        return(
            <>
            <div>
                <h3>Whitelist Status</h3>
                { this.voterWhitelist() }
            </div>
            <div>
                <h3>Proposals</h3>
                { this.proposals() }
            </div>
            </>
        )
    }
}


class ParticipantAddr extends React.Component {

    state = {
        balance: null,
        network: null
    };

    componentDidMount = async () => {
        this.getState();
    };

    async getState() {
        const result = await this.props.web3.eth.getBalance(this.props.address.toString());
        const result_net = await this.props.web3.eth.getChainId();
        const network = this.switchNetwork(result_net.toString());

        let balance = this.props.web3.utils.fromWei(result, "ether") + " eth";

        this.setState({ balance });
        this.setState({ network });
    }

    switchNetwork(networkId) {
        switch (networkId) {
            case '1' :
                return 'Ethereum Mainnet';
            case '3' :
                return 'Ropsten';
            case '1337' :
                return 'LocalHost';
            default:
                return 'Not a Network';
        }
    }

    render(){
        return(
            <>
            <h3> The voting Dapp </h3>
            <div id='addressBalance'>
                    Network: {this.state.network}
                <br></br>
                    Address: {this.props.address.toString()} 
                <br></br>
                    Balance: {this.state.balance}               
            </div>
            </>
        )
    }
}



class App extends Component {
    state = {
        web3: null,
        accounts: null,
        contract: null,
        workflowStatus: null,
        voterOwner: null,
        rightVoter: null,
        hasVoted: null,
        whitelist: [],
        proposalList: [],
        voteList: [],
        proposalCount: 0,
        winningProposal: null
    };    

    componentDidMount = async () => {
        try {
           // await this.initWeb3();
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = VotingContract.networks[networkId];
            const contract = new web3.eth.Contract(
                VotingContract.abi,
                deployedNetwork && deployedNetwork.address,
            );
            
            this.setState({ web3, accounts, contract });
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }

        const workflowStatus = await this.state.contract.methods.workflowStatus().call({ from: this.state.accounts[0] });
        this.setState({ workflowStatus });
        if (workflowStatus === '5') {
            const winnerId = await this.state.contract.methods.winningProposalID().call({ from: this.state.accounts[0] });
            const winningProposal = await this.state.contract.methods.getOneProposal(winnerId).call({ from: this.state.accounts[0] });
            this.setState({ winningProposal: winningProposal.description });
        }

        let options = {
            fromBlock: 0,
            toBlock: 'latest'
        };
        let voterEventsList = await this.state.contract.getPastEvents('VoterRegistered', options);
        const whitelist = [];
        voterEventsList.map( (voter) => (
            whitelist.push(voter.returnValues.voterAddress.toString())
        ));
        this.setState({ whitelist });

        
        const owner_addr = await this.state.contract.methods.owner().call();
        const voterOwner = (this.state.accounts.toString() === owner_addr);
        this.setState({ voterOwner });
        this.setState({ owner_addr });

        const rightVoter = this.state.whitelist.includes(this.state.accounts.toString());
        this.setState({ rightVoter });

    
        let votesEventsList = await this.state.contract.getPastEvents('Voted', options);
        let hasVoted = false;
        let voteList = [];
        for (let i = 0; i < votesEventsList.length; i++) {
            if (votesEventsList[i].returnValues.voter.toString() === this.state.accounts[0]) {
                hasVoted = true;
            }
            const proposalId = votesEventsList[i].returnValues.proposalId.toString()
            const proposal = await this.state.contract.methods.getOneProposal(proposalId).call({from: this.state.accounts[0]});
            voteList.push({
                voterAddress : votesEventsList[i].returnValues.voter.toString(),
                proposal : proposal.description
            })
        }
        this.setState({hasVoted, voteList});

        if (this.state.rightVoter) {
            let options = {
                fromBlock: 0,
                toBlock: 'latest'
            };
            let proposalEventsList = await this.state.contract.getPastEvents('ProposalRegistered', options);
            let proposalCount = proposalEventsList.length;
            this.setState({ proposalCount });
            const proposalList = [];
            for (let i = 0; i < this.state.proposalCount; i++) {
                const result = await this.state.contract.methods.getOneProposal(i).call({from: this.state.accounts[0]});
                proposalList.push(result);
            }
            this.setState({ proposalList });
        }
    };


    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        
        return (
            <div className="App">
                <div id='header'>
                    <ParticipantAddr
                        address={this.state.accounts}
                        web3={this.state.web3}
                    />
                </div>
                <Workflow
                    workflowStatus={this.state.workflowStatus}
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    voterOwner={this.state.voterOwner}
                    onWorkflowChange={this.changeWorkflowStatus}
                />
                <div id='container'>
                    <ListVoterProp
                        workflowStatus={this.state.workflowStatus}
                        accounts={this.state.accounts}
                        contract={this.state.contract}
                        voterOwner={this.state.voterOwner}
                        rightVoter={this.state.rightVoter}
                        whitelist={this.state.whitelist}
                        voteList={this.state.voteList}
                        voterListChange={this.voterListChange}
                        hasVoted={this.state.hasVoted}
                        proposalList={this.state.proposalList}
                        winningProposal={this.state.winningProposal}
                        onProposalChange={this.changeProposalList}
                        onVoteChange={this.changeVoteStatus}
                    />
                </div>
            </div>
        );
    }
}

export default App;
