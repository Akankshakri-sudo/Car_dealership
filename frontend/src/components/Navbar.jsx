import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, LogOut, PlusCircle, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-sky-400">
              AutoApex
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-300 hover:text-white font-medium text-sm px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
                >
                  Inventory Dashboard
                </Link>

                {isAdmin && (
                  <>
                    <Link
                      to="/admin/vehicles"
                      className="text-slate-300 hover:text-white font-medium text-sm px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
                    >
                      Manage Vehicles
                    </Link>
                    <Link
                      to="/admin/vehicles/new"
                      className="inline-flex items-center space-x-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 px-3.5 py-2 rounded-lg shadow-md shadow-sky-600/20 transition-all duration-200"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Add Vehicle</span>
                    </Link>
                  </>
                )}

                {/* User Profile Badge */}
                <div className="flex items-center space-x-3 pl-2 border-l border-slate-700/60">
                  <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/80">
                    <UserIcon className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-semibold text-slate-200">{user?.full_name}</span>
                    {isAdmin ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Admin</span>
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-full">
                        Customer
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Log out"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 px-4 py-2 rounded-lg shadow-lg shadow-sky-500/20 transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
