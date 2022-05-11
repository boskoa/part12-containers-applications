const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 20000)

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 20000)

  test('identifier property is named \'id\'', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  }, 20000)
})

describe('viewing a specific blog', () => {
  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

    expect(resultBlog.body).toEqual(processedBlogToView)
  }, 20000)

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonExistentId = await helper.validButNonexistentId()

    await api
      .get(`/api/blogs/${validNonExistentId}`)
      .expect(404)
  }, 20000)

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '89746543211'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)

  }, 20000)
})

describe('addition of a new blog', () => {
  let token
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('NekalozinkA', 10)
    const newUser = new User({ username: 'root', name: 'rootisha', passwordHash })

    await newUser.save()

    token = jwt.sign({ username: newUser.username, id: newUser._id }, process.env.SECRET)

    return token
  })

  test('fails with statuscode 401 if token is missing', async () => {
    const newPost = {
      title: 'Example blog post',
      author: 'John Doe',
      url: 'example.com',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newPost)
      .expect(401)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter.length).toBe(helper.initialBlogs.length)

    const titles = blogsAfter.map(b => b.title)
    expect(titles).not.toContain(newPost.title)
  }, 20000)

  test('a new blog post is successfully created', async () => {
    const newPost = {
      title: 'Example blog post',
      author: 'John Doe',
      url: 'example.com',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter.length).toBe(helper.initialBlogs.length + 1)

    const titles = blogsAfter.map(b => b.title)
    expect(titles).toContain(newPost.title)
  }, 20000)

  test('new blog post has default >likes< value of 0', async () => {
    const newPost = {
      title: 'Example blog post without likes',
      author: 'John Doe',
      url: 'example.com',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()
    const addedPost = blogsAfter.filter(b => b.title === newPost.title)[0]
    expect(addedPost.likes).toBe(0)
  }, 20000)

  test('post request without title or url are not allowed', async () => {
    const newPost = {
      url: 'example.com',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newPost)
      .expect(400)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(helper.initialBlogs.length)
  }, 20000)
})

describe('deletion of a blog', () => {
  let token
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('NekalozinkA', 10)
    const newUser = new User({ username: 'root', name: 'rootisha', passwordHash })

    await newUser.save()

    token = jwt.sign({ username: newUser.username, id: newUser._id }, process.env.SECRET)

    return token
  })
  test('a blog can be deleted', async () => {
    const postToDelete = {
      title: 'Example blog post',
      author: 'John Doe',
      url: 'example.com',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(postToDelete)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtStart = await helper.blogsInDb()
    const blog = await Blog.find({ title: 'Example blog post' })

    await api
      .delete(`/api/blogs/${blog[0].id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(postToDelete.title)
  })
})

describe('updating a blog', () => {
  let token
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('NekalozinkA', 10)
    const newUser = new User({ username: 'root', name: 'rootisha', passwordHash })

    await newUser.save()

    token = jwt.sign({ username: newUser.username, id: newUser._id }, process.env.SECRET)

    const blog = {
      title: 'React patterns update',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    return token
  })

  test('can update a blog with a valid id', async () => {
    const updatedBlog = {
      title: 'React patterns',
      author: 'Michael Palin',
      url: 'https://reactpatterns.com/',
      likes: 7
    }

    const blogToChange = await Blog.find({ title: 'React patterns update' })

    await api
      .put(`/api/blogs/${blogToChange[0].id}`)
      .set('Authorization', `bearer ${token}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter[blogsAfter.length - 1].likes).toBe(updatedBlog.likes)
    expect(blogsAfter[blogsAfter.length - 1].author).toBe(updatedBlog.author)
  }, 20000)

  test('can\'t update a blog with a valid but deleted id', async () => {
    const exId = await helper.validButNonexistentId()
    const blog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 10
    }

    await api
      .put(`/api/blogs/${exId}`)
      .set('Authorization', `bearer ${token}`)
      .send(blog)
      .expect(404)
  }, 20000)
})

afterAll(() => {
  mongoose.connection.close()
})
