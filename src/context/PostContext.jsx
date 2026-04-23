import { createContext, useContext, useReducer, useEffect, useCallback } from "react"

const PostContext = createContext()
const BASE_URL = "http://localhost:5002"

const initialState = {
  posts: [],
  feedPosts: [],
  loading: true,
  error: null,
  // pagination state
  postsPage: 1,
  feedPage: 1,
  hasMorePosts: true,
  hasMoreFeed: true,
  loadingMore: false
}

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        posts: action.payload.posts,
        hasMorePosts: action.payload.hasMore,
        postsPage: 1,
        loading: false,
        error: null
      }
    case "FETCH_FEED_SUCCESS":
      return {
        ...state,
        feedPosts: action.payload.posts,
        hasMoreFeed: action.payload.hasMore,
        feedPage: 1,
        loading: false,
        error: null
      }
    case "LOAD_MORE_POSTS":
      return {
        ...state,
        posts: [...state.posts, ...action.payload.posts],
        hasMorePosts: action.payload.hasMore,
        postsPage: state.postsPage + 1,
        loadingMore: false
      }
    case "LOAD_MORE_FEED":
      return {
        ...state,
        feedPosts: [...state.feedPosts, ...action.payload.posts],
        hasMoreFeed: action.payload.hasMore,
        feedPage: state.feedPage + 1,
        loadingMore: false
      }
    case "SET_LOADING_MORE":
      return { ...state, loadingMore: true }
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

  // fetch first page of all posts
  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts?page=1&limit=10`, {
        headers: getHeaders()
      })
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      dispatch({
        type: "FETCH_SUCCESS",
        payload: { posts: data.posts, hasMore: data.pagination.hasMore }
      })
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: "Cannot connect to server" })
    }
  }, [getHeaders])

  // fetch first page of feed
  const fetchFeed = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts/feed?page=1&limit=10`, {
        headers: getHeaders()
      })
      if (!response.ok) throw new Error("Failed to fetch feed")
      const data = await response.json()
      dispatch({
        type: "FETCH_FEED_SUCCESS",
        payload: { posts: data.posts, hasMore: data.pagination.hasMore }
      })
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: "Cannot connect to server" })
    }
  }, [getHeaders])

  // load more posts — next page
  const loadMorePosts = useCallback(async () => {
    if (!state.hasMorePosts || state.loadingMore) return
    dispatch({ type: "SET_LOADING_MORE" })
    try {
      const nextPage = state.postsPage + 1
      const response = await fetch(`${BASE_URL}/posts?page=${nextPage}&limit=10`, {
        headers: getHeaders()
      })
      const data = await response.json()
      dispatch({
        type: "LOAD_MORE_POSTS",
        payload: { posts: data.posts, hasMore: data.pagination.hasMore }
      })
    } catch (err) {
      console.error(err)
    }
  }, [state.hasMorePosts, state.loadingMore, state.postsPage, getHeaders])

  // load more feed — next page
  const loadMoreFeed = useCallback(async () => {
    if (!state.hasMoreFeed || state.loadingMore) return
    dispatch({ type: "SET_LOADING_MORE" })
    try {
      const nextPage = state.feedPage + 1
      const response = await fetch(`${BASE_URL}/posts/feed?page=${nextPage}&limit=10`, {
        headers: getHeaders()
      })
      const data = await response.json()
      dispatch({
        type: "LOAD_MORE_FEED",
        payload: { posts: data.posts, hasMore: data.pagination.hasMore }
      })
    } catch (err) {
      console.error(err)
    }
  }, [state.hasMoreFeed, state.loadingMore, state.feedPage, getHeaders])

  useEffect(() => {
    fetchPosts()
    fetchFeed()
  }, [])

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
      hasMorePosts: state.hasMorePosts,
      hasMoreFeed: state.hasMoreFeed,
      loadingMore: state.loadingMore,
      fetchPosts,
      fetchFeed,
      loadMorePosts,
      loadMoreFeed,
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