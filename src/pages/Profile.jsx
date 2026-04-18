import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import PostCard from "../components/PostCard"
import { usePosts } from "../context/PostContext"

const BASE_URL = "http://localhost:5002"

const Profile = () => {
  const { username } = useParams()
  const { user, token } = useAuth()
  const { posts } = usePosts()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)

  const userPosts = posts.filter(p => p.user.username === username)
  const isOwnProfile = user?.username === username

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        setProfile(data)

        // check if current user follows this profile
        const followRes = await fetch(`${BASE_URL}/users/${data.id}/followers`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const followers = await followRes.json()
        setIsFollowing(followers.some(f => f.id === user?.id))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [username])

  const handleFollow = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/${profile.id}/follow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setIsFollowing(data.following)
      setProfile(prev => ({
        ...prev,
        _count: {
          ...prev._count,
          followers: data.following
            ? prev._count.followers + 1
            : prev._count.followers - 1
        }
      }))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Loading profile...</p>
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">User not found</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Profile header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-2xl">
                  {profile.username[0].toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{profile.username}</h1>
                {profile.bio && <p className="text-gray-500 text-sm mt-1">{profile.bio}</p>}
              </div>
            </div>
            {!isOwnProfile && (
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                  isFollowing
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="font-bold text-gray-900">{profile._count.posts}</p>
              <p className="text-gray-500 text-sm">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900">{profile._count.followers}</p>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900">{profile._count.following}</p>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
          </div>
        </div>

        {/* Posts */}
        <h2 className="text-lg font-bold text-gray-900 mb-3">Posts</h2>
        {userPosts.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No posts yet</p>
        ) : (
          userPosts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}

export default Profile