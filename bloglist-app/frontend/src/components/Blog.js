import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, handleLikes, handleBlogRemove }) => {
  const [detail, setDetail] = useState(false)

  const toggleDetail = () => {
    setDetail(!detail)
  }

  const handleUpdateLikes = () => {
    const updatedObject = { ...blog, likes: blog.likes + 1 }
    handleLikes(updatedObject)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      handleBlogRemove(blog)
    }
  }

  let userCondition = false
  if (user === undefined) {
    userCondition = false
  } else {
    userCondition = user.username === blog.user.username
  }

  return(
    <div>
      {detail
        ? <div className="box long detailed">
          <div>
            {blog.title}
            <button className="boxButton" onClick={toggleDetail}>hide</button>
          </div>
          <div>{blog.url}</div>
          <div>
            Likes: <span className="likesNum">{blog.likes}</span>
            <button onClick={handleUpdateLikes}>like</button>
          </div>
          <div>{blog.author}</div>
          {userCondition &&
            <button onClick={handleRemove}>remove</button>
          }
        </div>
        : <div className="box short">
          {blog.title}, by {blog.author}
          <button className="boxButton show" onClick={toggleDetail}>show</button>
        </div>
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLikes: PropTypes.func.isRequired,
  handleBlogRemove: PropTypes.func.isRequired
}

export default Blog