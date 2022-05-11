const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  /* Temporary solution, exercise 4.17.
  let user = await User.findById(body.user)
  if (!user) {
    const users = await User.find({})
    user = users[Math.floor(Math.random() * users.length)]
  }
  */

  if (!user) {
    return response.status(401).end()
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  if (!blog.likes) {
    blog.likes = 0
  }
  if (!blog.title || !blog.url) {
    return response.status(400).end()
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const blogToRemove = await Blog.findById(request.params.id)
  if (!user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (user.id.toString() !== blogToRemove.user.toString()) {
    return response.status(401).json({ error: 'not your blog' })
  }

  await Blog.findByIdAndRemove(blogToRemove.id)
  user.blogs = user.blogs.filter(b => b.toString() !== blogToRemove.id.toString())
  await user.save()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  return updatedBlog
    ? response.json(updatedBlog)
    : response.status(404).end()
})

module.exports = blogsRouter
