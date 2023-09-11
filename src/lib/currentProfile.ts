import { auth } from '@clerk/nextjs'
import { prisma as db } from '@/lib/db'

const currentProfile = async () => {
  const { userId } = auth()
  if (!userId) {
    return null
  }
  return await db.profile.findUnique({ where: { userId } })
}

export default currentProfile
