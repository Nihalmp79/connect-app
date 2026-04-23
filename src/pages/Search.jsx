import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"

const BASE_URL = "http://localhost:5002"

const UserCard = ({ user, token }) => {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const { user: currentUser } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFollow = async (e) => {
    e.stopPropagation()
    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/users/${user.id}/follow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setIsFollowing(data.following)
      success(data.following
        ? `Following ${user.username}`
        : `Unfollowed ${user.username}`
      )
    } catch (err) {
      error("Failed to follow user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={() => navigate(`/profile/${user.username}`)}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition duration-200 mb-3"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
              {user.username[0].toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-100">{user.username}</p>
          {user.bio && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user.bio}</p>
          )}
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            {user._count.followers} followers · {user._count.posts} posts
          </p>
        </div>
      </div>

      <button
        onClick={handleFollow}
        disabled={loading}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 disabled:opacity-50 flex-shrink-0 ${
          isFollowing
            ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  )
}

const Search = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const { token } = useAuth()

  const handleSearch = useCallback(async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)

    try {
      const response = await fetch(
        `${BASE_URL}/users/search/users?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await response.json()
      setResults(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [query, token])

  // search as user types — debounced
  const handleChange = async (e) => {
    const value = e.target.value
    setQuery(value)

    if (!value.trim()) {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    setSearched(true)

    try {
      const response = await fetch(
        `${BASE_URL}/users/search/users?q=${encodeURIComponent(value)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await response.json()
      setResults(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Search users
        </h1>

        {/* Search input */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              value={query}
              onChange={handleChange}
              placeholder="Search by username or bio..."
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition duration-200"
            >
              🔍
            </button>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && searched && (
          <>
            {results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 dark:text-gray-500 text-lg">No users found</p>
                <p className="text-gray-300 dark:text-gray-600 text-sm mt-1">
                  Try a different search term
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  {results.length} user{results.length === 1 ? "" : "s"} found
                </p>
                {results.map(user => (
                  <UserCard key={user.id} user={user} token={token} />
                ))}
              </>
            )}
          </>
        )}

        {/* Empty state — before search */}
        {!loading && !searched && (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-400 dark:text-gray-500 text-lg">Find people to follow</p>
            <p className="text-gray-300 dark:text-gray-600 text-sm mt-1">
              Search by username or bio
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search