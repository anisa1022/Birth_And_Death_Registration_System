import { useState } from 'react';
import { 
  Search,
  Globe,
  ChevronDown,
  LayoutDashboard,
  ClipboardList,
  Bell,
  Settings,
  UserCircleIcon
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function DashboardLayout({ children }) {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const location = useLocation();
  const { user } = useUser(); // Access user data from context

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-purple-600" />
            <span className="font-bold text-xl">
              <span className="text-gray-900">Free</span>
              <span className="text-purple-600">Dash</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              isActive('/dashboard') ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <div className="space-y-1">
            <button
              onClick={() => setIsRegistrationOpen(!isRegistrationOpen)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full ${
                ['/address', '/birth', '/death'].includes(location.pathname)
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ClipboardList className="h-5 w-5" />
              <span className="font-medium flex-1 text-left">Registration</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isRegistrationOpen ? 'rotate-180' : ''}`} />
            </button>

            {isRegistrationOpen && (
              <div className="pl-11 space-y-1">
                <Link
                  to="/address"
                  className={`block px-3 py-2 rounded-lg ${
                    isActive('/address') ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  District
                </Link>
                <Link
                  to="/birth"
                  className={`block px-3 py-2 rounded-lg ${
                    isActive('/birth') ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Birth
                </Link>
                <Link
                  to="/death"
                  className={`block px-3 py-2 rounded-lg ${
                    isActive('/death') ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Death
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Globe className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2 pl-4 border-l">
              {/* User Icon */}
              <UserCircleIcon className="h-8 w-8 text-gray-600" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Hello,</span>
                <span className="font-medium text-purple-500">{user?.userName || 'Guest'}</span> {/* Display user name */}
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
