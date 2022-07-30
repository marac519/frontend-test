import React from 'react'
import Header from '../components/Header'
import { DropzoneButton } from '../components/Dropzone'

function Upload() {
  return (
    <>
      <Header />
      <div className='page-content' style={{'height': 'calc(100vh - 56px)'}}>
      <DropzoneButton />
      </div>
    </>
  )
}

export default Upload