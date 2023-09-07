import currentProfile from '@/lib/currentProfile'
import { redirect } from 'next/navigation'
import { prisma as db } from '@/lib/db'
import React from 'react'

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
  const textChannels=server
  return <div>ServerSideBar</div>
}

export default ServerSideBar
