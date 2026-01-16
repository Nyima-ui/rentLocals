"use client";
import { useState } from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

const Page = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  return isSignIn ? <SignIn toggleSignUp={setIsSignIn} /> : <SignUp toggleSignIn={setIsSignIn}/>;
};

export default Page;
