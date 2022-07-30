import type { NextPage } from 'next'
// import Router from "next/router";
// import Link from 'next/link'
// import Head from 'next/head'
import { useCallback, useEffect, useRef, useState } from 'react';
// import { getAuth, signOut } from "firebase/auth";
// import useAppStore from "../store/useStore"
// import { app } from './_app'
import { collection, query, where, getDocs, DocumentData, orderBy, Timestamp } from "firebase/firestore";
import { db } from './../pages/_app'

import Header from '../components/Header';
import useAppStore from '../store/useAppStore';
import { getAuth } from 'firebase/auth';

import ImageViewer from 'react-simple-image-viewer';
import { IconTrash } from '@tabler/icons';

function Home() {
  const auth = getAuth();
  const user = useAppStore((state:any) => state.user)

  const [images, setimages] = useState<DocumentData[]>([])
  const [isLoading, setisLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const [images_for_imageviewer, setimages_for_imageviewer] = useState([])

  const openImageViewer = useCallback((index:number) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

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
    const filtered: any = []
    images.forEach((value) => filtered.push(value.imageURL))
    //console.log(filtered)
    setimages_for_imageviewer(filtered)
  }, [images])

  function timeConverter(UNIX_timestamp:number){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }
  // console.log(timeConverter(0));
  
  const images_to_render = images.map((image, index) => 
    <div className="card" style={{'maxWidth': '286px', 'margin': '25px'}} key={image.created_at}>
      <img src={image.imageURL} className="card-img-top" alt="..." style={{'maxHeight': "180px", 'maxWidth': '286px', 'minHeight': '180px', 'minWidth': '286px'}}/>
      <div className="card-body">
        <h5 className="card-title">{user.displayName}</h5>
        <p className="card-text">{timeConverter(image.created_at['seconds'])}</p>
        <div>
          <button className="btn btn-success" style={{'background': '#198754 !important'}} onClick={() => openImageViewer(index)}>View the image</button>
          <IconTrash color='red' style={{'marginLeft': '85px'}}/>
        </div>
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
      {isViewerOpen && (
          <ImageViewer
            src={ images_for_imageviewer }
            currentIndex={ currentImage }
            disableScroll={ false }
            closeOnClickOutside={ true }
            onClose={ closeImageViewer }
          />
      )}
    </>
  )
}

export default Home
