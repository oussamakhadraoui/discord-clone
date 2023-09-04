import React, { ReactNode } from 'react'

interface layoutProps {
  children:ReactNode
}

const layout = ({children}: layoutProps) => {
  return <div className='flex items-center justify-center h-full'>{children}</div>
}

export default layout
