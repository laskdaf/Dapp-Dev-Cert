import Web3 from 'web3';
// const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
let mnemonic = 'pull chef present design churn swim monster sport lunch robust kangaroo safe';
const web3 = new Web3( new Web3.providers.HttpProvider("https://rinkeby.infura.io/"));

var pollsterABI = [{"constant":true,"inputs":[{"name":"pollNum","type":"uint256"}],"name":"getReward","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"function","constant":false,"name":"withdraw","outputs":[{"name":"transferedAmount","type":"uint256"}]},{"payable":false,"type":"function","constant":true,"inputs":[{"name":"pollNum","type":"uint256"}],"name":"getnumVoters","outputs":[{"name":"","type":"uint256"}]},{"constant":true,"inputs":[],"name":"pollNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"pollNum","type":"uint256"}],"name":"getResults","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_question","type":"string"},{"name":"_choices","type":"uint256[]"},{"name":"_numPolls","type":"uint256"}],"name":"newPoll","outputs":[{"name":"newPollNumber","type":"uint256"}],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"pollNum","type":"uint256"},{"name":"_choice","type":"uint256"}],"name":"vote","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"pollNum","type":"uint256"}],"name":"getQuestion","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getNumPolls","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"address"}],"name":"VoteSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"address"},{"indexed":false,"name":"","type":"string"}],"name":"PollOpened","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"address"},{"indexed":false,"name":"","type":"string"},{"indexed":false,"name":"","type":"uint256[]"},{"indexed":false,"name":"","type":"uint256[]"}],"name":"PollClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"address"},{"indexed":false,"name":"","type":"string"}],"name":"PollReset","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"address"}],"name":"Withdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256"}],"name":"RewardSet","type":"event"}];

var pollsterAddress = '0xB698750FD554d294287B68CD86F2Ec3dB3aC2Bab';

const pollsterContract = web3.eth.contract(pollsterABI).at(pollsterAddress);

var account = "0x10bd4E21CfBd2C252BDa7BfB54364a3924287e0B";
var balance = web3.fromWei(web3.eth.getBalance(account).toString());
// var blocknum = web3.eth.blockNumber;
// var hashrate = web3.eth.hashrate;
// var gasPrice = web3.eth.gasPrice.toString();

export{pollsterContract, account, balance, web3};
