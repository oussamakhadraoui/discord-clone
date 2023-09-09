'use client'
import React, { useEffect, useState } from 'react'
import { CreateServerModal } from '../modals/CreateServerModal'
import { InviteModal } from '../modals/InviteModal'
import { EditServerModal } from '../modals/EditServerModal'
import { MembersModal } from '../modals/MembersModal'
import { CreateChannelModal } from '../modals/CreateChannelModal'
import LeaveServerModal from '../modals/LeaveServerModal'
import DeleteServerModal from '../modals/DeleteServerModal'

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
      <LeaveServerModal/>
      <DeleteServerModal/>
    </>
  )
}

export default ModalProvider
