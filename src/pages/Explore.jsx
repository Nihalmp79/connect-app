import { usePosts } from "../context/PostContext"
import { useState, useMemo } from "react"
import PostCard from "../components/PostCard"
import { FeedSkeleton } from "../components/Skeleton"

const Explore = () => {
  const { posts, loading, error, hasMorePosts, loadMorePosts, loadingMore } = usePosts()
  const [search, setSearch] = useState("")

  const filtered = useMemo(() =>
    posts.filter(p =>
      p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.user.username.toLowerCase().includes(search.toLowerCase())
    )
  , [posts, search])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Explore</h1>
        <FeedSkeleton count={4} />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Explore</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts or users..."
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        {filtered.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-center py-12">
            No posts found
          </p>
        ) : (
          <>
            {filtered.map(post => <PostCard key={post.id} post={post} />)}

            {/* Load more — only show when not searching */}
            {!search && hasMorePosts && (
              <div className="text-center py-4">
                <button
                  onClick={loadMorePosts}
                  disabled={loadingMore}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-6 py-2 rounded-lg hover:shadow-md transition duration-200 disabled:opacity-50 text-sm font-medium"
                >
                  {loadingMore ? "Loading..." : "Load more"}
                </button>
              </div>
            )}

            {!search && !hasMorePosts && posts.length > 0 && (
              <p className="text-center text-gray-300 dark:text-gray-600 text-sm py-4">
                You've seen all posts
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Explore