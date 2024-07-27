import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import Head from 'next/head';
import abi from '../utils/BuyMeACoffee.json';
import { Coffee, Wallet, Send, ChevronDown, Github, Twitter } from 'lucide-react';

export default function Home() {
  const contractAddress = "0x55D1CB16c8301012783af7C0565C3C881c3C7F1c";
  const contractABI = abi.abi;

  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);
  const [showMemos, setShowMemos] = useState(false);

  const onNameChange = (event) => setName(event.target.value);
  const onMessageChange = (event) => setMessage(event.target.value);

  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install MetaMask");
        return;
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const buyCoffee = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);
        const coffeeTxn = await buyMeACoffee.buyCoffee(
            name || "Anonymous",
            message || "Enjoy your coffee!",
            { value: ethers.utils.parseEther("0.001") }
        );
        await coffeeTxn.wait();
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, provider);
        const memos = await buyMeACoffee.getMemos();
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getMemos();
    const onNewMemo = (from, timestamp, name, message) => {
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        }
      ]);
    };

    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      buyMeACoffee = new ethers.Contract(contractAddress, contractABI, provider);
      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    };
  }, []);

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 font-sans">
        <Head>
          <title>Fuel Anjil's Coding Journey</title>
          <meta name="description" content="Support innovative development" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="container mx-auto px-4 py-12">
          <motion.h1
              className="text-6xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Fuel Anjil's Web3 Journey
          </motion.h1>

          <motion.div
              className="max-w-3xl mx-auto mb-12 text-center text-lg text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
          >
            Your support powers the creation of innovative open-source projects and cutting-edge web3 experiments.
          </motion.div>

          {currentAccount ? (
              <motion.div
                  className="bg-gray-800 rounded-xl p-8 shadow-2xl max-w-2xl mx-auto border border-gray-700"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
              >
                <form>
                  <div className="mb-6">
                    <label className="block text-xl font-medium mb-2">Your Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Coding Enthusiast"
                        className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400"
                        onChange={onNameChange}
                        value={name}
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-xl font-medium mb-2">Your Message</label>
                    <textarea
                        rows={3}
                        placeholder="Share your thoughts or encouragement..."
                        id="message"
                        className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400"
                        onChange={onMessageChange}
                        value={message}
                        required
                    />
                  </div>
                  <motion.button
                      type="button"
                      onClick={buyCoffee}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center"
                      whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(6, 182, 212, 0.7)" }}
                      whileTap={{ scale: 0.95 }}
                  >
                    <Coffee className="mr-2" />
                    Fuel Innovation with 0.001 ETH
                  </motion.button>
                </form>
              </motion.div>
          ) : (
              <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
              >
                <motion.button
                    onClick={connectWallet}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 px-8 rounded-lg text-2xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(6, 182, 212, 0.7)" }}
                    whileTap={{ scale: 0.95 }}
                >
                  <Wallet className="mr-2" />
                  Connect Your Wallet
                </motion.button>
              </motion.div>
          )}

          <motion.div
              className="mt-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.button
                onClick={() => setShowMemos(!showMemos)}
                className="flex items-center justify-center mx-auto mb-8 text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
              {showMemos ? "Hide" : "Show"} Supporter Messages
              <ChevronDown className={`ml-2 transform transition-transform duration-300 ${showMemos ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {showMemos && (
                  <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {memos.map((memo, idx) => (
                          <motion.div
                              key={idx}
                              className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
                              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                              transition={{ delay: idx * 0.1, duration: 0.5 }}
                          >
                            <p className="font-semibold text-xl mb-3 text-cyan-300">"{memo.message}"</p>
                            <p className="text-sm text-gray-400">From: {memo.name} at {memo.timestamp.toString()}</p>
                          </motion.div>
                      ))}
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>

        <footer className="bg-gray-900 text-gray-300 p-6 mt-16">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <a
                href="https://skepticfuzz.wordpress.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-semibold text-xl flex items-center mb-4 md:mb-0"
            >
              <Send className="mr-2" />
              Explore My Tech Blog
            </a>
            <div className="flex space-x-4">
              <a href="https://github.com/fuzztobread" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Github size={24} />
              </a>
              <a href="https://twitter.com/fuzztobread" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </footer>
      </div>
  );
}