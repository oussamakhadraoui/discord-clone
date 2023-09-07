import currentProfile from '@/lib/currentProfile'
import { redirectToSignIn } from '@clerk/nextjs'
import React, { ReactNode } from 'react'
import { prisma as db } from '@/lib/db'
import { redirect } from 'next/navigation'
import ServerSideBar from '@/components/navBar/ServerSideBar'
interface layoutProps {
  children: ReactNode
  params: { serverId: string }
}

const layout = async ({ children, params }: layoutProps) => {
  const profile = await currentProfile()
  if (!profile) {
    return redirectToSignIn()
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: { some: { profileId: profile.id } },
    },
  })
  if(!server){
   return redirect('/')
  }
  return <div className='h-full'>
   <div className='hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0'>
    <ServerSideBar serverId={params.serverId}/>
   </div>
   <main className='h-full md:pl-60'>
    
    {children}
    </main>
   
   </div>
}

export default layout
