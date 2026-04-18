import { createContext, useContext, useReducer, useEffect, useCallback } from "react"

const PostContext = createContext()
const BASE_URL = "http://localhost:5002"

const initialState = {
  posts: [],
  feedPosts: [],
  loading: true,
  error: null
}

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, posts: action.payload, loading: false, error: null }
    case "FETCH_FEED_SUCCESS":
      return { ...state, feedPosts: action.payload, loading: false, error: null }
    case "FETCH_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "ADD_POST":
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        feedPosts: [action.payload, ...state.feedPosts]
      }
    case "DELETE_POST":
      return {
        ...state,
        posts: state.posts.filter(p => p.id !== action.payload),
        feedPosts: state.feedPosts.filter(p => p.id !== action.payload)
      }
    case "TOGGLE_LIKE":
      const updateLikes = (posts) => posts.map(p => {
        if (p.id !== action.payload.postId) return p
        const liked = action.payload.liked
        return {
          ...p,
          likes: liked
            ? [...p.likes, { userId: action.payload.userId }]
            : p.likes.filter(l => l.userId !== action.payload.userId),
          _count: {
            ...p._count,
            likes: liked ? p._count.likes + 1 : p._count.likes - 1
          }
        }
      })
      return {
        ...state,
        posts: updateLikes(state.posts),
        feedPosts: updateLikes(state.feedPosts)
      }
    case "ADD_COMMENT":
      const addComment = (posts) => posts.map(p => {
        if (p.id !== action.payload.postId) return p
        return {
          ...p,
          comments: [action.payload.comment, ...p.comments],
          _count: { ...p._count, comments: p._count.comments + 1 }
        }
      })
      return {
        ...state,
        posts: addComment(state.posts),
        feedPosts: addComment(state.feedPosts)
      }
    default:
      return state
  }
}

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const getHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }), [])

  // fetch all posts
  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts`, { headers: getHeaders() })
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      dispatch({ type: "FETCH_SUCCESS", payload: data })
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: "Cannot connect to server" })
    }
  }, [getHeaders])

  // fetch feed posts
  const fetchFeed = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts/feed`, { headers: getHeaders() })
      if (!response.ok) throw new Error("Failed to fetch feed")
      const data = await response.json()
      dispatch({ type: "FETCH_FEED_SUCCESS", payload: data })
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: "Cannot connect to server" })
    }
  }, [getHeaders])

  useEffect(() => {
    fetchPosts()
    fetchFeed()
  }, [])

  // create post
  const createPost = useCallback(async (content, image) => {
    try {
      const response = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ content, image })
      })
      if (!response.ok) throw new Error("Failed to create post")
      const data = await response.json()
      dispatch({ type: "ADD_POST", payload: data })
      return { success: true }
    } catch (err) {
      return { success: false, error: "Failed to create post" }
    }
  }, [getHeaders])

  // delete post
  const deletePost = useCallback(async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/posts/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      })
      if (!response.ok) throw new Error("Failed to delete")
      dispatch({ type: "DELETE_POST", payload: id })
      return { success: true }
    } catch (err) {
      return { success: false, error: "Failed to delete post" }
    }
  }, [getHeaders])

  // toggle like
  const toggleLike = useCallback(async (postId, userId) => {
    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
        method: "POST",
        headers: getHeaders()
      })
      if (!response.ok) throw new Error("Failed to toggle like")
      const data = await response.json()
      dispatch({ type: "TOGGLE_LIKE", payload: { postId, liked: data.liked, userId } })
      return { success: true }
    } catch (err) {
      return { success: false }
    }
  }, [getHeaders])

  // add comment
  const addComment = useCallback(async (postId, content) => {
    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ content })
      })
      if (!response.ok) throw new Error("Failed to add comment")
      const comment = await response.json()
      dispatch({ type: "ADD_COMMENT", payload: { postId, comment } })
      return { success: true, comment }
    } catch (err) {
      return { success: false }
    }
  }, [getHeaders])

  return (
    <PostContext.Provider value={{
      posts: state.posts,
      feedPosts: state.feedPosts,
      loading: state.loading,
      error: state.error,
      fetchPosts,
      fetchFeed,
      createPost,
      deletePost,
      toggleLike,
      addComment
    }}>
      {children}
    </PostContext.Provider>
  )
}

export const usePosts = () => useContext(PostContext)