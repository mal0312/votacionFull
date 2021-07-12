web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var account;
web3.eth.getAccounts().then((f) => {
 account = f[0];
})
var contratoActual;
var contract;
var candidateCounter = 0;

abi = JSON.parse('[{"inputs":[{"internalType":"bytes32[]","name":"candidateNames","type":"bytes32[]"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"candidateList","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]')

var candidates = getCandidates();
//lee un archivo en forma local (inseguro pero funca)
fetch('files/contract.bin')
  .then(res => res.text())
  .then(content => {
    contract = new web3.eth.Contract(abi);
    contratoActual= content.toString()
    contract.options.address = contratoActual;
   //esto lee desde el contrato de forma asincronica
    $(document).ready(function() {
        candidateNames = Object.keys(candidates);
       
        for(var i=0; i<candidateNames.length; i++) {
          let name = candidateNames[i];
          
          contract.methods.totalVotesFor(web3.utils.asciiToHex(name)).call().then((f) => {
          $("#" + candidates[name]).html(f);
        })
        }
       });

  });

  //esto lee desde el contrato de forma sincronica
  $(document).ready(function() {
    candidateNames = Object.keys(candidates);
   
    for(var i=0; i<candidateNames.length; i++) {
    let name = candidateNames[i];
     
    contract.methods.totalVotesFor(web3.utils.asciiToHex(name)).call().then((f) => {
     $("#" + candidates[name]).html(f);
    })
    }
   });

  function voteForCandidate(candidate) {
    candidateName = $("#candidate").val();
    console.log("Votando al candidato '" + candidateName + "' desde la wallet: '" + account + "'");
   
    contract.methods.voteForCandidate(web3.utils.asciiToHex(candidateName)).send({from: account}).then((f) => {
      let div_id = candidates[candidateName];
      contract.methods.totalVotesFor(web3.utils.asciiToHex(candidateName)).call().then((f) => {
        $("#" + div_id).html(f);
      })
    })
   }
//contract.options.address = "/contract.bin"
// update this contract address with your contract address

  // función que trae los candidatos disponibles para votar.
  async function getCandidates() { 
    await fetch("files/candidates.txt")
      .then(response => response.text())
      .then(content => {        
        candidates = content.toString().split("\n");

        let tmp = "{";
        for(let i = 0; i < candidates.length; i++) {
          tmp = tmp + "\"" + candidates[i] + "\":" + "\"" + "candidate-" + (i+1) + "\","
          
        }
        tmp = tmp.substring(0, tmp.length - 1) + "}";
        candidates = JSON.parse(tmp);
      })
    .catch(err => console.log(err));
    return candidates;
  }
  
  function selectWallet() {
    account = $("#wallets").val();
  }

  async function getWallets(){
    return web3.eth.getAccounts();
  }
