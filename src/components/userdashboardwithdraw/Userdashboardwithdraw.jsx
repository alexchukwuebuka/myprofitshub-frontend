import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import WithdrawReview from "../WithdrawReview";
import Loader from "../Loader";

const Userdashboardwithdraw = ({ route }) => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [minWithdraw, setMinWthdraw] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [activeMethod, setActiveMethod] = useState();
  const [checkoutPage, setCheckoutPage] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState();
  const [percentageReview, setPercentageReview] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  useEffect(() => {
    setLoader(true);
    if (localStorage.getItem("token")) {
      const getData = async () => {
        const req = await fetch(`${route}/api/getData`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        });
        const res = await req.json();
        setUserData(res);

        if (res.status === "error") {
          navigate("/login");
        }
        setLoader(false);
        if (res.percentage === 0) {
          setMinWthdraw(res.funded / 2);
        } else {
          setMinWthdraw((res.funded * res.percentage) / 100);
        }
      };
      getData();
    } else {
      navigate("/login");
    }
  }, []);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const close = () => {
    setCheckoutPage(false);
  };

  const withdrawMethods = [
  { id: 1, image: "/tron.png", method: "USDT (TRC20)", min: 10, max: 1000000 },
  { id: 2, image: "/tron.png", method: "USDT (ERC20)", min: 10, max: 1000000 },
  { id: 3, image: "/tron.png", method: "USDT (SOL)", min: 10, max: 1000000 },
  { id: 4, image: "/usdc-coin.png", method: "USDC (TRC20)", min: 10, max: 1000000 },
  { id: 5, image: "/usdc-coin.png", method: "USDC (ERC20)", min: 10, max: 1000000 },
  { id: 6, image: "/tron.png", method: "USDC (SOL)", min: 10, max: 1000000 },
];


  const handleChange = (e) => {
    const selectedMethod = e.target.value;
    const methodDetails = withdrawMethods.find((opt) => opt.method === selectedMethod);
    setSelectedCrypto(methodDetails);
  };

  return (
    <>
      {loader && <Loader />}

      {/* MODAL: Percentage Review */}
      {percentageReview && (
        <AnimatePresence>
          <motion.div>
            <div className="modal-container">
              <div className="modal">
                <div className="modal-header">
                  <h2>Withdrawal Fee Alert</h2>
                  <p>Hi {userData.firstname}</p>
                </div>

                <MdClose
                  className="close-modal-btn"
                  onClick={() => setPercentageReview(false)}
                />

                {(() => {
                  const percentage = userData.minpercent;
                  const amount = (withdrawAmount / 100) * percentage;
                  const method = (activeMethod?.method || "").toUpperCase();

                let depositCrypto = "";
                let cryptoSymbol = "";

                // ✅ Determine deposit base crypto based on network
                if (method.includes("TRC20")) {
                  depositCrypto = "TRON";
                  cryptoSymbol = "TRX";
                } else if (method.includes("ERC20")) {
                  depositCrypto = "ETHEREUM";
                  cryptoSymbol = "ETH";
                } else if (method.includes("SOL")) {
                  depositCrypto = "SOLANA";
                  cryptoSymbol = "SOL";
                } else {
                  depositCrypto = method;
                }

                return (
                  <p className="withdraw-alert">
                    You have to deposit{" "}
                    <b>
                      {`${percentage}% (${amount.toFixed(2)})`}
                    </b>{" "}
                    of your withdrawal amount in{" "}
                    <b>
                      {depositCrypto} {cryptoSymbol && `(${cryptoSymbol})`}
                    </b>{" "}
                    to proceed with this withdrawal.
                  </p>
                );
              })()}


                <div className="modal-btn-container">
                  <button className="next" onClick={() => navigate("/fundwallet")}>
                    <span className="label">Deposit</span>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path
                          fill="currentColor"
                          d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* MAIN UI */}
      {!checkoutPage && (
        <div>
          {showModal && (
            <AnimatePresence>
              <motion.div>
                <div className="modal-container">
                  <div className="modal">
                    <div className="modal-header">
                      <h2>Withdraw via {activeMethod.method}</h2>
                      <p>Min: {minWithdraw}</p>
                    </div>
                    <MdClose
                      className="close-modal-btn"
                      onClick={() => setShowModal(false)}
                    />
                    <div className="modal-input-container">
                      <div className="modal-input">
                        <input
                          type="tel"
                          placeholder="0.00"
                          onChange={(e) => {
                            setWithdrawAmount(parseInt(e.target.value));
                          }}
                        />
                        <span>{userData ? userData.currency : '$'}</span>
                      </div>
                    </div>
                    <div className="modal-btn-container">
                      <button
                        className="noselect"
                        onClick={() => setShowModal(false)}
                      >
                        <span className="text">Close</span>
                      </button>
                      <button
                        className="next"
                        onClick={() => {
                          if (
                            withdrawAmount >= minWithdraw &&
                            withdrawAmount <= userData.funded
                          ) {
                            setShowModal(false);
                            setPercentageReview(true);
                          } else if (isNaN(withdrawAmount)) {
                            Toast.fire({
                              icon: "warning",
                              title: `Amount must be a number`,
                            });
                          } else {
                            Toast.fire({
                              icon: "warning",
                              title: `Insufficient balance or below limit`,
                            });
                            setCheckoutPage(false);
                          }
                        }}
                      >
                        <span className="label">Next</span>
                        <span className="icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                          >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path
                              fill="currentColor"
                              d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                            ></path>
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          <div className="page-swiper-wrapper">
            <div className="floating-btn" onClick={() => navigate("/dashboard")}>
              <AiOutlineArrowLeft />
            </div>
            <div className="page-header hi">
              <h3>Choose an Option</h3>
              <h2>Withdrawal Methods</h2>
              <p>Choose a withdrawal method to withdraw money.</p>
            </div>
            <div className="swiper-container">
              <div className="updated-crypto-container">
                <h2>Select Cryptocurrency</h2>
                <select
                  onChange={handleChange}
                  defaultValue=""
                  className="crypto-select"
                >
                  <option value="" disabled>
                    Select method
                  </option>
                  {withdrawMethods.map((opt) => (
                    <option key={opt.id} value={opt.method}>
                      {opt.method}
                    </option>
                  ))}
                </select>

                {selectedCrypto && (
                  <div className="updated-crypto-card">
                    <div className="updated-img-cont">
                      <img
                        src={selectedCrypto.image}
                        alt={selectedCrypto.method}
                        className="updated-crypto-img"
                      />
                    </div>
                    <p>
                      <strong>Method:</strong> {selectedCrypto.method}
                    </p>
                    <p>
                      <strong>Minimum withdrawal:</strong> {userData && userData.currency === 'EUR' || userData.currency === 'GBP' ? '€' : '$'}{minWithdraw}
                    </p>
                    <button
                      className="deposit-btn updated-btn"
                      onClick={() => {
                        setActiveMethod(selectedCrypto);
                        setShowModal(true);
                      }}
                    >
                      Proceed
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button
              className="history-btn"
              onClick={() => navigate("/withdrawlogs")}
            >
              Withdrawal history <FiArrowRight />
            </button>
          </div>
        </div>
      )}

      {checkoutPage && (
        <WithdrawReview
          Active={activeMethod}
          withdrawAmount={withdrawAmount}
          closepage={close}
          route={route}
          funded={userData.funded}
          currency= {userData.currency}
        />
      )}
    </>
  );
};

export default Userdashboardwithdraw;
