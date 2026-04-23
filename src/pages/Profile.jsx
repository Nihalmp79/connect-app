import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import PostCard from "../components/PostCard"
import EditProfile from "../components/EditProfile"
import { usePosts } from "../context/PostContext"
import { ProfileSkeleton, PostSkeleton } from "../components/Skeleton"

const BASE_URL = "http://localhost:5002"

const Profile = () => {
  const { username } = useParams()
  const { user, token } = useAuth()
  const { success, error } = useToast()
  const { posts } = usePosts()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

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
      success(data.following
        ? `Following ${profile.username}`
        : `Unfollowed ${profile.username}`
      )
    } catch (err) {
      error("Failed to follow user")
    }
  }

  const handleProfileUpdate = (updatedUser) => {
    setProfile(prev => ({ ...prev, ...updatedUser }))
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <ProfileSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 dark:text-gray-500">User not found</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Profile header */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">

              {/* Avatar */}
              <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none"
                      e.target.nextSibling.style.display = "flex"
                    }}
                  />
                ) : null}
                <span
                  className="text-blue-600 dark:text-blue-400 font-bold text-2xl"
                  style={{ display: profile.avatar ? "none" : "flex" }}
                >
                  {profile.username[0].toUpperCase()}
                </span>
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {profile.username}
                </h1>
                {profile.bio && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {profile.bio}
                  </p>
                )}
                {!profile.bio && isOwnProfile && (
                  <p className="text-gray-300 dark:text-gray-600 text-sm mt-1 italic">
                    Add a bio...
                  </p>
                )}
              </div>
            </div>

            {/* Action button */}
            {isOwnProfile ? (
              <button
                onClick={() => setShowEdit(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200"
              >
                Edit profile
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                  isFollowing
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <p className="font-bold text-gray-900 dark:text-gray-100">{profile._count.posts}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 dark:text-gray-100">{profile._count.followers}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 dark:text-gray-100">{profile._count.following}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Following</p>
            </div>
          </div>
        </div>

        {/* Posts */}
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Posts</h2>
        {userPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 dark:text-gray-500 text-lg">No posts yet</p>
            {isOwnProfile && (
              <p className="text-gray-300 dark:text-gray-600 text-sm mt-1">
                Share your first post from the home page
              </p>
            )}
          </div>
        ) : (
          userPosts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {/* Edit profile modal */}
      {showEdit && (
        <EditProfile
          profile={profile}
          onClose={() => setShowEdit(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  )
}

export default Profile