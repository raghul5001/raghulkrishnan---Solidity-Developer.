import React, { useState } from 'react';
import Web3 from 'web3';
import TokenAirdrop from './abis/TokenAirdrop.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3Instance.eth.getAccounts();
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = TokenAirdrop.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(TokenAirdrop.abi, deployedNetwork && deployedNetwork.address);
        setWeb3(web3Instance);
        setContract(contractInstance);
        setAccounts(accounts);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please install MetaMask to use this dApp.');
    }
  };

  const executeAirdrop = async () => {
    try {
      await contract.methods.executeAirdrop([recipient], amount).send({ from: accounts[0] });
      console.log('Airdrop successful');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Token Airdrop dApp</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      {web3 && (
        <div>
          <p>Connected Account: {accounts[0]}</p>
          <input type="text" placeholder="Recipient Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          <input type="number" placeholder="Airdrop Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button onClick={executeAirdrop}>Execute Airdrop</button>
        </div>
      )}
    </div>
  );
}

export default App;
