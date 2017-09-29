import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {pollsterContract, account, balance, web3} from './EthereumSetup';
var Web3 = require('web3');

class App extends Component {

  constructor(props) {
    super(props)

    // var web3 = new Web3();
    // web3 = new Web3(window.web3.currentProvider);

    // var account = web3.eth.accounts[0]; //"0x10bd4E21CfBd2C252BDa7BfB54364a3924287e0B";
    // console.log(account)
    // var balance = -1
    // web3.eth.getBalance(account, function(error, result){
    //   if(!error)
    //         balance = 1
    //     else
    //         console.error(error);
    // })

    this.newPoll = this.newPoll.bind(this);
    this.getQuestionAndReward = this.getQuestionAndReward.bind(this);
    this.respondToPoll = this.respondToPoll.bind(this);
    this.checkResponse = this.checkResponse.bind(this);
    this.getResults = this.getResults.bind(this);

    this.state = {
      web3: web3,
      numPolls: "",
      question: "",
      choices: "",
      reward: "",
      data: "",
      account: account,
      balance: -1,
      choiceToIndex: {},
      isValidInput: "",
      isValidInputResults: "",
      resultsQuestion: "",
      results: "",
      resultsError: "",
      withdrawAmount: 0,
      rewardBalance: 0
    }
  }

  componentWillMount() {
    var data = pollsterContract.getNumPolls({from: this.state.account})
    var rewardB = pollsterContract.getBalance({from: this.state.account})
    console.log(data)

    // var balance = -10
    // this.state.web3.eth.getBalance(this.state.account, function(error, result){
    //   if(!error) {
    //     balance = result
    //   } else {
    //     console.log(result)
    //     console.error(error)
    //   }
    // })

    this.setState({
      numPolls: parseInt(data, 10),
      isValidInput: "not",
      isValidInputResults: "not",
      balance: balance,
      rewardBalance: web3.fromWei(rewardB.toString())
    })
  }

  getQuestionAndReward(event) {
    if (!Number.isInteger(parseInt(event.target.value, 10))) {
      this.setState({
        isValidInput: "not",
        question: "",
        choices: "",
        reward: ""
      })
    } else {
      var data = pollsterContract.getQuestion(event.target.value)

      var text = ""
      var choiceToIndexDict = {}
      for (var i = 0; i < data[1].length; i++) {
        text += data[1][i] + ", "
        choiceToIndexDict[data[1][i]] = i
      }

      var rewardData = pollsterContract.getReward(event.target.value)

      this.setState({
        question: String(data[0]),
        choices: "[" + text.substring(0, text.length - 2) + "]",
        reward: this.state.web3.fromWei(rewardData.toString()),
        choiceToIndex: choiceToIndexDict
      })
    }
  }

  newPoll(event) {
    var array = JSON.parse(this.refs.choices.value);

    if (!(array instanceof Array) || !Number.isInteger(parseInt(this.refs.numPolls.value, 10)) || isNaN(parseFloat(this.refs.reward.value))) {
      return
    }
    console.log(parseFloat(this.refs.reward.value))

    pollsterContract.newPoll(this.refs.question.value.toString(), array, parseInt(this.refs.numPolls.value, 10), {from: account, gas: 4000000, value: web3.toWei(parseFloat(this.refs.reward.value, 10), 'ether')})

    // pollsterContract.newPoll("test", [1,2], 1, {from: this.state.account, gas: 4000000, value: 30})

    var data = pollsterContract.getNumPolls()
    this.setState({
      numPolls: parseInt(data, 10)
    })
  }

  respondToPoll(event) {

    var dictionary = this.state.choiceToIndex

    if (Number.isInteger(parseInt(this.refs.responsePollNumber.value)) && (dictionary[parseInt(this.refs.responceChoice.value, 10)] || dictionary[parseInt(this.refs.responceChoice.value, 10)] >= 0)) {

      console.log(parseInt(this.refs.responsePollNumber.value, 10))
      console.log(dictionary[parseInt(this.refs.responceChoice.value, 10)])

      pollsterContract.vote(this.refs.responsePollNumber.value, dictionary[parseInt(this.refs.responceChoice.value, 10)], {from: this.state.account, gas: 4000000})
    } else {
      this.setState({
        isValidInput: "not",
      })
    }
  }

