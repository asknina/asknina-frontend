"use client";
import React, { useEffect, useState } from "react";
import "firebaseui/dist/firebaseui.css";

import { useAuth } from "@/components/auth/useAuth";
import MainContainer from "@/components/common/MainContainer";
import Button from "@/components/common/Button";
import Image from "next/image";
import askNinaLogo from "../../../public/logos/ask-nina-logo-400x400.png";

const Login = ({ user, isLoggedIn }: any) => {
  const { handleSignOut, handleSignInWithGoogle } = useAuth();
  const handleSignOutClick = (event: any) => {
    event.preventDefault();
    handleSignOut();
  };

  const handleSignInClick = (event: any) => {
    event.preventDefault();
    handleSignInWithGoogle();
  };

  return (
    <MainContainer>
      <div className="flex relative">
        <Image src={askNinaLogo} alt={"ask-nina"} priority />
      </div>

      {user ? (
        <>
          <div className="profile">
            <p>
              {/* <img src="/profile.svg" alt={user.email} /> */}
              {user.displayName}
            </p>

            <div className="menu">
              ...
              <ul>
                <li>{user.displayName}</li>

                <li>
                  <a href="#" onClick={handleSignOutClick}>
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div>
          {/* <a href="#" onClick={handleSignInClick}>
            Sign In with Google
          </a> */}
          <div>
            <Button
              label={"Sign In with Google"}
              onClick={handleSignInClick}
              otherStyles="shadow-md"
            />
          </div>
        </div>
      )}
    </MainContainer>
  );
};

export default Login;
