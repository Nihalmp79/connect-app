import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { usePosts } from "../context/PostContext"
import { useAuth } from "../context/AuthContext"

const PostCard = ({ post }) => {
  const { toggleLike, deletePost, addComment } = usePosts()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [comment, setComment] = useState("")
  const [showComments, setShowComments] = useState(false)
  const [loading, setLoading] = useState(false)

  const isLiked = post.likes.some(l => l.userId === user?.id)
  const isOwner = post.userId === user?.id

  const handleLike = async (e) => {
    e.stopPropagation()
    await toggleLike(post.id, user?.id)
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    await deletePost(post.id)
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setLoading(true)
    await addComment(post.id, comment)
    setComment("")
    setLoading(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => navigate(`/profile/${post.user.username}`)}
          className="flex items-center gap-2 hover:opacity-80 transition duration-200"
        >
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">
              {post.user.username[0].toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{post.user.username}</p>
            <p className="text-gray-400 text-xs">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </button>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-600 text-xs transition duration-200"
          >
            Delete
          </button>
        )}
      </div>

      {/* Content */}
      <p
        className="text-gray-800 mb-3 cursor-pointer"
        onClick={() => navigate(`/posts/${post.id}`)}
      >
        {post.content}
      </p>

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="w-full rounded-lg mb-3 max-h-80 object-cover cursor-pointer"
          onClick={() => navigate(`/posts/${post.id}`)}
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-sm transition duration-200 ${
            isLiked ? "text-red-500" : "text-gray-500 hover:text-red-400"
          }`}
        >
          {isLiked ? "❤️" : "🤍"} {post._count.likes}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition duration-200"
        >
          💬 {post._count.comments}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <form onSubmit={handleComment} className="flex gap-2 mb-3">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              Post
            </button>
          </form>
          {post.comments.map(c => (
            <div key={c.id} className="flex gap-2 mb-2">
              <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-bold text-xs">
                  {c.user.username[0].toUpperCase()}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 flex-1">
                <p className="font-medium text-xs text-gray-900">{c.user.username}</p>
                <p className="text-sm text-gray-700">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PostCard