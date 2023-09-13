"use client"
import React, { ReactNode, useState } from 'react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
interface QueryProviderProps {
  children:ReactNode
}

const QueryProvider = ({children}: QueryProviderProps) => {
 const [client]= useState(()=>new QueryClient())
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

export default QueryProvider
