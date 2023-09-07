'use client'
import React, { useEffect, useState } from 'react'
import { CreateServerModal } from '../modals/CreateServerModal'
import { InviteModal } from '../modals/InviteModal'

interface ModalProviderProps {}

const ModalProvider = ({}: ModalProviderProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }
  return (
    <>
      <CreateServerModal />
      <InviteModal />
    </>
  )
}

export default ModalProvider
