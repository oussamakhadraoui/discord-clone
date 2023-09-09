'use client'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModal } from '../../hooks/use-modal-store'
import { Button } from '../ui/button'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
interface DeleteServerModalProps {}

const DeleteServerModal = ({}: DeleteServerModalProps) => {
  const {isOpen, onClose, type, data } = useModal()
  const route = useRouter()
  const isModalOpen = isOpen && type === 'deleteServer'
  const { server } = data

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const handleLeave = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/servers/${server?.id}/delete`)
      onClose()
      route.refresh()
      route.push('/')
    } catch (error) {
      console.log('delete server client side', error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Delete server
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure you want to delete
            <span className='font-semibold text-indigo-500'>
              {server?.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 px-6 py-4'>
          <div className='flex items-center justify-between w-full'>
            <Button disabled={isLoading} onClick={onClose} variant='ghost'>
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant='primary'
              onClick={handleLeave}
            >
              confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default DeleteServerModal
