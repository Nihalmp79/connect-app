import { usePosts } from "../context/PostContext"
import CreatePost from "../components/CreatePost"
import PostCard from "../components/PostCard"

const Home = () => {
  const { feedPosts, loading, error } = usePosts()

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Loading feed...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <CreatePost />
        {feedPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Your feed is empty</p>
            <p className="text-gray-300 text-sm mt-1">
              Follow some users to see their posts here
            </p>
          </div>
        ) : (
          feedPosts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}

export default Home