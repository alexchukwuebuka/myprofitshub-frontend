import {useEffect } from 'react';
import { motion,AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Signup from './pages/Signup';
import Userdashboard from './pages/Userdashboard'
import Userdashboardfundaccount from './components/userdashboardfundaccount/Userdashboardfundaccount'
import Userdashboardwithdraw from './components/userdashboardwithdraw/Userdashboardwithdraw';
import Userdashboardtransactions from './components/userdashboardtransactions/Userdashboardtransactions';
import Profile from './components/profile/Profile'
import VerifyEmail from './pages/VerifyEmail';
import WithdrawalLogs from './components/WithdrawalLogs';
import Checkout from './components/Checkout';
import Admindashboard from './components/admindashboard/Admindashboard';
import Deposit from './components/deposit/Deposit';
import './App.css'
import UserdashboardCopytrade from './components/userdashboardCopytrade/UserdashboardCopytrade';
import UserdashboardKyc from './components/userdashboardKyc/UserdashboardKyc';
import UserdashboardLiveTrading from './components/userdashboardLiveTrading/UserdashboardLiveTrading';
import UserdashboardTraders from './components/userdashboardTraders/UserdashboardTraders';
import UserdashboardRanking from './components/userdashboardRanking/UserdashboardRanking'
import ForgotPassword from './components/forgotpassword/ForgotPassword';
import PasswordReset from './components/passwordreset/PasswordReset';

function App() {
   useEffect(() => {
    AOS.init({
      offset: 60,
      duration: 500,
      easing: 'ease-in-sine',
      delay: 100,
    })
      AOS.refresh()
    // duration=1200;
    }, [])

    const route = 'https://vaultmirror.vercel.app'
    // const route = 'http://localhost:5000'
  
  return (
    <>
    <AnimatePresence >
        <Router>
        <motion.div className="App"
        key={Routes.Route}
        initial="initialState"
        animate="animateState"
        exit="exitState"
        transition={{duration:0.2}}
        variants={{
          initialState:{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          },
          animateState:{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          },
          exitState:{
            clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
          }
        }}
        >
          <Routes>
            <Route path='/' element={<Login route={route}/>}/>
            <Route path='/signup' element={<Signup route={route}/>}/>
            <Route path='/dashboard' element={<Userdashboard route={route}/>}/>
            <Route path='/fundwallet' element={<Userdashboardfundaccount route={route}/>}/>
            <Route path='/withdraw' element={<Userdashboardwithdraw route={route}/>}/>
            <Route path='/transactions' element={<Userdashboardtransactions route={route}/>}/>
            <Route path='/settings' element={<Profile route={route}/>}/>
            <Route path='/user/:id' element={<VerifyEmail route={route}/>}/>
            <Route path='/withdrawlogs' element={<WithdrawalLogs route={route}/>}/>
            <Route path='/checkout' element={<Checkout route={route}/>}/>
            <Route path='/admin' element={<Admindashboard route={route}/>}/>
            <Route path='/deposit' element={<Deposit route={route}/>}/>
            <Route path='/usercopytrade' element={<UserdashboardCopytrade route={route} />}/>
            <Route path='/traders' element={<UserdashboardTraders route={route} />}/>
            <Route path='/live-trading' element={<UserdashboardLiveTrading route={route} />}/>
            <Route path='/kyc' element={<UserdashboardKyc route={route} />} />
            <Route path="/login" element={<Login route={route} />} />
            <Route path='/ranking' element={<UserdashboardRanking route={route}/>}/>
            <Route path='/passwordreset' element={<ForgotPassword route={route}/>}/>
            <Route path='/resetpassword/:email' element={<PasswordReset route={route}/>}/>
          </Routes>
        </motion.div>
      </Router>
      </AnimatePresence>
    </>
  );
}

export default App
