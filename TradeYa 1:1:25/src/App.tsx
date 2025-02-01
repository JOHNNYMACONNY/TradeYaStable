import { Routes, Route, Link } from 'react-router-dom';
import { Briefcase, LogOut, Trophy, Menu, X, Shield, Users } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { useAdmin } from './contexts/AdminContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Discover } from './pages/Discover';
import { Profile } from './pages/Profile';
import { CreateTrade } from './pages/CreateTrade';
import { TradeDetails } from './pages/TradeDetails';
import { Messages } from './pages/Messages';
import { Conversation } from './pages/Conversation';
import { Projects } from './pages/Projects';
import { CreateProject } from './pages/CreateProject';
import { ProjectDetails } from './pages/ProjectDetails';
import { UserDirectory } from './pages/UserDirectory';
import { Challenges } from './pages/Challenges';
import { AdminChallenges } from './pages/AdminChallenges';
import { Connections } from './pages/Connections';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-cyber-black text-cyber-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-cyber-gray-900 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold text-red-500 mb-4">Something went wrong</h2>
        <pre className="text-sm bg-cyber-gray-800 p-4 rounded mb-4 overflow-auto">
          {error.message}
        </pre>
        <button
          onClick={resetErrorBoundary}
          className="w-full px-4 py-2 bg-neon-blue text-white rounded-lg hover:bg-neon-purple transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function App() {
  const { user, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out');
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-cyber-black text-cyber-gray-50">
        {/* Dynamic background */}
        <div className="fixed inset-0 bg-mesh opacity-30 animate-mesh"></div>
        <div className="fixed inset-0 bg-noise"></div>

        {/* Header */}
        <header className="sticky top-0 z-50 bg-cyber-gray-900/80 backdrop-blur-lg border-b border-cyber-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <Briefcase className="h-8 w-8 text-neon-blue animate-float" />
                <h1 className="text-2xl font-display font-bold gradient-text">
                  TradeYa
                </h1>
              </Link>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-neon-purple/20"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-neon-blue" />
                ) : (
                  <Menu className="h-6 w-6 text-neon-blue" />
                )}
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                <Link to="/discover" className="nav-link">
                  Discover
                </Link>
                <Link to="/projects" className="nav-link">
                  Projects
                </Link>
                <Link to="/directory" className="nav-link">
                  Directory
                </Link>
                <Link to="/messages" className="nav-link">
                  Messages
                </Link>
                <Link to="/connections" className="nav-link flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Network
                </Link>
                {user && (
                  <Link to="/challenges" className="nav-link flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    Challenges
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin/challenges"
                    className="nav-link flex items-center gap-1"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}
                {user ? (
                  <>
                    <Link to="/profile" className="nav-link">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="nav-link flex items-center"
                    >
                      <LogOut className="h-5 w-5 mr-1" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="nav-link">
                      Login
                    </Link>
                    <Link to="/register" className="nav-link">
                      Register
                    </Link>
                  </>
                )}
              </nav>

              {user && (
                <Link
                  to="/trades/new"
                  className="hidden md:flex btn-primary"
                >
                  Post a Trade
                </Link>
              )}
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <nav className="md:hidden mt-4 py-4 border-t border-cyber-gray-800">
                <div className="flex flex-col space-y-4">
                  <Link 
                    to="/discover" 
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    Discover
                  </Link>
                  <Link 
                    to="/projects" 
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    Projects
                  </Link>
                  <Link 
                    to="/directory" 
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    Directory
                  </Link>
                  <Link 
                    to="/messages" 
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    Messages
                  </Link>
                  <Link 
                    to="/connections" 
                    className="nav-link flex items-center gap-1"
                    onClick={closeMobileMenu}
                  >
                    <Users className="h-4 w-4" />
                    Network
                  </Link>
                  {user && (
                    <Link 
                      to="/challenges" 
                      className="nav-link flex items-center gap-1"
                      onClick={closeMobileMenu}
                    >
                      <Trophy className="h-4 w-4" />
                      Challenges
                    </Link>
                  )}
                  {isAdmin && (
                    <Link 
                      to="/admin/challenges" 
                      className="nav-link flex items-center gap-1"
                      onClick={closeMobileMenu}
                    >
                      <Shield className="h-4 w-4" />
                      Admin
                    </Link>
                  )}
                  {user ? (
                    <>
                      <Link 
                        to="/profile" 
                        className="nav-link"
                        onClick={closeMobileMenu}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMobileMenu();
                        }}
                        className="nav-link flex items-center"
                      >
                        <LogOut className="h-5 w-5 mr-1" />
                        Logout
                      </button>
                      <Link
                        to="/trades/new"
                        className="btn-primary text-center"
                        onClick={closeMobileMenu}
                      >
                        Post a Trade
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className="nav-link"
                        onClick={closeMobileMenu}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        className="nav-link"
                        onClick={closeMobileMenu}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="relative">
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<Discover />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trades/new"
                element={
                  <ProtectedRoute>
                    <CreateTrade />
                  </ProtectedRoute>
                }
              />
              <Route path="/trades/:id" element={<TradeDetails />} />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages/:id"
                element={
                  <ProtectedRoute>
                    <Conversation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/new"
                element={
                  <ProtectedRoute>
                    <CreateProject />
                  </ProtectedRoute>
                }
              />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/directory" element={<UserDirectory />} />
              <Route
                path="/connections"
                element={
                  <ProtectedRoute>
                    <Connections />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/challenges"
                element={
                  <ProtectedRoute>
                    <Challenges />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/challenges"
                element={
                  <AdminRoute>
                    <AdminChallenges />
                  </AdminRoute>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;