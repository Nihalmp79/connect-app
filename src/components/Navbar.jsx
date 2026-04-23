import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

const Navbar = () => {
  const { token, user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          ConnectApp
        </Link>
        <div className="flex items-center gap-4">
          {token && (
            <>
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition duration-200 text-sm">
                Home
              </Link>
              <Link to="/explore" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition duration-200 text-sm">
                Explore
              </Link>
              <Link to="/search" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition duration-200 text-sm">
                Search
              </Link>
              <Link
                to={`/profile/${user?.username}`}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition duration-200 text-sm"
              >
                {user?.username}
              </Link>
            </>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-200"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {token && (
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg transition duration-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar