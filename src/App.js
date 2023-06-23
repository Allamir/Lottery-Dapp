import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3';

const abi = [
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_itemNumber",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "lotteryNumber",
				"type": "uint256"
			}
		],
		"name": "winnerDecleration",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "Owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "add_item",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "advanceState",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_itemId",
				"type": "uint256"
			}
		],
		"name": "bid",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "destroy",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "items",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "itemId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "winner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reset",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "revealWinners",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stage",
		"outputs": [
			{
				"internalType": "enum lottery.Stage",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "new_owner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "winners",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const address = "0x467C31639B61188c903131F48137e45c919d7ff0";

var account = null;

var contract = null;

var item_id = null;

var owner = null;


async function connectwallet() {
  try {
    if (window.ethereum) {
      var web3 = new Web3(window.ethereum);
      await window.ethereum.send('eth_requestAccounts');
      var accounts = await web3.eth.getAccounts();
      account = accounts[0];
      document.getElementById('wallet-address').textContent = account;
      contract = new web3.eth.Contract(abi, address);
	  owner = await contract.methods.getOwner().call();
      document.getElementById('wallet-owner-address').textContent = owner;
    }
    
  }
  catch (ex) {

    console.log(ex);

  }
}

async function bid(item_id) {

  if (window.ethereum) {
		var web3 = new Web3(window.ethereum);
		
        await contract.methods.bid(item_id).send( {from:account,value : 10000000000000000});
    
  }

}

async function isOwner() {

	if (window.ethereum) {
		console.log(account.toLowerCase());
		console.log(owner.toLowerCase());
		if(account.toLowerCase() == owner.toLowerCase() ) {

			return true;

		}

		else {
			return false;
		}
	}
}

async function withdraw() {

	if(window.ethereum) {


		var boll = false;

		boll = isOwner();
		//need to make a frond end check for addmin
		if(boll){

			await contract.methods.withdraw().send({from:account});

		}

		else{
			console.log("you are not the contract owner");
		}
	}
}

async function declareWinner() {

	if(window.ethereum) {

		await contract.methods.revealWinners().send({from:account});
	}
}

function App() {
  return (
    <div className="App">

      <div className='container'>

        <div className='row'>

          <form class='gradient col-lg-5 mt-5' style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}}>

            <h4 style={{color:'#FFFFFF'}}>Mint Portal</h4>
            <h5 style={{color:'#FFFFFF'}}>Please connect your wallet</h5>
            <Button onClick={connectwallet} style={{marginBottom:"5px"}}>Connect Wallet</Button>

            <div class='card' id='wallet-address' style={{boxShadow:"1px 1px 10px #000000"}}>
              <label for='floatingInput'>Wallet Address</label>

            </div>
            <div class='card' id='wallet-owner-address'>
              
			<label for='floatingInput' style={{color:'#FFFFFF'}}>Dapp Owner Address</label>
            </div>
            
          </form>
          
        </div>

        <div className='row' style={{marginTop:"40px"}}>
          <h2 style={{marginBottom:"40px"}}>Available items to bid in currect lottery</h2>
          <div class='gradient col-sm-4' style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}}>
            <h2 style={{color:'#FFFFFF'}}>Car</h2>
            <Button onClick={ () => bid(0)}>Bid</Button>
          </div>
          <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}} >
            <h2 style={{color:'#FFFFFF'}}>Phone</h2>
            <Button onClick={ () => bid(1)}>Bid</Button>
          </div>
          <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}}>
            <h2 style={{color:'#FFFFFF'}}>Helicopter</h2>
            <Button onClick={ () => bid(2)}>Bid</Button>
          </div>
        </div>

		<div className='row' style={{marginTop:"40px"}}>
          <h2 style={{marginBottom:"40px"}}>Available items to bid in currect lottery</h2>
          <div class='gradient col-sm-4' style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}}>
            
            <Button onClick={ () => bid(0)}>Reveal</Button>
          </div>
          <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}} >
            
            <Button onClick={ () => bid(1)}>Am I Winner</Button>
          </div>
          <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}}>
            
            <Button onClick={ () => withdraw() }>Withdraw</Button>
          </div>
		  <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}}>
            
            <Button onClick={ () => declareWinner()}>Declear Winner</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
