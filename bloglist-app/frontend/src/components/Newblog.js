import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Newblog = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleNewPost = event => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div className="formDiv">
      <form onSubmit={handleNewPost}>
        <div>
          Title
          <input
            id="title"
            type="text"
            autoComplete="off"
            name="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author
          <input
            id="author"
            type="text"
            autoComplete="off"
            name="Author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          URL
          <input
            id="url"
            type="text"
            autoComplete="off"
            name="URL"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <input id="submitBlog" type="submit" value="create" />
      </form>
    </div>
  )
}

Newblog.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default Newblog