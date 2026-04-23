import { useState } from "react"
import { usePosts } from "../context/PostContext"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"

const MAX_CHARS = 280

const CreatePost = () => {
  const [content, setContent] = useState("")
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)
  const { createPost } = usePosts()
  const { user } = useAuth()
  const { success, error } = useToast()

  const remaining = MAX_CHARS - content.length
  const isOverLimit = remaining < 0
  const isNearLimit = remaining <= 20 && remaining >= 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() || isOverLimit) return
    setLoading(true)
    const result = await createPost(content, image || null)
    setLoading(false)
    if (result.success) {
      setContent("")
      setImage("")
      success("Post created!")
    } else {
      error("Failed to create post")
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
            {user?.username?.[0]?.toUpperCase()}
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none dark:bg-gray-700 dark:text-gray-100 transition duration-200 ${
              isOverLimit
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-200 dark:border-gray-600 focus:ring-blue-500"
            }`}
          />

          {/* Character count bar */}
          <div className="flex items-center justify-between mt-1 mb-2">
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-1 mr-3">
              <div
                className={`h-1 rounded-full transition-all duration-200 ${
                  isOverLimit
                    ? "bg-red-500"
                    : isNearLimit
                    ? "bg-yellow-400"
                    : "bg-blue-500"
                }`}
                style={{
                  width: `${Math.min((content.length / MAX_CHARS) * 100, 100)}%`
                }}
              />
            </div>
            <span className={`text-xs font-medium tabular-nums ${
              isOverLimit
                ? "text-red-500"
                : isNearLimit
                ? "text-yellow-500"
                : "text-gray-400 dark:text-gray-500"
            }`}>
              {remaining}
            </span>
          </div>

          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL (optional)"
            className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
          />

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={loading || !content.trim() || isOverLimit}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost