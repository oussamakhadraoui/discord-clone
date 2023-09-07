import { auth } from '@clerk/nextjs'
import { prisma as db } from '@/lib/db'

import React from 'react'

const currentProfile = async () => {
  const { userId } = auth()
  if (!userId) {
    return null
  }
  return await db.profile.findUnique({ where: { userId } })
}

export default currentProfile
