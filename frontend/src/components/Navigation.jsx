import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon, FilmIcon } from "@heroicons/react/24/outline";

const Navigation = ({ account, userBalance }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', current: location.pathname === '/' },
    { name: 'Proposals', href: '/proposals', current: location.pathname === '/proposals' },
    { name: 'Submit Idea', href: '/submit-idea', current: location.pathname === '/submit-idea' },
    { name: 'Fund DAO', href: '/fund-dao', current: location.pathname === '/fund-dao' },
  ];

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FilmIcon className="h-8 w-8 text-purple-400" />
              <span className="text-white text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CinemaDAO
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  item.current
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-300 hover:text-white hover:bg-purple-600/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Account Info */}
          <div className="hidden md:flex items-center space-x-4">
            {account && (
              <div className="text-right">
                <div className="text-sm text-gray-300">
                  {parseFloat(userBalance).toFixed(2)} MOTN
                </div>
                <div className="text-xs text-purple-400">
                  {shortenAddress(account)}
                </div>
              </div>
            )}
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {account ? account[2].toUpperCase() : '?'}
              </span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black/40 backdrop-blur-md border-t border-purple-500/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  item.current
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-purple-600/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {account && (
              <div className="px-3 py-2 border-t border-purple-500/20 mt-2">
                <div className="text-sm text-gray-300">
                  Balance: {parseFloat(userBalance).toFixed(2)} MOTN
                </div>
                <div className="text-xs text-purple-400">
                  {shortenAddress(account)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;