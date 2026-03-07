import React from "react";

function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg lg:hidden">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-blue-600">Menu</h1>
        </div>
        <div className="hidden lg:flex items-center gap-6">
          <a href="#" className="font-medium text-gray-700 hover:text-blue-600">
            Home
          </a>
          <a href="#" className="font-medium text-gray-700 hover:text-blue-600">
            Services
          </a>
          <a href="#" className="font-medium text-gray-700 hover:text-blue-600">
            About
          </a>
        </div>
        <div className="text-sm font-medium text-gray-500">
          Tap for more info.
        </div>
      </nav>
    </header>
  );
}

export default Header;
