'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HouseDoor, HouseDoorFill, 
  Person, PersonFill, 
  PlusCircle, PlusCircleFill, 
  Bell, BellFill, 
  Gear, GearFill,
  Google
} from 'react-bootstrap-icons';

import LogoDesktop from './logoDesktop';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: HouseDoor, filledIcon: HouseDoorFill },
    { href: '/mypost', icon: Person, filledIcon: PersonFill },
    { href: '/post', icon: PlusCircle, filledIcon: PlusCircleFill },
    { href: '/notification', icon: Bell, filledIcon: BellFill },
    { href: '/setting', icon: Gear, filledIcon: GearFill },
    //{ href: '/login', icon: Google, filledIcon: Google },
  ];

    return (
    <div className='flex md:inline-flex flex-row md:flex-col sticky bottom-0 left-0 md:h-svh md:justify-center'>
      <LogoDesktop />
      <ul className='flex flex-row md:flex-col justify-center w-full gap-4 md:gap-8 px-11 py-6 md:py-11 md:px-5 bg-background/70 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none'>
        {navItems.map(({ href, icon: Icon, filledIcon: FilledIcon }) => {
          const isActive = pathname === href;
          const IconComponent = isActive ? FilledIcon : Icon;
          return (
            <li className='p-2 rounded-md hover:bg-dark-900/50' key={href}>
              <Link href={href}>
                <IconComponent size={32} />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
  }