import React from 'react'
import Header from '../components/Header'
import { DropzoneButton } from '../components/Dropzone'

function Upload() {
  return (
    <>
      <Header />
      <div className='page-content'>
      <DropzoneButton />
      </div>
    </>
  )
}

export default Upload