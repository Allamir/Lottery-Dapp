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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "items_id",
				"type": "uint256"
			}
		],
		"name": "getItemBiddings",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
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
		"inputs": [],
		"name": "getStage",
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
			},
			{
				"internalType": "uint256",
				"name": "total_biddings",
				"type": "uint256"
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
		"inputs": [],
		"name": "totalEther",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
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

const address = "0x467737bB11d25C61aC0ED1A0e78eA28e12EF8D09";

var account = null;

var contract = null;

var item_id = null;

var owner = null;

var stage = null;

// Initialization function
async function connectwallet() {
  try {
    if (window.ethereum) {

	  // connects metamsk wallet to dapp
      var web3 = new Web3(window.ethereum);
      await window.ethereum.send('eth_requestAccounts');
      var accounts = await web3.eth.getAccounts();
      account = accounts[0];

	  // sets user address in html website
      document.getElementById('wallet-address').textContent = account;
      contract = new web3.eth.Contract(abi, address);
	  //sets dapp owner address in html website
	  owner = await contract.methods.getOwner().call();
      document.getElementById('wallet-owner-address').textContent = owner;
	  
	  // initializes stage of lottery
	  stage = await contract.methods.getStage().call();
	  
	  // determines wether the user is the admin thus hidding or unhidding admin panel
	  await adminPanel();
      
	  // initializes total biddings from items 1,2,3
	  await totalBiddings(0);
	  await totalBiddings(1);
	  await totalBiddings(2);

	  // calculates total ethers earned in the currect lottery cycle
	  await totalEther();

    }
    
  }
  catch (ex) {

    console.log(ex);

  }
}

// function to let a user bid on a item, takes the parameter of the item id to do that
async function bid(item_id) {

  if (window.ethereum) {

	// Making sure that the lottery is on bidding and not done stage
	if(stage == 0){

		// checks if the current user is also the owner, if it is it restricts him from bidding.
		// There are also controls that forbidd him to bid on blockchain side but i wanted to make sure that
		// he would be restricted on front-end side as well.
		if(await isOwner()){
			
			
			console.log("Owner cannot make a bidding");
		}
		else {
			
			await contract.methods.bid(item_id).send( {from:account,value : 10000000000000000});
		}
 	}
	else{
		console.log("Bidding stage has stopped");
	}

	 

	}
}

// function to check if current user is Owner and return a true or false
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

// function to send all smart contract balance to owner's wallet
async function withdraw() {

	if(window.ethereum) {

		// can only be called by owner
		if( await isOwner()){

			await contract.methods.withdraw().send({from:account});

		}
		else{
			console.log("you are not the contract owner");
		}
	}
}

// function to declare winner and checge stage from bidding to done
async function declareWinner() {

	if(window.ethereum) {
		
		// can only be called by owner
		if( await isOwner()){

			await contract.methods.revealWinners().send({from:account});

		}
		else{
			console.log("you are not the contract owner");
		}
	}
}

// function to reset lottery
async function reset() {

	if(window.ethereum) {		

		// can only be called by owner
		if( await isOwner()){

			await contract.methods.reset().send({from:account});

		}
		else{
			console.log("you are not the contract owner");
		}
	}
}

// function to calculated total bidding on the given item and display its findings on the webapp
async function totalBiddings(itemID) {

	if(window.ethereum) {

		var totalbiddings;

		totalbiddings = await contract.methods.getItemBiddings(itemID).call();

		document.getElementById(itemID).textContent = totalbiddings;
		
	}
}

// function to destroy smart contract, before being destroyed smart contract will transfer all its balance to owner's wallet
async function destroy() {

	if(window.ethereum) {

		// can only be executed by admin
		if( await isOwner()){

			await contract.methods.destroy().send({from:account});

		}
		else{
			console.log("you are not the contract owner");
		}
	}
}

// function to determine if current connected user has won any item
async function amiWinner() {

	if(window.ethereum) {

		// validates that we are in the done phase and bidding phase has been concluded
		if (stage == 1){

			var output = "You have won Items: ";
			var winnAddress;

			// checks for each item seperatly
			for(var i=0; i<3; i++) {

				//calls winning address of given item
				winnAddress = await contract.methods.totalWinners(i).call();

				// compares if the winning address is the same with current user's address
				if (winnAddress === account) {
					output = output + String(i+1 + " ");
				}

			}

			if(output == "You have won Items: ") {
				output = output + "0";
			}

			// updates the html front-end with each findings
			document.getElementById('items_won').textContent = output;
		}
		else {
			
			document.getElementById('items_won').textContent = "Firstly Bidding phase has to stop.";
		}


	}
}

// function to transfer dapp/smartcontract ownership
async function transferOwner() {

	if(window.ethereum) {

		// can only be called be owner
		if( await isOwner()){

			// takes the new address given on the html form
			var newOwner = document.getElementById('newOwner').value;

			await contract.methods.transferOwnership(newOwner).send({from:account});
			
			owner = await contract.methods.getOwner().call();
		}
		else{
			console.log("you are not the contract owner");
		}
	}
}

// function to hide or show admin panel wether or not the user is the owner address as wll
async function adminPanel() {

	if(window.ethereum) {

		if( await isOwner()) {

			document.getElementById('adminPanel').hidden = false;

		}
	}
}

// function to automatically refresh web page every 10 seconds
async function reveal() {

	if(window.ethereum) {

		
		setTimeout("location.reload(true);", 10000);

		
	}
}

// function to calculate total amount of ether gathered on current cycle.
async function totalEther() {

	if(window.ethereum) {
		var totalether = await contract.methods.totalEther().call();
		var totalether = Number(totalether) * 0.01;

		document.getElementById('totalEther').textContent = totalether ;
	}
}
function App() {
	connectwallet();
	reveal();
	
  return (
    <div className="App">

      <div className='container'>

        <div className='row'>

          <form class='gradient col-lg-5 mt-5' style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}}>

            <h4 style={{color:'#FFFFFF'}}>Lottery Dapp</h4>
            

			<h5 style={{color:'#FFFFFF'}}>Your address</h5>
            <div class='card' id='wallet-address' style={{boxShadow:"1px 1px 10px #000000"}}>
				
				<label for='floatingInput'>Wallet Address</label>

            </div>
			
            
          </form>

		  <form class='gradient col-lg-5 mt-5' style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000",marginLeft:"5%"}}>

            
			<h5 style={{color:'#FFFFFF'}}>Dapp Owner's address</h5>
            <div class='card' id='wallet-owner-address'>
				
			<label for='floatingInput' style={{color:'#FFFFFF'}}>Dapp Owner Address</label>
            </div>
            
          </form>
          
        </div>

		
        <div className='row' style={{marginTop:"40px"}}>
          <h2 style={{marginBottom:"40px"}}>Available items to bid in currect lottery</h2>
          <div class='gradient col-sm-4'  style={{borderRadius:"20%",boxShadow:"1px 1px 10px #000000"}}>
            <h2 style={{color:'#FFFFFF'}}>1 : Car</h2>
			<img src="https://images.cars.com/in/v2/stock_photos/7f212472-c429-4681-882b-29e52f4d52b5/884b28bd-d67f-4c90-a7e5-a066090db8f7.png?w=1000" alt="react logo" style={{ width: '50%', }}/>
            <br></br>
			<Button onClick={ () => bid(0)}>Bid</Button>
			<h5 id="0" style={{color:'#FFFFFF'}}></h5>
          </div>
          <div class='gradient col-sm-4'style={{borderRadius:"20%",boxShadow:"1px 1px 10px #000000"}} >
            <h2 style={{color:'#FFFFFF'}}>2 : Phone</h2>
			<img src="https://www.freeiconspng.com/thumbs/iphone-x-pictures/apple-iphone-x-pictures-5.png" alt="react logo" style={{ width: '30%', }}/>
            <br></br>
			<Button onClick={ () => bid(1)}>Bid</Button>
			<h5 id="1" style={{color:'#FFFFFF'}}></h5>
          </div>
          <div class='gradient col-sm-4'style={{borderRadius:"20%",boxShadow:"1px 1px 10px #000000"}}>
            <h2 style={{color:'#FFFFFF'}}>3 : Helicopter</h2>
			<img src="https://static.vecteezy.com/system/resources/previews/019/145/655/original/helicopter-isolated-on-transparent-background-3d-rendering-illustration-free-png.png" alt="react logo" style={{ width: '50%' }}/>
			<br></br>
            <Button onClick={ () => bid(2)}>Bid</Button>
			<h5 id="2" style={{color:'#FFFFFF'}}></h5>
          </div>
        </div>

		<div className='row' style={{marginTop:"40px"}}>
          <h2 style={{marginBottom:"40px"}}>Further Options</h2>
          {/* <div class='gradient col-sm-4' style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}}>
            
            <Button onClick={ () => reveal()}>Reveal</Button>
          </div> */}
          <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}} >
            
            <Button onClick={ () => amiWinner()}>Am I Winner</Button>
			<div class='card' id='items_won' style={{boxShadow:"1px 1px 10px #000000"}}>
              <label for='floatingInput'>Items you have won</label>

            </div>
            <div class='card' id='items_won'></div>
			
          </div>

		  <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000"}}>
            <h2 style={{color:'#FFFFFF'}}>Total earnings in Ether</h2>
            
			<h5 id="totalEther" style={{color:'#FFFFFF'}}></h5>
          </div>
          
        </div>

		
		
          
        

		<div hidden id="adminPanel" className='row' style={{marginTop:"40px"}}>
          <h2 style={{marginBottom:"40px"}}>Admin Panel</h2>
          
          <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000",marginBottom:"2%",marginRight:"1%"}}>
            
            <Button onClick={ () => withdraw() }>Withdraw</Button>
          </div>
		  <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000",marginBottom:"2%",marginRight:"1%"}}>
            
            <Button onClick={ () => declareWinner()}>Declear Winner</Button>
          </div>
		  <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000",marginBottom:"2%",marginRight:"1%"}}>
            
            <Button onClick={ () => reset()}>reset</Button>
          </div>
		  <div class='gradient col-sm-4'style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000",marginBottom:"2%",marginRight:"1%"}}>
            
            <Button onClick={ () => destroy()}>Destroy Contract</Button>
          </div>
		  <div class='gradient col-sm-4' id='wallet-owner-address' style={{borderRadius:"25px",boxShadow:"1px 1px 10px #000000",marginBottom:"2%",marginRight:"1%"}}>
              
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
