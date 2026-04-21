import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"

const BASE_URL = "http://localhost:5002"

const EditProfile = ({ profile, onClose, onUpdate }) => {
  const { token, user, login } = useAuth()
  const { success, error } = useToast()
  const [form, setForm] = useState({
    bio: profile.bio || "",
    avatar: profile.avatar || ""
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/users/me/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      if (!response.ok) throw new Error("Failed to update")

      const updatedUser = await response.json()
      onUpdate(updatedUser) // update parent component
      success("Profile updated!")
      onClose()
    } catch (err) {
      error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Edit profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-200"
          >
            ✕
          </button>
        </div>

        {/* Avatar preview */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-blue-100 flex items-center justify-center">
            {form.avatar ? (
              <img
                src={form.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
                onError={(e) => e.target.style.display = "none"}
              />
            ) : (
              <span className="text-blue-600 font-bold text-2xl">
                {profile.username[0].toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-1">
              {profile.username}
            </p>
            <p className="text-xs text-gray-400">
              Paste an image URL to update your avatar
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar URL
            </label>
            <input
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              maxLength={150}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Tell people about yourself..."
            />
            <p className="text-xs text-gray-400 text-right mt-1">
              {form.bio.length}/150
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition duration-200 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfile