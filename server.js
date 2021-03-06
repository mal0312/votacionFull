var express = require('express');
fs = require ('fs')
Web3 = require( 'web3')
var app = express();
app.use(express.static(__dirname));
var addressContractCreator
var addressContract
var wallet_accounts
var candidate_list

web3 = new Web3("http://localhost:8545")
//abi = JSON.parse(fs.readFileSync('/files/Voting_sol_Voting.abi'))
abi = JSON.parse('[{"inputs":[{"internalType":"bytes32[]","name":"candidateNames","type":"bytes32[]"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"candidateList","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]')
bytecode = fs.readFileSync(__dirname + '/files//Voting_sol_Voting.bin').toString()

async function waitForAccounts() {
  wallet_accounts = await web3.eth.getAccounts();
  addressContractCreator = wallet_accounts[0];

  deployedContract = new web3.eth.Contract(abi,addressContractCreator)
  listOfCandidates = fs.readFileSync('files/candidates.txt').toString().split("\n");
 
  console.log("Lista de candidatos: " + listOfCandidates);

  await deployedContract.deploy({
    data: bytecode,
    arguments: [listOfCandidates.map(name => web3.utils.asciiToHex(name))]
  }).send({
    from:addressContractCreator,
    gas: 1500000,
    gasPrice: await web3.utils.toWei('0.00003','ether')
  }).then((newContractInstance) => {
    deployedContract.options.address = newContractInstance.options.address
  addressContract = newContractInstance.options.address //me guardo la direccion del contrato para guardarla en un file y abrirla en el index.
  fs.writeFile("files/contract.bin", addressContract, (err) => {
      if (err)
        console.log(err);
      else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
        console.log(fs.readFileSync("files/contract.bin", "utf8"));
      }
    });
  });

  deployedContract.methods.totalVotesFor(web3.utils.asciiToHex('Rama')).call(console.log)
  deployedContract.methods.voteForCandidate(web3.utils.asciiToHex('Rama')).send({from:addressContractCreator}).then((f) => console.log(f))
  deployedContract.methods.totalVotesFor(web3.utils.asciiToHex('Rama')).call(console.log)
}

waitForAccounts();

app.listen('3500');
console.log('Running at\n http://localhost:3500')