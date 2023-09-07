import { ModeToggle } from '@/components/Toggle-theme'
import { initialUser } from '@/lib/initialProfile'
import { UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma as db } from '@/lib/db'
import { InitialModal } from '@/components/InitialModal'

export default async function Home() {
  const profile = await initialUser()
  const server = await db.server.findFirst({
    where: { members: { some: { profileId: profile.id } } },
  })
  if (server) {
    return redirect(`/servers/${server.id}`)
  }
  return <InitialModal />
}
{
  /* <UserButton afterSignOutUrl='/' />
      <ModeToggle/> */
}
