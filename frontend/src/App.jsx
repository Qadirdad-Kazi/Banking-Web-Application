import React, { useState } from 'react';
import AdminPanel from './components/AdminPanel';
import UserDashboard from './components/UserDashboard';

function App() {
  const [view, setView] = useState('landing'); // landing, admin, user

  const renderView = () => {
    switch (view) {
      case 'admin':
        return <AdminPanel onBack={() => setView('landing')} />;
      case 'user':
        return <UserDashboard onBack={() => setView('landing')} />;
      default:
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="text-center mb-12 animate-fade-in-up">
              <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
                AccountSys
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Secure, Formal, and Reliable Banking implementation.
                <br />
                <span className="text-sm text-gray-400">Powered by Spring Boot & React</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
              <div
                onClick={() => setView('admin')}
                className="group cursor-pointer bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
                  🛡️
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Panel</h2>
                <p className="text-gray-500">Manage accounts, monitor system balance, and auditing.</p>
              </div>

              <div
                onClick={() => setView('user')}
                className="group cursor-pointer bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
                  👤
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">User Access</h2>
                <p className="text-gray-500">Access your account, check balance, and perform transactions.</p>
              </div>
            </div>

            <footer className="mt-16 text-gray-400 text-sm">
              FMSE Project Assignment &bull; 2026
            </footer>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {view !== 'landing' && (
        <nav className="bg-white shadow py-4 px-8 mb-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="font-bold text-xl text-indigo-600 cursor-pointer" onClick={() => setView('landing')}>AccountSys</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{view} mode</div>
          </div>
        </nav>
      )}

      <main className={view === 'landing' ? '' : 'max-w-7xl mx-auto px-8 pb-12'}>
        {renderView()}
      </main>
    </div>
  );
}

export default App;
