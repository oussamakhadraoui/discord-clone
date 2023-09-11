import currentProfile from '@/lib/currentProfile'
import { redirectToSignIn } from '@clerk/nextjs'
import React from 'react'
import { prisma as db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface ServerIdPageProps {
  params: { serverId: string }
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile()
  if (!profile) {
    return redirectToSignIn()
  }
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: { some: { profileId: profile.id } },
    },
    include: {
      channels: { where: { name: 'general' }, orderBy: { createdAt: 'asc' } },
    },
  })

  const generalChannel = server?.channels[0]

  if (generalChannel?.name !== 'general') {
    return null
  }
  return redirect(`/servers/${params.serverId}/channels/${generalChannel.id}`)

}

export default ServerIdPage
