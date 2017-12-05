pragma solidity ^0.4.4;

contract Insurance {

    mapping(uint => FlightInsurance) public flights;
    uint constant AMOUNT_TO_PAY = 0.5 ether; 
    address owner;

    struct FlightInsurance { 
        bool isProcessed;
        bytes32 arrivalDateTime;
        bytes32 tripData;
        address userAddress;
        FlightState state;
    }
    enum FlightState {DEFAULT, ON_TIME, DELAYED}

    function Insurance() public {
        owner = msg.sender;
    }

    function addInsurance(uint id, bytes32 date, bytes32 tripData) payable public {
        if ( flights[id].userAddress > 0 && msg.value < AMOUNT_TO_PAY) {
            revert();
        }
        flights[id] = FlightInsurance({state:FlightState.DEFAULT,
                                            tripData:tripData,
                                            userAddress:msg.sender,
                                            isProcessed:false,
                                            arrivalDateTime:date
                                            });
    }

    function payInsurance(uint id) public {
        /*if (this.balance >= AMOUNT_TO_PAY && flights[id].userAddress > 0 && flights[id].isProcessed == false) {
        */  
        flights[id].userAddress.transfer(AMOUNT_TO_PAY);
        flights[id].state = FlightState.DELAYED;
        flights[id].isProcessed = true;
        /*}else {
            revert();
        }*/
    }
    
    function getBalance() public constant returns (uint) {
        return this.balance;
    }

    function getArrivalDate(uint id) public constant returns (bytes32) {
        return flights[id].arrivalDateTime;
    }

    function isProcessed(uint id) public constant returns (bool) {
        return flights[id].isProcessed;
    }

    function kill () external {
        if (msg.sender == owner) {
            selfdestruct(owner);
        }
    }

}