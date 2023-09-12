
import { prisma as db } from '@/lib/db'
import { getAuth } from '@clerk/nextjs/server'
import { NextApiRequest } from 'next'

const currentProfilePagesRoute = async (req:NextApiRequest) => {
  const { userId } = getAuth(req)
  if (!userId) {
    return null
  }
  return await db.profile.findUnique({ where: { userId } })
}

export default currentProfilePagesRoute
