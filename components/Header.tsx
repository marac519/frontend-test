import React, { useState } from 'react'
import Router from "next/router";
import Link from 'next/link'

import { useEffect } from 'react';
import { getAuth, signOut } from "firebase/auth";
import useAppStore from "../store/useStore"



function Header() {

  const auth = getAuth();
  const user = useAppStore((state:any) => state.user)

  const [activeMenu, setactiveMenu] = useState<any>()

  function signOutFromFirebase(){
    Router.push("/login");
    signOut(auth).then(() => {
      console.log("user",user)
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  useEffect(() => {
    console.log("user:",user)
    if(user == null){
      Router.push("/login");
    }
    // console.log(user.email == undefined)

  }, [])

  return (
    <>
    {user == null ? <></> : <>
      <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <a className="navbar-brand">Uploader</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className={Router.pathname == "/" ? "nav-link active-menu-item" : "nav-link"}>
              <Link href="/">
                <a className="nav-link active" aria-current="page">Home</a>
              </Link>
            </li>
            <li className={Router.pathname == "/upload" ? "nav-link active-menu-item" : "nav-link"} >
              <Link href="/upload">
                <a className="nav-link active" aria-current="page">Upload</a>
              </Link>
            </li>
          </ul>
          <p style={{'margin': 0}}>{user.email}</p>
          <img src={user.photoURL ? user.photoURL : "https://picsum.photos/200/300"} style={{'borderRadius': '100px', 'height': '35px', 'width': '35px', 'marginRight': '80px', 'marginLeft': '20px'}}/>
          <button className="btn btn-outline-success" onClick={signOutFromFirebase}>Signout</button>
        </div>
      </div>
    </nav>
    </>}
  </>
  )
}

export default Header