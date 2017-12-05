pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Insurance.sol";

contract TestInsurance {

    Insurance insurance = Insurance(DeployedAddresses.Insurance());

    function testAddFlightWithArrivalDateTime() {
        insurance.addInsurance(0, "02/11/2017 10:00:00");
        Assert.equal(insurance.getArrivalDate(0), "02/11/2017 10:00:00", "Testing arrivalDateTime");
    }
    function testPayInsurance() {
        //TODO
    }

}