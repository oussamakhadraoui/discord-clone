import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import {io as clientIo } from 'socket.io-client'
interface SocketProviderProps {
  children:ReactNode
}

type SocketContextType={
 socket:any | null
 isConnected:boolean
}

const SocketContext = createContext<SocketContextType>({socket:null ,isConnected:false})

export const useSocket= ()=>{
 return useContext(SocketContext)
}

export  const SocketProvider = ({children}: SocketProviderProps) => {
 const [socket,setSocket]= useState(null)

 const [isConnected,setIsConnected]= useState<boolean>(false)
 
   useEffect(() => {
     const socketInstance = new (clientIo as any)(
       process.env.NEXT_PUBLIC_SITE_URL!,
       {
         path: '/api/socket/io',
         addTrailingSlash: false,
       }
     )

     socketInstance.on('connect', () => {
       setIsConnected(true)
     })

     socketInstance.on('disconnect', () => {
       setIsConnected(false)
     })

     setSocket(socketInstance)

     return () => {
       socketInstance.disconnect()
     }
   }, [])
 
 return (
   <SocketContext.Provider value={{ socket, isConnected }}>
     {children}
   </SocketContext.Provider>
 )
}


