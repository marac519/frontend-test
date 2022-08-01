// react, next
import React, { useState, useEffect } from 'react'
import Router from "next/router";
import Link from 'next/link'

// firebase
import { getAuth, signOut } from "firebase/auth";

// utils
import useAppStore from "../store/useAppStore"
import { cleanNotifications } from '@mantine/notifications';


function Header() {

  const auth = getAuth();
  const user = useAppStore((state:any) => state.user)
  const setuser = useAppStore((state:any) => state.setuser)

  function signOutFromFirebase(){
    cleanNotifications()
    Router.push("/login");
    signOut(auth).then(() => {
      console.log("user who signed out:",user)
      localStorage.removeItem('user')
      setuser(null)
      // Sign-out successful.
    }).catch((error) => {
      console.log(error)
      // An error happened.
    });
  }

  useEffect(() => {
    if(user == null){
      Router.push("/login");
    }
  }, [])

  return (
    <>
    {user == null ? <></> : <>
      <nav className="navbar navbar-expand-lg bg-light" style={{'position': 'fixed', 'top': 0, 'left': 0, 'right': 0, 'zIndex': 100}}>
      <div className="container-fluid">
          <Link href="/">
          <a className="navbar-brand" style={{'marginLeft': "12px"}}>Uploader</a>
          </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-menu">
            <li style={{'marginRight': "20px", 'marginLeft': "12px"}}>
              <Link href="/">
                <a className={Router.pathname == "/" ? "btn-success nav-link active-menu-item menu-item" : "nav-link menu-item"} aria-current="page">Home</a>
              </Link>
            </li>
            <li  >
              <Link href="/upload">
                <a className={Router.pathname == "/upload" ? "btn-success nav-link active-menu-item menu-item" : "nav-link menu-item"} aria-current="page">Upload</a>
              </Link>
            </li>
          </ul>
          <div className='profile-area'>
            <p style={{'margin': 0}}>{user.email}</p>
            <img src={user.photoURL ? user.photoURL : "https://picsum.photos/200/300"} style={{'borderRadius': '100px', 'height': '35px', 'width': '35px', 'marginRight': '80px', 'marginLeft': '20px'}}/>
            <button className="btn btn-outline-success" onClick={signOutFromFirebase}>Signout</button>
          </div>
        </div>
      </div>
    </nav>
    </>}
  </>
  )
}

export default Header