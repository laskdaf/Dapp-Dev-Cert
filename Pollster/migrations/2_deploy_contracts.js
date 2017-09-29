var Pollster = artifacts.require("./Pollster.sol");

module.exports = function(deployer) {
  deployer.deploy(Pollster);
};
