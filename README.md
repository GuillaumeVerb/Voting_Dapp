# Voting-Dapp

# Main scripts
✔️ Voting.sol (contracts/Voting.sol): voting smart contract

✔️ App.jsx : main web page 

# Available

Available on Github Pages : https://guillaumeverb.github.io/Voting_Dapp/

Video presentation : https://www.loom.com/share/bb2e36570d6d4a18b391254b31b39095


# Purpose of Voting Smart Contract

A smart contract vote can be simple or complex, depending on the requirements of the elections you wish to support. Voting can be on a small number of pre-selected proposals (or candidates), or on a potentially large number of proposals suggested dynamically by the voters themselves.

In this framework, you will write a smart contract for a small organisation. Voters, who are all known to the organisation, are whitelisted using their Ethereum address, can submit new proposals in a proposal registration session, and can vote on the proposals in the voting session.

✔️ Voting is not secret 

✔️ Each voter can see the votes of others

✔️ The winner is determined by a simple majority

✔️ The proposal with the most votes wins.


## 👉 The voting process: 

The entire voting process is as follows:

- The voting administrator registers a blank list of voters identified by their Ethereum address.
- The voting administrator starts the proposal registration session.
- Registered voters are allowed to register their proposals while the registration session is active.
- The voting administrator ends the proposal registration session.
- Voting administrator starts the voting session.
- Registered voters vote for their preferred proposal.
- The voting administrator ends the voting session.
- The voting administrator counts the votes.
- Everyone can check the final details of the winning proposal.

## Plugins, Frameworks, Packages

In order to run the project, you need to install the following plugins.
The official npm pages are linked below.

| Plugin | Links |
| ------ | ------ |
| eth-gas-reporter | https://www.npmjs.com/package/eth-gas-reporter |
| soidity-coverage | https://www.npmjs.com/package/solidity-coverage |
| truffle/hdwallet-provider | https://www.npmjs.com/package/@truffle/hdwallet-provider |


