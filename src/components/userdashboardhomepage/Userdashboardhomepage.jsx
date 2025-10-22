import React from 'react'
import './userdashboardhomepage.css'
import { FaUserAlt,FaAngleDown } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom'
import { useState,useEffect,useRef } from 'react'
import { IoMdNotifications } from "react-icons/io";
import Loader from '../Loader'
import { IoCloseSharp } from "react-icons/io5";
import { RiLuggageDepositLine } from "react-icons/ri";
import Userdashboardheader from '../userdashboardheader/Userdashboardheader'
import { BiMoneyWithdraw } from "react-icons/bi";
import TeslaWidget from '../TeslaWidget'
import MobileDropdown from '../MobileDropdown';

const Userdashboardhomepage = ({route}) => {
    const navigate = useNavigate()
    const [userData, setUserData] = useState()
  const [loader, setLoader] = useState(false)
  const [showNotification, setShowNotification] = useState(true)
  const [showMobileDropdown, setShowMobileDropdown] = useState(false)
  const [dailyTrades, setDailyTrades] = useState([])
    const copy = ()=>{
        navigator.clipboard.writeText(clipRef.current.value)
    }
  const clipRef = useRef(null)
  const today = new Date().toLocaleDateString()
  

   useEffect(() => {
  const getData = async () => {
    try {
      setLoader(true);

      // Check if a token exists
        const token = localStorage.getItem('token');
        console.log(token)
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch user data from the API
      const response = await fetch(`${route}/api/getData`, {
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json',
        },
      });

      // Parse the response
      const data = await response.json();

      // Handle errors from the API
      if (data.status === 'error') {
        localStorage.removeItem('token'); // Clear invalid token
        navigate('/login');
      } else {
        setUserData(data); // Set user data
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login'); // Navigate to login on failure
    } finally {
      setLoader(false); // Stop loader
    }
  };

  getData();
   }, [navigate, route]);
  
  const closeMobileMenu = () => {
    setShowMobileDropdown(false)
  }

  useEffect(() => {
      // Run this only when both traders and userData.trader are ready
    if (userData?.trades.length > 0 && userData) {
        
        const dailytrades = userData.trades.filter(trade => trade.date === today)
  
        console.log("daily trades:", dailytrades);
        setDailyTrades(dailytrades);
      }
    }, [userData]);
  

  

  
    
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
            {
              showNotification && userData && userData.funded === 0 &&
              <span className="notification-counter">1</span>
            }
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
        {
          userData && showNotification && userData.funded === 0 ? 
            <div className="notification-dashoboard-container">
              <div className="notification-card">
                <p>you have not deposited yet click <Link to='/fundwallet'>Here</Link> to make your first deposit</p>
                <div className="close-notification-container" onClick={()=> setShowNotification(false)}>
                    <IoCloseSharp />
                </div>
              </div>
            </div>
            : ''
        }
        
        <div className="dashboard-overview-container">
          <MobileDropdown showStatus={showMobileDropdown} route={route} closeMenu={closeMobileMenu} />
          <div className="upper-overview-card">
            <div className="total-balance-container">
              <h2 className="main-balance">
                Total Balance
              </h2>
              <div className="amount">
                <h3>${userData ? userData.funded : '0'}.00</h3>
                <span className="usd-btn">usd</span>
              </div>
            </div>
            <div className="overview-btn-container">
              <div className="deposit-btn-container">
                <Link to='/fundwallet' className='user-deposit-btn'>
                  <span>deposit</span>
                </Link>
                <Link to='/withdraw' className='user-deposit-btn'>
                  <span>withdraw</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="lower-overview-card-container">
            <div className="lower-overview-card">
              <div className="lower-card-icon-container">
                <RiLuggageDepositLine />
              </div>
              <div className="lower-card-text-container">
                <h3>total deposit</h3>
                <p>${userData ? userData.totaldeposit : '0'}.00</p>
              </div>
            </div>
            <div className="lower-overview-card">
              <div className="lower-card-icon-container">
                  <BiMoneyWithdraw />
              </div>
              <div className="lower-card-text-container">
                <h3>total withdrawal</h3>
                <p>${userData ? userData.totalwithdraw : '0'}.00</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-chart-container">
          <TeslaWidget />
        </div>
        
        {userData && dailyTrades.length !== 0 ? 
          <div className="page-swiper-wrapper trans-page">
          <div className="page-header">
              <h3>checkout your Daily trade logs</h3>
              <h2>Daily trade logs</h2>
              <p>we keep track of all the trades taken by your trader daily</p>
          </div>
          <div className="transaction-container no-ref">
            <table>
                <thead>
                  <tr>
                    <td>trade pair</td>
                    <td>amount</td>
                    <td>type</td>
                    <td>date</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    dailyTrades.map(refer =>
                      <tr className='tr'>
                        <td>{refer.pair}</td>
                        <td>$ {refer.amount} USD</td>
                        <td className={`${refer.tradeType === 'profit' ? 'profit' : 'loss'}`}> {refer.tradeType}</td>
                        <td>{refer.date}</td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
              </div>
            </div>
          :
            <div className="empty-page home-empty-page">
              <img src="/preview.gif" alt="" className='empty-img dash-empty-img'/>
              <p>Your Trader has not placed any trades for your account Today. Trades taken by your trader  today would be displayed here when available.</p> 
            </div>
      }
    </section>
    </main>
  )
}

export default Userdashboardhomepage

