// src/layouts/RootLayout.jsx
import { useState } from 'react';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="flex flex-grow h-full overflow-hidden">
        <main className="flex-grow p-4 overflow-y-auto transition-all duration-300">
          <Outlet context={{ setIsLoggedIn }} />
        </main>
      </div>
    </div>
  );
}

export default RootLayout;
