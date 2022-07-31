import type { NextPage } from 'next'
// import Router from "next/router";
// import Link from 'next/link'
// import Head from 'next/head'
import { useCallback, useEffect, useRef, useState } from 'react';
// import { getAuth, signOut } from "firebase/auth";
// import useAppStore from "../store/useStore"
// import { app } from './_app'
import { doc, collection, query, where, getDocs, DocumentData, orderBy, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from './../pages/_app'

import Header from '../components/Header';
import useAppStore from '../store/useAppStore';
import { getAuth } from 'firebase/auth';

import { Modal, Button, Group } from '@mantine/core';
import ImageViewer from 'react-simple-image-viewer';
import { IconCircleCheck, IconTrash } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';

import { motion } from "framer-motion"

function Home() {
  const user = useAppStore((state:any) => state.user)
  const auth = getAuth();

  const [images, setimages] = useState<DocumentData[]>([])
  const [isLoading, setisLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const [images_for_imageviewer, setimages_for_imageviewer] = useState([])

  const [opened, setOpened] = useState(false);

  const openImageViewer = useCallback((index:number) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  async function getUsersImages(){
    console.log("getUsersImages lefutott")
    const q = query(collection(db,"images"), where("userId", "==", user.uid), orderBy("created_at", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let query_data: DocumentData[] = []
      querySnapshot.forEach((doc) => {
        const doc_object = doc.data()
        doc_object['id'] = doc.id
        query_data.push(doc_object)
        //setimages([...images, doc.data()])
        console.log(doc.id, " => ", doc);
      });
      setimages(query_data)
    });
    return unsubscribe
    
    // const querySnapshot = await getDocs(q);
    // console.log('querySnapshot:',querySnapshot)
    // let query_data: DocumentData[] = []
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   const doc_object = doc.data()
    //   doc_object['id'] = doc.id
    //   query_data.push(doc_object)
    //   //setimages([...images, doc.data()])
    //   console.log(doc.id, " => ", doc);
    // });
    // setimages(query_data)
  }

  async function deleteUsersImage() {
    const documentId: String = localStorage.getItem('imageId')!
    await deleteDoc(doc(db, "images", `${documentId}`));
    localStorage.removeItem('imageId')
    setOpened(false)
    setTimeout(() => {
      showNotification({
        title: 'Image successfully deleted 🗑️',
        message: '',
        icon: <IconCircleCheck/>,
        autoClose: 5000,
        style: {'background': 'white'},
        styles: (theme) => ({
          root: {
            backgroundColor: 'white',
            borderColor: '#198754',
            '&::before': { backgroundColor: 'white' },
          },
          title: { color: theme.black },
          description: { color: theme.black },
          closeButton: {
            color: theme.black,
            '&:hover': { backgroundColor: '#198754 !important' },
          },
        })
      })
    }, 300);
  }

  //const executedref = useRef(false);
  useEffect( () => {
    //if (executedref.current) { return; } 
    if (user != null) {
      console.log("useffect runs")
    getUsersImages()
    setisLoading(false)
    setTimeout(() => {
      }, 500);
    }

    //executedref.current = true
  }, [])
  
  useEffect(() => {
    console.log(images)
    const filtered: any = []
    images.forEach((value) => filtered.push(value.imageURL))
    console.log('filtered',filtered)
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
    <motion.div className="card" style={{'maxWidth': '286px', 'margin': '25px'}} key={image.created_at} layout>
      <img src={image.imageURL} className="card-img-top" alt="..." style={{'maxHeight': "180px", 'maxWidth': '286px', 'minHeight': '180px', 'minWidth': '286px'}}/>
      <div className="card-body">
        {user ? (
          <h5 className="card-title">{user.displayName ? user.displayName : user.email}</h5>
        ) : ""}
        <p className="card-text">{timeConverter(image.created_at['seconds'])}</p>
        <div>
          <button className="btn btn-success" style={{'background': '#198754 !important'}} onClick={() => openImageViewer(index)}>View the image</button>
          <IconTrash color='red' style={{'marginLeft': '85px'}} onClick={() => {
            localStorage.setItem('imageId',image.id);
            setOpened(true);
          }}/>
        </div>
      </div>
    </motion.div>
  )

  return (
    <>
      <Header />
      <motion.div
        className='page-content'
        initial={{opacity: 0}}
        animate={{opacity: 1}}
      >
        {user ? images_to_render : ""}
      </motion.div>
      {isLoading == false && images.length == 0 ? <div className="page-content"><h1 style={{'marginTop': '15%'}}>No data!</h1></div>: ""}
      {isLoading ? <div className="page-content" style={{'paddingTop': '20%'}}><div className="loader"></div></div> : ""}
      {isViewerOpen && (
          <div>
            <ImageViewer
              src={ images_for_imageviewer }
              currentIndex={ currentImage }
              disableScroll={ false }
              closeOnClickOutside={ true }
              onClose={ closeImageViewer }
            />
          </div>
      )}
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title="Do you want to delete this image?"
      >
        <div style={{'display': 'flex', 'gap': '30px'}}>
          <button type="button" className="btn btn-outline-danger button" onClick={() => setOpened(false)}>No</button>
          <button type="button" className="btn btn-outline-success button" onClick={deleteUsersImage}>Yes</button>
        </div>
      </Modal>
    </>
  )
}

export default Home
