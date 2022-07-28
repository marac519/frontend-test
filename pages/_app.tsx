import '../styles/globals.css'
import type { AppProps } from 'next/app'

// add bootstrap css 
import 'bootstrap/dist/css/bootstrap.css'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useAppStore from '../store/useAppStore';
import Head from 'next/head';
import Script from 'next/script';
import { getFirestore } from 'firebase/firestore';
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
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

function MyApp({ Component, pageProps }: AppProps) {

  const auth = getAuth();
  const setuser = useAppStore((state:any) => state.setuser)
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setuser(user)
      const uid = user.uid;
    } else {
      setuser(null)
    }
  });

  useEffect(() => {
    console.log(app)
  }, [])
  
  return <>
    <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
    crossOrigin="anonymous" 
    />
    </Head>
      
    <Script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
    crossOrigin="anonymous"/>
    <Component {...pageProps} />
    </>
}

export default MyApp
