import Link from 'next/link';
import LogoDesktop from './logoDesktop';
import { HouseDoor, Person, PlusCircle, Bell, Gear  } from 'react-bootstrap-icons';


export default function Navigation() {
    return (
      <div className='flex md:inline-flex flex-row md:flex-col sticky bottom-0 left-0 md:h-svh md:justify-center'>
        <LogoDesktop />
        <ul className='flex flex-row md:flex-col justify-center w-full gap-10 px-11 py-5 md:py-11 md:px-5 bg-background/70 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none'>
            <li><Link href="/"><HouseDoor size={32}/></Link></li>
            <li><Link href="/mypost"><Person size={32} /></Link></li>
            <li><Link href="/post"><PlusCircle size={32} /></Link></li>
            <li><Link href="/notification"><Bell size={32}/></Link></li>
            <li><Link href="/setting"><Gear size={32} /></Link></li>
        </ul>
      </div>
    );
  }