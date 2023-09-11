import React from 'react'
import { Ghost, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '../ui/button'
import { NavigationSidebar } from '../navBar/NavigationSideBar'
import ServerSideBar from '../server/ServerSideBar'
interface MobileToggleProps {
  serverId:string
}

const MobileToggle = ({serverId}: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='md:hidden'>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='p-0 flex gap-0 '>
        <div className='w-[72px]'>
          <NavigationSidebar />
        </div>
        <ServerSideBar serverId={serverId}/>
      </SheetContent>
    </Sheet>
  )
}

export default MobileToggle
