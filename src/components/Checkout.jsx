import React, {useEffect,useState} from 'react'
import Userdashboardheader from './userdashboardheader/Userdashboardheader'
import Deposit from './Deposit'
import { useNavigate } from 'react-router-dom'
import {AiOutlineArrowLeft} from 'react-icons/ai'
const Checkout = ({Active,depositAmount,closepage,route,currency}) => {
    const [checkout,setCheckout] = useState(true)
    const [active,setActive] = useState(Active)
    const [deposit,setDeposit] = useState(false)
    const [amount,setAmount] = useState(depositAmount)
    const navigate = useNavigate()
    useEffect(()=>{
        if(Active === undefined){
            navigate('/fundwallet')
        }
    },[])
    const close = ()=>{
        setDeposit(false)
        setCheckout(true)
    }
  return (
    <>
        {
            checkout &&
            <div>
                <div className="checkout-page">
                    <div className="floating-btn" onClick={()=>{
                        closepage()
                    }}>
                        <AiOutlineArrowLeft />
                    </div>
                        <h3>Payment Preview</h3>
                        <p>Review withdrawal details.</p>
                    <div className="checkout-info-container">
                        <img src={Active.image} alt="" />
                        <div className="info-pallets">
                            <p>amount to deposit: {depositAmount} {currency}</p>
                        </div>
                        <div className="info-pallets">
                            <p>charge: 0 {currency}</p>
                        </div>
                        <div className="info-pallets">
                            <p>minimum deposit: {Active.min} {currency}</p>
                        </div>
                        <div className="info-pallets">
                            <p>conversion rate: 1{currency} = {Active.min} {currency} </p>
                        </div>
                        <div className="info-pallets">
                            <p>in {currency} {depositAmount}</p>
                        </div>
                        <div class="uiverse" onClick={()=>{
                            setDeposit(true)
                            setCheckout(false)
                            }} >
                            <span class="tooltip">continue to submit</span>
                            <span >
                                confirm
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        }
        {
            deposit && 
            <Deposit amount={amount} active={active} close={close} route={route} currency={currency}/>
        }
    </>
    
  )
}

export default Checkout