import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          ConnectApp
        </Link>
        {token && (
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition duration-200 text-sm">
              Home
            </Link>
            <Link to="/explore" className="text-gray-600 hover:text-blue-600 transition duration-200 text-sm">
              Explore
            </Link>
            <Link
              to={`/profile/${user?.username}`}
              className="text-gray-600 hover:text-blue-600 transition duration-200 text-sm"
            >
              {user?.username}
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar