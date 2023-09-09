'use client'
import React, { useEffect, useState } from 'react'
import { CreateServerModal } from '../modals/CreateServerModal'
import { InviteModal } from '../modals/InviteModal'
import { EditServerModal } from '../modals/EditServerModal'
import { MembersModal } from '../modals/MembersModal'
import { CreateChannelModal } from '../modals/CreateChannelModal'

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
      <EditServerModal/>
      <MembersModal/>
      <CreateChannelModal/>
    </>
  )
}

export default ModalProvider
