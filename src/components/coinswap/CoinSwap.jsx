import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import "./CoinSwap.css";
import { FaUserAlt,FaAngleDown } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { IoMdNotifications } from "react-icons/io";
import Loader from '../Loader'
import { IoCloseSharp } from "react-icons/io5";
import { RiLuggageDepositLine } from "react-icons/ri";
import Userdashboardheader from '../userdashboardheader/Userdashboardheader'
import { BiMoneyWithdraw } from "react-icons/bi";
import TeslaWidget from '../TeslaWidget'
import MobileDropdown from '../MobileDropdown';

const supportedCoins = [
  { name: "Bitcoin", symbol: "BTC", coingeckoId: "bitcoin" },
  { name: "Ethereum", symbol: "ETH", coingeckoId: "ethereum" },
  { name: "Tron", symbol: "TRON", coingeckoId: "tron" },
  { name: "Solana", symbol: "SOL", coingeckoId: "solana" },
  { name: "Ripple", symbol: "XRP", coingeckoId: "ripple" },
  { name: "USDT (TRC20)", symbol: "USDT_TRON", coingeckoId: "tether" },
  { name: "USDT (ERC20)", symbol: "USDT_ETH", coingeckoId: "tether" },
  { name: "USDT (SOL)", symbol: "USDT_SOL", coingeckoId: "tether" },
  { name: "USDC (TRC20)", symbol: "USDC_TRON", coingeckoId: "usd-coin" },
  { name: "USDC (ERC20)", symbol: "USDC_ETH", coingeckoId: "usd-coin" },
  { name: "USDC (SOL)", symbol: "USDC_SOL", coingeckoId: "usd-coin" },
];

const CoinSwap = ({ route }) => {
    const [loader, setLoader] = useState(false)
    const [showNotification, setShowNotification] = useState(true)
    const [showMobileDropdown, setShowMobileDropdown] = useState(false)
  const [userData, setUserData] = useState(null);
  const [fromCoin, setFromCoin] = useState("");
  const [toCoin, setToCoin] = useState("");
  const [rate, setRate] = useState(null);
  const [validSwap, setValidSwap] = useState(false);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  // ✅ Fetch user data and balance
  useEffect(() => {
    const getData = async () => {
      try {
        const req = await fetch(`${route}/api/getData`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        });
        const res = await req.json();
        if (res.status === "error") {
          Swal.fire("Session expired", "Please log in again.", "error");
          return;
        }
        setUserData(res);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    getData();
  }, [route]);

  // ✅ Fetch conversion rates
  useEffect(() => {
    const fetchRates = async () => {
      if (!fromCoin || !toCoin) {
        setRate(null);
        setValidSwap(false);
        return;
      }

      const from = supportedCoins.find((c) => c.symbol === fromCoin);
      const to = supportedCoins.find((c) => c.symbol === toCoin);

      const isFromStable =
        from.name.includes("USDT") || from.name.includes("USDC");
      const isToStable = to.name.includes("USDT") || to.name.includes("USDC");

      // Validate allowed swap directions
      if (isFromStable && isToStable) {
        setValidSwap(false);
        setRate(null);
        return;
      }
      if (isFromStable && !isToStable) {
        setValidSwap(false);
        setRate(null);
        return;
      }
      if (!isFromStable && isToStable) {
        setValidSwap(true);
      } else {
        setValidSwap(false);
        setRate(null);
        return;
      }

      try {
        const fromUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${from.coingeckoId}&vs_currencies=usd`;
        const res = await fetch(fromUrl);
        const data = await res.json();
        const fromUSD = data[from.coingeckoId]?.usd || 0;
        const toUSD = 1; // stablecoins ≈ 1 USD
        const calcRate = fromUSD / toUSD;
        setRate(calcRate.toFixed(6));
      } catch (err) {
        console.error(err);
        setRate(null);
      }
    };

    fetchRates();
  }, [fromCoin, toCoin]);

  // ✅ Update "You’ll Receive"
  useEffect(() => {
    if (rate && fromAmount && validSwap) {
      setToAmount((fromAmount * rate).toFixed(6));
    } else {
      setToAmount("");
    }
  }, [fromAmount, rate, validSwap]);

  // ✅ Handle swap action
  const handleSwap = async () => {
    if (!validSwap) {
      Swal.fire("Swap not allowed", "This swap direction is restricted.", "error");
      return;
    }

    if (!fromAmount || fromAmount <= 0) {
      Swal.fire("Invalid amount", "Enter a valid amount to swap.", "warning");
      return;
    }

    if (userData && fromAmount > userData.funded) {
      Swal.fire(
        "Insufficient balance",
        `You only have $${userData.funded.toFixed(2)} available.`,
        "error"
      );
      return;
    }

    Swal.fire(
      "Swap Confirmed",
      `You are swapping ${fromAmount} ${fromCoin} ≈ ${toAmount} ${toCoin}`,
      "success"
    );

    // TODO: Add your actual swap API call here
    // await fetch(`${route}/api/swap`, { method: "POST", ... })
    };
    const closeMobileMenu = () => {
    setShowMobileDropdown(false)
  }

    return (
        <main className='homewrapper'>
      {
        loader &&
          <Loader />
      }
    <Userdashboardheader />
      <section className='dashboardhomepage'>
        
        <div className="dashboardheaderwrapper">
          <div className="header-notification-icon-container">
              <IoMdNotifications />
          </div>
          <div className="header-username-container">
            <h3>Hi, {userData ? userData.firstname : ''}</h3>
          </div>
          <div className="header-userprofile-container">
            <div className="user-p-icon-container">
              <FaUserAlt/>
            </div>
            <div className="user-p-drop-icon" onClick={() => { setShowMobileDropdown(!showMobileDropdown); }
             }>
              <FaAngleDown />
            </div>
            
          </div>
        </div>
      
        <div className="swap-container">
                    <MobileDropdown showStatus={showMobileDropdown} route={route} closeMenu={closeMobileMenu} />
      <h2>Crypto Swap</h2>

      {userData && (
        <p className="balance-display">
          Available Balance: <b>${userData.funded.toFixed(2)}</b>
        </p>
      )}

      <div className="swap-box">
        <div className="input-group">
          <label>From</label>
          <select value={fromCoin} onChange={(e) => setFromCoin(e.target.value)}>
            <option value="">Select coin</option>
            {supportedCoins.map((coin) => (
              <option key={coin.symbol} value={coin.symbol}>
                {coin.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>To</label>
          <select value={toCoin} onChange={(e) => setToCoin(e.target.value)}>
            <option value="">Select coin</option>
            {supportedCoins.map((coin) => (
              <option key={coin.symbol} value={coin.symbol}>
                {coin.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Amount</label>
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(parseFloat(e.target.value) || "")}
            placeholder="Enter amount"
            max={userData?.funded || ""}
          />
        </div>

        {rate && validSwap && (
          <p className="rate-display">
            1 {fromCoin} ≈ {rate} {toCoin}
          </p>
        )}

        <AnimatePresence>
          {toAmount && validSwap && (
            <motion.div
              key={toAmount}
              className="output-group"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <label>You’ll Receive:</label>
              <p>
                {toAmount} {toCoin}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!validSwap && fromCoin && toCoin && (
          <p className="error-text">⚠️ Swap direction not allowed</p>
        )}

        <button
          onClick={handleSwap}
          disabled={!validSwap || !rate}
          className={validSwap ? "swap-btn" : "swap-btn disabled"}
        >
          Swap
        </button>
      </div>
    </div>
    </section>
    </main>
  );
};

export default CoinSwap;
