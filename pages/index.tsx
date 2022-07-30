import type { NextPage } from 'next'
// import Router from "next/router";
// import Link from 'next/link'
// import Head from 'next/head'
import { useEffect, useRef, useState } from 'react';
// import { getAuth, signOut } from "firebase/auth";
// import useAppStore from "../store/useStore"
// import { app } from './_app'
import { collection, query, where, getDocs, DocumentData, orderBy } from "firebase/firestore";
import { db } from './../pages/_app'

import Header from '../components/Header';
import useAppStore from '../store/useAppStore';
import { getAuth } from 'firebase/auth';


function Home() {
  const auth = getAuth();
  const user = useAppStore((state:any) => state.user)

  const [images, setimages] = useState<DocumentData[]>([])
  const [isLoading, setisLoading] = useState(true)

  async function getUsersImages(){
    const q = query(collection(db,"images"), where("userId", "==", user.uid), orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(q);
    console.log('querySnapshot:',querySnapshot)
    const adat: DocumentData[] = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      adat.push(doc.data())
      //setimages([...images, doc.data()])
      // console.log(doc.id, " => ", doc.data());
    });
    setimages(adat)
  }
  const executedref = useRef(false);
  useEffect( () => {
    if (executedref.current) { return; } 

    if (auth.currentUser != null) {
    setTimeout(async () => {
        await getUsersImages()
        setisLoading(false)
      }, 500);
    }

    executedref.current = true
  }, [])
  
  useEffect(() => {
    console.log(images)
  }, [images])
  
  const images_to_render = images.map((image) => 
    <div className="card" style={{'maxWidth': '286px', 'margin': '25px'}} key={image.created_at}>
      <img src={image.imageURL} className="card-img-top" alt="..." style={{'maxHeight': "180px", 'maxWidth': '286px'}}/>
      <div className="card-body">
        <h5 className="card-title">Created By:{user.displayName}</h5>
        <p className="card-text">Created at: {new Date(parseInt(Object.values(image.created_at)[0])*1000)}</p>
        <a href="#" className="btn btn-primary" style={{'background': '#198754 !important'}}>View the image</a>
      </div>
    </div>
  )

  return (
    <>
      <Header />
      <div className='page-content'>
        {images_to_render}
      </div>
      {isLoading == false && images.length == 0 ? <div className="page-content"><h1 style={{'marginTop': '20%'}}>Nincs Adat!</h1></div>: ""}
      {isLoading ? <div className="page-content" style={{'paddingTop': '20%'}}><div className="loader"></div></div> : ""}
    </>
  )
}

export default Home
