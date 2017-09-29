pragma solidity 0.4.15;

//"test", [1, 2, 3], 3

contract Pollster {

	enum State {Open, Closed}

	bool constructorCalled = false;

	struct Vote {
	    uint choice;
	    bool exists;
	}

	struct Poll {
	    address owner;

    	string question;
    	uint [] choices;
    	uint [] result;
    	uint numPolls;

      uint rewardtotal;
    	uint reward;

    	State pollState;

    	uint numVoters;
    	mapping(address => Vote) votes;
	}

	mapping(uint => Poll) polls;
	uint public pollNumber;

    mapping(address => uint) balances;

	event VoteSubmitted(address);
	event PollOpened(address, string);
	event PollClosed(address, string, uint[], uint[]);
	event PollReset(address, string);
    event Withdrawal(address);
    event RewardSet(uint);


    modifier constructorNotCalled () {
        require(constructorCalled == false);
        _;
    }
	modifier isOwner (uint pollNum) {
        require(polls[pollNum].owner == msg.sender);
        _;
    }
    modifier isOpen (uint pollNum) {
        require(polls[pollNum].pollState == State.Open);
        _;
    }
    modifier isClosed (uint pollNum) {
        require(polls[pollNum].pollState == State.Closed);
        _;
    }
    modifier firstVote (uint pollNum) {
        require(polls[pollNum].votes[msg.sender].exists == false);
        _;
    }
    modifier viableChoice(uint pollNum ,uint _choice) {
        require(_choice < polls[pollNum].choices.length);
	    _;
    }
    modifier enoughPolls(uint numPolls) {
        require(numPolls > 0);
	    _;
    }


	function Pollster() constructorNotCalled() public {
        pollNumber = 1;
        constructorCalled = true;
	}

	function newPoll(string _question, uint[] _choices, uint _numPolls) enoughPolls(_numPolls) payable public returns (uint newPollNumber){
	    uint _rewardtotal = msg.value / _numPolls * _numPolls;
	    uint _reward = msg.value / _numPolls;

	    polls[pollNumber] = Poll({
	        owner: msg.sender,
	        question: _question,
	        choices: _choices,
	        result: new uint[](_choices.length),
	        numPolls: _numPolls,
	        rewardtotal: _rewardtotal,
	        reward: _reward,
	        pollState: State.Open,
	        numVoters: 0
	    });

	    balances[msg.sender] = msg.value - _rewardtotal;

	    pollNumber += 1;
	    PollOpened(msg.sender, _question);

	    return pollNumber - 1;
	}

	function vote(uint pollNum, uint _choice) public isOpen(pollNum) firstVote(pollNum) viableChoice(pollNum, _choice) returns (bool) {

			require(balances[msg.sender] + polls[pollNum].reward > balances[msg.sender] && balances[polls[pollNum].owner] + polls[pollNum].rewardtotal - polls[pollNum].reward * polls[pollNum].numPolls > balances[polls[pollNum].owner]);

	    polls[pollNum].votes[msg.sender] = Vote(_choice, true);
	    polls[pollNum].numVoters += 1;
	    VoteSubmitted(msg.sender);
	    polls[pollNum].result[_choice] += 1;
	    if (polls[pollNum].numVoters >= polls[pollNum].numPolls ) {
	        polls[pollNum].pollState = State.Closed;
	        PollClosed(polls[pollNum].owner, polls[pollNum].question, polls[pollNum].choices, polls[pollNum].result);
	        balances[polls[pollNum].owner] += polls[pollNum].rewardtotal - polls[pollNum].reward * polls[pollNum].numPolls;
	    }

        balances[msg.sender] += polls[pollNum].reward;

	    return true;
	}

	function getQuestion(uint pollNum) constant public returns (string, uint[]) {
	    return (polls[pollNum].question, polls[pollNum].choices);
	}

	function getResults(uint pollNum) public constant isClosed(pollNum) isOwner(pollNum) returns(string, uint[]) {
	    return (polls[pollNum].question, polls[pollNum].result);
	}

	function getReward(uint pollNum) constant public returns (uint) {
	    return polls[pollNum].reward;
	}

	function getnumVoters(uint pollNum) public constant returns (uint) {
	    return polls[pollNum].numVoters;
	}

	function getNumPolls() public constant returns (uint) {
	    return pollNumber - 1;
	}

	function getBalance() public constant returns (uint) {
	    return balances[msg.sender];
	}

	function withdraw() public returns (uint transferedAmount) {
	    if (balances[msg.sender] == 0) {
	      return 0;
	    }

      uint transferAmount = balances[msg.sender];
	    balances[msg.sender] = 0;
	    msg.sender.transfer(transferAmount);
	    Withdrawal(msg.sender);
	    return transferAmount;
	}

	/* Fallback function */
	function() public {
		revert();
	}
}
