import React from 'react'
import { UploadDropzone } from '../utils/uploadthing'
import '@uploadthing/react/styles.css'
import { X } from 'lucide-react'
import Image from 'next/image'
interface FileUploadProps {
  endpoint: 'serverImage' | 'messageFile'
  onChange: (url?: string) => void
  value: string
}

const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value?.split('.').pop()
  if (value && fileType !== 'pdf') {
    return (
      <div className='relative h-20 w-20'>
        <Image fill src={value} alt='upload' className='rounded-full' />
        <button
          className='rounded-full bg-rose-500 text-white absolute top-0 p-1 right-0 shadow-sm'
          type='button'
          onClick={() => onChange('')}
        >
          <X className='w-4 h-4' />
        </button>
      </div>
    )
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(error: Error) => {
        console.log(error)
      }}
    />
  )
}

export default FileUpload
