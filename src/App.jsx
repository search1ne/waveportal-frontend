import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json"
import StatusMessages from "../components/StatusMessages"
import CustomMessageForm from "../components/CustomMessageForm"
import "./App.css";

const getEthereumObject = () => window.ethereum;

const App = () => {
  const [totalWaves, setTotalWaves] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGoodVibes, setIsGoodVibes] = useState(false);
  
  const contractAddress = "0x889c8ac555B982Da4c359132bb9AeC2F19A1DCa8"
  const contractABI = abi.abi;  

  /*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
  const findMetaMaskAccount = async () => {
    try {
      const ethereum = getEthereumObject();
  
      /*
      * First make sure we have access to the Ethereum object.
      */
      if (!ethereum) {
        console.error("Make sure you have Metamask!");
        return null;
      }
  
      console.log("We have the Ethereum object", ethereum);
      const accounts = await ethereum.request({ method: "eth_accounts" });
  
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        return account;
      } else {
        console.error("No authorized account found");
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };  

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  // call wave function from smart contract
  const wave = async (customMessage) => {
    
      try {
        const { ethereum } = window;
        setIsGoodVibes(false);
        setIsLoading(true);        
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  
          console.log("Custom Message:", customMessage);

          /*
          * Execute the actual wave function from your smart contract
          */
  
          const waveTxn = await wavePortalContract.wave(customMessage, { gasLimit: 300000 });
          setIsLoading(false);
          setIsGoodVibes(true);
          console.log("Mining...", waveTxn.hash);
  
          await waveTxn.wait(); 
          
          setIsSuccess(true);
          console.log("Mined -- ", waveTxn.hash);
  
          count = await wavePortalContract.getTotalWaves();
          setTotalWaves(count.toNumber());        
          setIsGoodVibes(false);
          console.log("Retrieved total wave count...", count.toNumber());
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
      
    }
    
    // Create a method that gets all waves from your contract    
    const getAllWaves = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
          
          // Call the getAllWaves method from your Smart Contrac     
          const waves = await wavePortalContract.getAllWaves();
  
          // We only need address, timestamp, and message in our UI so let's  pick those out          
          let wavesCleaned = [];
          waves.forEach(wave => {
            wavesCleaned.push({
              address: wave.waver,
              timestamp: new Date(wave.timestamp * 1000),
              message: wave.message
            });
          });
          console.log("Waves cleaned:", wavesCleaned);
          
         // Store our data in React State
          setAllWaves(wavesCleaned);
        } else {
          console.log("Ethereum object doesn't exist!")
        }
      } catch (error) {
        console.log(error);
      }
    }
    
    // check for metamask
    useEffect(() => {
        findMetaMaskAccount();
    }, []);

    useEffect(() => {
      let wavePortalContract;

      const onNewWave = (from, timestamp, message) => {
          console.log("NewWave", from, timestamp, message);
          setAllWaves((prevState) => [
              ...prevState,
              {
                  address: from,
                  timestamp: new Date(timestamp * 1000),
                  message: message,
              },
          ]);
      };

      if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
          wavePortalContract.on("NewWave", onNewWave);
      }

      return () => {
          if (wavePortalContract) {
              wavePortalContract.off("NewWave", onNewWave);
          }
      };
    }, []);
  
return (
  <div className="mainContainer">

    <div className="dataContainer">

      <div className="header">
      👋 Hey there!
      </div>
      
      <div className="bio">
      Hi! I am Paulo, a web3 alchemist.
      Connect your wallet and send some gm!
      </div>          

      <div className="waveForm">    
        <CustomMessageForm wave={wave} />
      </div>
      
      <div className="connectWallet">
        {!currentAccount && (
          <button className="button" onClick={connectWallet}>
           Connect Wallet
          </button>
        )}
      </div>

      <div className="vibes">
        <p>Total Vibes sent: {totalWaves}</p>
      </div>
      
      <div className="">
        <StatusMessages 
        isLoading={isLoading}
        isSuccess={isSuccess}
        isGoodVibes={isGoodVibes}
        />
      </div>
      
      <div className="messagebox">  
          {allWaves.map((wave, index) => {
          return (
            <div>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
            )
          })}
      </div>

      <div className="footer-container">
        <footer>
          <p>Built by <a href="https://lenster.xyz/u/searchone">searchØNE🌿🧪</a></p>
          <p>Learn with me at <a href="https://buildspace.so/">Buildspace</a></p>
        </footer>
      </div>
      
      
    </div>
  </div>
      
);
};

export default App;