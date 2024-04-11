import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import Dashboard from "./Dashboard";

function AuthPrompt() {
  const [loginStep, setLoginStep] = useState(false);

  const flip = () => {
    setLoginStep(!loginStep);
  };

  return (
    <div>
      {loginStep && <Login flip={flip} />}
      {!loginStep && <SignUp flip={flip} />}
    </div>
  );
}

function Auth() {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const authRef = useRef();

  const scrollToAuth = () => {
    authRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, isLoading]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-[80rem] p-8 border border-gray-300 rounded-lg shadow-lg flex flex-col md:flex-row h-full md:h-[52rem]">
        <div className="md:w-2/3 p-2 flex flex-col mb-4 md:mb-0 md:mr-4">
          <div className="flex items-center mb-3">
            <img src="/pawlogo.png" alt="Ghostlamp logo" className="h-8 mr-3" />
            <span className="text-2xl font-bold text-gray-800">
              The Bear Bazaar
            </span>
          </div>
          <p className="text-[#a51417] font-semibold text-lg">
            Connect with other WashU students to exchange meal points
          </p>
          <div className="flex-grow">
            <Dashboard useInAuth={true} />
          </div>
        </div>

        <div className="md:w-1/3 py-8 flex flex-col">
          <div
            className="flex-grow flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-300 pt-8 md:pt-0 px-2 md:px-8"
            ref={authRef}
          >
            <AuthPrompt />
          </div>
        </div>
      </div>

      <button
        onClick={scrollToAuth}
        className="fixed bottom-5 right-5 z-10 bg-[#a51417] text-white px-3 pt-2 pb-3 rounded-full shadow-lg md:hidden focus:outline-none"
      >
        Go to Login
      </button>
    </div>
  );
}

export default Auth;
