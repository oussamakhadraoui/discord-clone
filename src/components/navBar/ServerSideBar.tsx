import currentProfile from '@/lib/currentProfile'
import { redirect } from 'next/navigation'
import { prisma as db } from '@/lib/db'
import React from 'react'
import { ChannelType } from '@prisma/client'
import ServerHeader from './ServerHeader'

interface ServerSideBarProps {
  serverId: string
}

const ServerSideBar = async ({ serverId }: ServerSideBarProps) => {
  const profile = await currentProfile()
  if (!profile) {
    return redirect('/')
  }
  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      channels: { orderBy: { createdAt: 'asc' } },
      members: { include: { profile: true }, orderBy: { role: 'asc' } },
    },
  })
  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  )
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  )
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  )

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  )
  //remove ourself

  if (!server){
   return redirect('/')
  } 
  const role = server.members.find((member)=>member.profileId===profile.id)?.role
  
  return <div className='flex flex-col h-full text-primary w-full dark:bg-[#2b2D31] bg-[#f2F3F5]' >
   <ServerHeader role={role} server={server}/>
  </div>
}

export default ServerSideBar