  checkResponse(event) {

    if (!Number.isInteger(parseInt(event.target.value, 10))) {
      return
    }
    var dictionary = this.state.choiceToIndex
    if (dictionary[parseInt(event.target.value, 10)] || dictionary[parseInt(event.target.value, 10)] == 0) {
      console.log(dictionary[parseInt(event.target.value, 10)])
      this.setState({
        isValidInput: "",
      })
    } else {
      this.setState({
        isValidInput: "not",
      })
    }
  }

  getResults(event) {

    if (Number.isInteger(parseInt(event.target.value))) {

      try {
        var data = pollsterContract.getResults(parseInt(event.target.value), {from: this.state.account, gas: 4000000})

        var text = ""
        for (var i = 0; i < data[1].length; i++) {
          text += data[1][i] + ", "
        }

        this.setState({
          resultsQuestion: String(data[0]),
          results: "[" + text.substring(0, text.length - 2) + "]",
          isValidInputResults: "",
          resultsError: ""
        })
      }
      catch(err) {
        this.setState({
          resultsQuestion: "",
          results: "",
          resultsError: "Poll has not ended yet or you are not the owner of the poll."
        })
      }
    } else if (event.target.value == "") {
      this.setState({
        resultsError: ""
      })
    } else {
      this.setState({
        resultsQuestion: "",
        results: "",
        isValidInputResults: "not"
      })
    }
  }

  withdrawRewards(event) {
    pollsterContract.withdraw({from: account, gas: 4000000})
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          Your account is: {this.state.account}<br />
          Your balance is: {this.state.balance} ether<br />
          Your total rewards are: {this.state.rewardBalance} ether<br />
          ================================================================== <br />
          Number of Polls: {this.state.numPolls} <br />
          ================================================================== <br />
        </p>

        <form onSubmit={this.newPoll}>
          <label>
            Submit a New Poll: <br />
            <input type="text" placeholder="question" ref="question"/>
            <input type="text" placeholder="choices" ref="choices"/>
            <input type="text" placeholder="# of polls to collect" ref="numPolls"/>
            <input type="text" placeholder="total reward" ref="reward"/>
            <input type="button" value="Submit" onClick={this.newPoll}/> <br />
          </label>
        </form>

        <p> ================================================================== </p>

        <form onSubmit = {this.respondToPoll}>
          <label>
            Respond to Poll: <br />
            <input type="text" placeholder="poll number" ref="responsePollNumber" value={this.state.value} onChange={this.getQuestionAndReward} /> <br />  <br />
            Question: {this.state.question}<br />
            Choices: {this.state.choices}<br />
            Reward: {this.state.reward}<br /> <br />
            Enter your response: <br />
            <input type="text" placeholder="choice" ref="responceChoice" value={this.state.value} onChange={this.checkResponse}/>
            <input type="button" value="Submit" onClick={this.respondToPoll}/> <br />
          </label>
          Response is {this.state.isValidInput} a valid input<br />
        </form>

        <p> ================================================================== </p>

        <form>
          <label>
            Get Poll Results: <br />
            <input type="text" placeholder="poll number" value={this.state.value} onChange={this.getResults} /> <br />  <br />

            Question: {this.state.resultsQuestion}<br />
            Result: {this.state.results}<br />

            Poll number is {this.state.isValidInputResults} valid<br />
            {this.state.resultsError}

          </label>
        </form>

        <p> ================================================================== </p>

        <form>
          <label onSubmit={this.withdrawRewards}>

            <input type="submit" value="Withdraw Rewards"/> <br />

          </label>
        </form>

      </div>
    );
  }
}

export default App;
