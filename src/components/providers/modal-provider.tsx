'use client'
import React, { useEffect, useState } from 'react'
import { CreateServerModal } from '../CreateServerModal'

interface ModalProviderProps {
  
}

const ModalProvider = ({}: ModalProviderProps) => {

 const[isMounted ,setIsMounted]= useState<boolean>(false)
 useEffect(()=>{
  setIsMounted(true)
 },[])

 if(!isMounted){
  return null
 }
 return <><CreateServerModal/></>
}

export default ModalProvider
