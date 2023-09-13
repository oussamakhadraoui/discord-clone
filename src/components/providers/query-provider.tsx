"use client"
import React, { ReactNode, useState } from 'react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
interface QueryProviderProps {
  children:ReactNode
}

const QueryProvider = ({children}: QueryProviderProps) => {
 const [clientQuery]= useState(()=>new QueryClient())
  return (
    <QueryClientProvider client={clientQuery}>{children}</QueryClientProvider>
  )
}

export default QueryProvider
