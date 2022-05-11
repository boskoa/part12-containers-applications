import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Newblog from './components/Newblog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState('')
  const [message, setMessage] = useState({ text: null, style: null })

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async userObject => {
    try {
      const user = await loginService.login(userObject)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setMessage({ text: 'Wrong username or password', style: 'error' })
      setTimeout(() => {
        setMessage({ text: null, style: null })
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser('')
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const handleNewBlog = async newBlog => {
    try {
      blogFormRef.current.toggleVisibility()
      const response = await blogService.create(newBlog)
      setBlogs(blogs.concat(response))
      setMessage(
        {
          text: `A new blog "${response.title}" by ${response.author} added.`,
          style: 'note'
        }
      )
      setTimeout(() => {
        setMessage({ text: null, style: null })
      }, 5000)
    } catch (exception) {
      setMessage({ text: `${exception}`, style: 'error' })
      setTimeout(() => {
        setMessage({ text: null, style: null })
      }, 5000)
    }
  }

  const handleLikes = async updatedBlog => {
    try {
      await blogService.update(updatedBlog)
      setBlogs(blogs.map(b => b.id !== updatedBlog.id ? b : updatedBlog))
    } catch (exception) {
      setMessage({ text: `${exception}`, style: 'error' })
      setTimeout(() => {
        setMessage({ text: null, style: null })
      }, 5000)
    }
  }

  const handleBlogRemove = async deletedObject => {
    try {
      await blogService.remove(deletedObject)
      setBlogs(blogs.filter(b => b.id !== deletedObject.id))
      setMessage(
        {
          text: `Blog "${deletedObject.title}" by ${deletedObject.author} removed.`,
          style: 'note'
        }
      )
      setTimeout(() => {
        setMessage({ text: null, style: null })
      }, 5000)
    } catch (exception) {
      setMessage({ text: `${exception}`, style: 'error' })
      setTimeout(() => {
        setMessage({ text: null, style: null })
      }, 5000)
    }
  }

  return (
    <div id="mainContainer">
      <h2>blogs</h2>
      <Notification message={message} />
      {user
        ? <div>
          <p>
            {user.name} is logged in
            <input id="logout" type="button" value="log out" onClick={handleLogout} />
          </p>
          <Togglable buttonLabel="create" ref={blogFormRef}>
            <Newblog createBlog={handleNewBlog} />
          </Togglable>
        </div>
        : <Togglable buttonLabel="log in">
          <Login handleLogin={handleLogin} />
        </Togglable>
      }
      {blogs.sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            handleLikes={handleLikes}
            handleBlogRemove={handleBlogRemove}
          />)}
    </div>
  )
}

export default App