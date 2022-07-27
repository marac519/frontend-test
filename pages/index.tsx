import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react';


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiidyRDtLrhI6x3W1CUgThRs0oBxhCb0o",
  authDomain: "frontend-test-e15e4.firebaseapp.com",
  projectId: "frontend-test-e15e4",
  storageBucket: "frontend-test-e15e4.appspot.com",
  messagingSenderId: "332949597371",
  appId: "1:332949597371:web:fde838ee8eb9244bc48d9e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const Home: NextPage = () => {

  useEffect(() => {
    console.log(app)
  }, [])
  
  return (
   <h1>Hello</h1>
  )
}

export default Home
