'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  UserPlus,
  DollarSign,
  Presentation,
  Headset,
  PhoneCall,
  Building,
  Package,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  onCollapseChange: (isCollapsed: boolean) => void;
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

const navItems: NavItem[] = [
  {
    title: 'Home',
    path: '/home',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  // {
  //   title: 'Clients',
  //   path: '/clients',
  //   icon: <Users className="w-5 h-5" />,
  // },
  // {
  //   title: 'Leads',
  //   path: '/leads',
  //   icon: <UserPlus className="w-5 h-5" />,
  // },
  // {
  //   title: 'Revenue',
  //   path: '/revenue',
  //   icon: <DollarSign className="w-5 h-5" />,
  // },
  {
    title: 'Companies',
    path: '/companies',
    icon: <Building className="w-5 h-5" />,
  },
  {
    title: 'Demos',
    path: '/demos',
    icon: <Presentation className="w-5 h-5" />,
  },
  {
    title: 'Contact-Support',
    path: '/support',
    icon: <Headset className="w-5 h-5" />,
  },
  {
    title: 'Contacts',
    path: '/contacts',
    icon: <PhoneCall className="w-5 h-5" />,
  },
  {
    title: 'Modules',
    path: '/modules',
    icon: <Package className="w-5 h-5" />,
  },
];


export default function Sidebar({ 
  onCollapseChange, 
  isMobileMenuOpen = false,
  onMobileMenuClose 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const logoutUser = useAuthStore((state) => state.logoutUser);

  const handleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapseChange(newState);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    onMobileMenuClose?.();
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full transition-all duration-300 ease-in-out transform bg-white border-r border-gray-200 ${
        isCollapsed ? 'lg:w-20' : 'lg:w-64'
      } ${isMobileMenuOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0'}`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="sticky top-0 z-20 p-6 flex items-center justify-between bg-white border-b border-gray-200">
          <h1 className={`text-xl font-bold text-gray-900 ${
            isCollapsed ? 'lg:hidden' : ''
          }`}>
            SuperAdmin
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={onMobileMenuClose}
              className="p-2 rounded-lg bg-white/80 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm lg:hidden"
              aria-label="Close mobile menu"
            >
              <ChevronLeft className="w-5 h-5 text-blue-600" />
            </button>
            <button
              onClick={handleCollapse}
              className="hidden lg:block p-2 rounded-lg bg-white/80 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-blue-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-blue-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
          {navItems.map((item) => (
            <TooltipProvider key={item.path} delayDuration={0}>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.path}
                      className={`flex items-center p-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                        pathname === item.path
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                    >
                      <div className={`${
                        pathname === item.path 
                          ? 'text-blue-600' 
                          : 'text-gray-500 group-hover:text-blue-600'
                      } transition-all duration-200`}>
                        {item.icon}
                      </div>
                      {pathname === item.path && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                    pathname === item.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <div className={`${
                    pathname === item.path 
                      ? 'text-blue-600' 
                      : 'text-gray-500 group-hover:text-blue-600'
                  } transition-all duration-200`}>
                    {item.icon}
                  </div>
                  <span className="ml-3 font-medium">{item.title}</span>
                  {pathname === item.path && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                  )}
                </Link>
              )}
            </TooltipProvider>
          ))}
        </nav>

        {/* Footer */}
        <div className="sticky bottom-0 mt-auto p-4 border-t bg-white">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className={`flex items-center w-full p-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white border-none shadow-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-gray-800">Are you sure you want to logout?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  This will end your current session and you'll need to login again to access the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </aside>
  );
}