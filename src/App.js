import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3';

const abi = [
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
		"name": "withdraw",
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
				"internalType": "uint256",
				"name": "item_id",
				"type": "uint256"
			}
		],
		"name": "totalWinners",
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
	}
];

const address = "0xACDaB0623Ea6435Cc059bC0FA46578cb40699cCc";

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

	  await adminPanel();
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

	
		var new_acc = account.substr(2);
		var new_owner = owner.substr(2);
		console.log(new_acc);
		console.log(new_owner);
		if(new_acc === new_owner ) {

			return true;

		}
		else {
			return false;
		}
	
}

async function withdraw() {

	if(window.ethereum) {

		if( await isOwner()){

			await contract.methods.withdraw().send({from:account});

		}
		else{
			console.log("you are not the contract owner");
		}
	}
}

async function declareWinner() {

	if(window.ethereum) {
		
		if( await isOwner()){

			await contract.methods.revealWinners().send({from:account});

		}
		else{
			console.log("you are not the contract owner");
		}
	}
}

async function reset() {

	if(window.ethereum) {		

		if( await isOwner()){

			await contract.methods.reset().send({from:account});

		}
		else{
			console.log("you are not the contract owner");
		}
	}
}

async function destroy() {

	if(window.ethereum) {

		if( await isOwner()){

			await contract.methods.destroy().send({from:account});

		}
		else{
			console.log("you are not the contract owner");
		}
	}
}

async function amiWinner() {

	if(window.ethereum) {
		var output = "You have won Items: ";
		var winnAddress;

		for(var i=0; i<3; i++) {

			winnAddress = await contract.methods.totalWinners(i).call();

			if (winnAddress === account) {
				output = output + String(i+1 + " ");
			}

		}

		if(output == "You have won Items: ") {
			output = output + "0";
		}

		document.getElementById('items_won').textContent = output;


	}
}

async function transferOwner() {

	if(window.ethereum) {

		if( await isOwner()){

			var newOwner = document.getElementById('newOwner').value;

			await contract.methods.transferOwnership(newOwner).send({from:account});
			
			owner = await contract.methods.getOwner().call();
		}
		else{
			console.log("you are not the contract owner");
		}
	}
}

async function adminPanel() {

	if(window.ethereum) {

		if( await isOwner()) {

			document.getElementById('adminPanel').hidden = false;

		}
	}
}

async function reveal() {

	if(window.ethereum) {
		await window.location.reload(false);

		await connectwallet();
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
            <h2 style={{color:'#FFFFFF'}}>1 : Car</h2>
            <Button onClick={ () => bid(0)}>Bid</Button>
          </div>
          <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}} >
            <h2 style={{color:'#FFFFFF'}}>2 : Phone</h2>
            <Button onClick={ () => bid(1)}>Bid</Button>
          </div>
          <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}}>
            <h2 style={{color:'#FFFFFF'}}>3 : Helicopter</h2>
            <Button onClick={ () => bid(2)}>Bid</Button>
          </div>
        </div>

		<div className='row' style={{marginTop:"40px"}}>
          <h2 style={{marginBottom:"40px"}}>Available items to bid in currect lottery</h2>
          <div class='gradient col-sm-4' style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}}>
            
            <Button onClick={ () => reveal()}>Reveal</Button>
          </div>
          <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}} >
            
            <Button onClick={ () => amiWinner()}>Am I Winner</Button>
			<div class='card' id='items_won' style={{boxShadow:"1px 1px 10px #000000"}}>
              <label for='floatingInput'>Items you have won</label>

            </div>
            <div class='card' id='items_won'></div>
          </div>
          
        </div>

		<div hidden id="adminPanel" className='row' style={{marginTop:"40px"}}>
          <h2 style={{marginBottom:"40px"}}>Admin Panel</h2>
          
          <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}}>
            
            <Button onClick={ () => withdraw() }>Withdraw</Button>
          </div>
		  <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}}>
            
            <Button onClick={ () => declareWinner()}>Declear Winner</Button>
          </div>
		  <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}}>
            
            <Button onClick={ () => reset()}>reset</Button>
          </div>
		  <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}}>
            
            <Button onClick={ () => destroy()}>Destroy Contract</Button>
          </div>
		  <div class='gradient col-sm-4' id='wallet-owner-address'>
              
			<label for='floatingInput' style={{color:'#FFFFFF'}}>Give address to transfer ownership</label>
            
			<input type = "text" id="newOwner" name="newOwner"></input>
			<Button onClick={ () => transferOwner()}>Transfer</Button>
			</div>
        </div>
      </div>
    </div>
  );
}

export default App;
