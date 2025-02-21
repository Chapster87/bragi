import { useEffect, useState } from 'react';

import Image from 'next/image'
import { Bell, Menu, X } from 'lucide-react';
import spotifyLogo from '@/assets/images/spotify.svg';

import Spotify from '@/services/spotify'

export default function Header() {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const spotify = new Spotify();
    spotify.fetchProfile()
      .then(response => {
        setUser(response);
      });
    
  }, []);

  const { display_name, email, href, images  } = user || { display_name: '', href: '', images: [] };

  return (
    <>
      <nav className="header bg-slate-900 relative">
        <div className="mx-auto container px-3 sm:px-4">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <button type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset cursor-pointer"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => setMobileMenuActive(!mobileMenuActive)}
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>
                  {/* Icon when menu is closed. */}
                  <Menu className={`${mobileMenuActive ? 'hidden' : 'block'}`}/>

                  {/* Icon when menu is open. */}
                  <X className={`${mobileMenuActive ? 'block' : 'hidden'}`}/>
              </button>
            </div>
            <div className="header-left flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <Image className="h-8 w-auto" src={spotifyLogo} alt="Your Company" width={32}  height={32} />
              </div>
              <div className="header-nav hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <a href="#" className="nav-link current rounded-md px-3 py-2 text-sm font-medium" aria-current="page">Dashboard</a>
                </div>
              </div>
            </div>
            <div className="header-right absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button type="button" className="relative rounded-full bg-slate-900 p-1 text-slate-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-hidden">
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">View notifications</span>
                <Bell />
              </button>

              {/* Profile dropdown */}
              <div className="relative ml-3">
                <div>
                  <button type="button"
                    className="relative flex rounded-full bg-slate-900 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-hidden cursor-pointer"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => setUserMenuActive(!userMenuActive)}
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    {(images && images.length > 0) && <Image className="rounded-full" src={images[0].url} alt={display_name} width={32}  height={32} />}
                  </button>
                </div>
                <div className={`user-menu absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden${userMenuActive ? ' block' : ' hidden'}`} role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
                  <div className='flex flex-col'>
                    <span className="block px-4 py-2 text-sm text-slate-700" role="menuitem">Logged in as: {display_name}</span>
                    <span className="block px-4 py-2 text-sm text-slate-700" role="menuitem">Email: {email}</span>
                    <a href={href} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem" target='_blank'>Your Profile</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        <div className={`header-nav bg-slate-900 absolute top-full w-full height-full ${mobileMenuActive ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {/* Current: "bg-slate-900 text-white", Default: "text-slate-300 hover:bg-slate-700 hover:text-white" */}
            <a href="#" className="nav-link current block rounded-md px-3 py-2 text-base font-medium" aria-current="page">Dashboard</a>
          </div>
        </div>
      </nav>
    </>
  );
}