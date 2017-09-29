const HDWalletProvider = require("truffle-hdwallet-provider")
let mnemonic = 'pull chef present design churn swim monster sport lunch robust kangaroo safe'

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io"),
      network_id: "4",
      gas: 4500000,
      gasPrice: 25000000000
    }
  }
};
