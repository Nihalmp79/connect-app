import { useParams, useNavigate } from "react-router-dom"
import { usePosts } from "../context/PostContext"
import PostCard from "../components/PostCard"

const PostDetail = () => {
  const { id } = useParams()
  const { posts } = usePosts()
  const navigate = useNavigate()

  const post = posts.find(p => p.id === parseInt(id))

  if (!post) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Post not found</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700 mb-4 transition duration-200"
        >
          Back
        </button>
        <PostCard post={post} />
      </div>
    </div>
  )
}

export default PostDetail