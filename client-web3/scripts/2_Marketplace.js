const Marketplace = artifacts.require("Marketplace") ;

module.exports = function (deployer) {
    const feePercent = 10;
    const channelName = "Paranom";

    deployer.deploy(Marketplace, channelName, feePercent);
}