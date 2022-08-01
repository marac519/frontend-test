// react
import React from 'react'

// components
import Header from '../components/Header'
import { DropzoneButton } from '../components/Dropzone'
import { motion } from 'framer-motion'

function Upload() {
  return (
    <>
      <Header />
      <motion.div
        className='page-content'
        style={{'height': 'calc(100vh - 56px)'}}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
      >
      <DropzoneButton />
      </motion.div>
    </>
  )
}

export default Upload