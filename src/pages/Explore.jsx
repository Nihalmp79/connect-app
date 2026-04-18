import { usePosts } from "../context/PostContext"
import { useState, useMemo } from "react"
import PostCard from "../components/PostCard"

const Explore = () => {
  const { posts, loading, error } = usePosts()
  const [search, setSearch] = useState("")

  const filtered = useMemo(() =>
    posts.filter(p =>
      p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.user.username.toLowerCase().includes(search.toLowerCase())
    )
  , [posts, search])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Loading posts...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Explore</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts or users..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No posts found</p>
        ) : (
          filtered.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}

export default Explore