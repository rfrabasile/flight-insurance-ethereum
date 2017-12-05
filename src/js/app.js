App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    
    // Load pets.
    $.getJSON('../flights.json', function(data) {
      var petsRow = $('#insurancesRow');
      var flightTemplate = $('#flightTemplate');

      for (i = 0; i < data.length; i ++) {
        flightTemplate.find('.panel-title').text(data[i].name);
        flightTemplate.find('.airline').text(data[i].airline);
        flightTemplate.find('.flightID').text(data[i].id);
        flightTemplate.find('.arrivalDate').text(data[i].arrivalDate);
        flightTemplate.find('img').attr('src', data[i].picture);
        flightTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        flightTemplate.find('.btn-pay').attr('data-id', data[i].id);
        flightTemplate.find('.btn-add').attr('data-arrivaldate', data[i].arrivalDate);
        flightTemplate.find('.btn-add').attr('data-id', data[i].id);

        petsRow.append(flightTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('../Insurance.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var InsuranceArtifact = data;
      App.contracts.Insurance = TruffleContract(InsuranceArtifact);
    
      // Set the provider for our contract
      App.contracts.Insurance.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    /*$(document).on('click', '.btn-adopt', App.handleFlights);
    $(document).on('click', '.btn-add', App.handleAdding);
    $(document).on('click', '.btn-pay', App.handlePayment);*/
    $(document).on('click', '.btn-status', App.handleFlights);
    $(document).on('click', '.btn-delayed', App.handlePayment);
    $(document).on('click', '.btnCreate', App.handleAdding);
    
  },
  
  handleAdding: function(){
    var insuranceInstance;
    App.contracts.Insurance.deployed().then(function(instance) {
      insuranceInstance = instance;
      
      //$(responseRow).append("</br>sending addInsurance ");
      return insuranceInstance.addInsurance.sendTransaction(flightId.value.trim(),
                                            $('#arrivalDate').val().trim(),//"02/11/2017 10:00:00",
                                            $('#from').val().trim() + "@" + $('#to').val().trim()
                                            + "@" + $('#airline').val().trim() + "@" + $('#flightNumber').val().trim(),
                                            //"MVD@NY@AMERICANAIRLINES@127",
                                            //web3.eth.accounts[1],
                                            {from: web3.eth.accounts[0],//"0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef",
                                            //web3.eth.accounts[2], 
                                            to:'0x345ca3e014aaf5dca488057592ee47305d9b3e10', 
                                            value:web3.toWei(1, 'ether'),
                                            gasLimit:21000, 
                                            gasPrice: 20000000000})
        .then(function() {
          //$(responseRow).append("</br>" + "added flight insurance executed");
        });
      
    }).then(function(insurances) {
      console.log("added returns: " + insurances);
      window.location.href = 'dashboard.html';
          //$(responseRow).append(insurances);
    }).catch(function(err) {
      console.log(err.message);
      //$(responseRow).append(err.message);
    });
  },

  handlePayment: function(){
    var insuranceInstance;
    
    App.contracts.Insurance.deployed().then(function(instance) {
      insuranceInstance = instance;
    
      return insuranceInstance.payInsurance.
                              sendTransaction(flightId.value.trim(), {
                                from:web3.eth.accounts[0],//"0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef",
                                //web3.eth.accounts[2], 
                                to:'0x345ca3e014aaf5dca488057592ee47305d9b3e10',
                                gas:210000, gasPrice:web3.toWei(10, 'gwei')});
                                //gasLimit:4712388, gasPrice: 100000000000});
    }).then(function(insurances) {
      console.log("payment: " + insurances);
      window.location.href = 'dashboard.html';
      //$(responseRow).append("payment: " + insurances);
    }).catch(function(err) {
      console.log(err.message);
      //$(responseRow).append(err.message);
    });
  },

  handleFlights: function(){
    var insuranceInstance;
    
    App.contracts.Insurance.deployed().then(function(instance) {
      insuranceInstance = instance;
    
      return insuranceInstance.getBalance.call();
    }).then(function(insurances) {
          //alert(insurances);
          //$(responseRow).append("</br> balance:" + insurances.toString());
          console.log("balance: " + insurances.toString());

          /*var balance = 
            web3.eth.getBalance('0x345ca3e014aaf5dca488057592ee47305d9b3e10', function (error, result) {
              if (error) {
                $(balanceRow).append("</br>" + "ERROR: " + web3.fromWei(balance));
              }
            });

          $(balanceRow).append("</br>" + web3.fromWei(balance));*/

    }).catch(function(err) {
      console.log(err.message);
      //$(responseRow).append(err.message);
    });
  }

};

$(function() {
  $(window).on('load', function() {
    App.init();
  });
});

