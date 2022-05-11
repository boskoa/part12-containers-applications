const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const User = require('../models/user')
const usersInDb = require('./test_helper').usersInDb
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('when there is initially one user in DB', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('NekalozinkA', 10)
    const newUser = new User({ username: 'root', name: 'rootisha', passwordHash })

    await newUser.save()
  })
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'Oblo',
      name: 'Oblic',
      password: 'NekalozinkA'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const users = usersAtEnd.map(u => u.username)
    expect(users).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'root',
      name: 'mootisha',
      password: 'DrugalozinkA'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username too short', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'ro',
      name: 'mootisha',
      password: 'DrugalozinkA'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('shorter than the minimum')

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password too short', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'moot',
      name: 'mootisha',
      password: 'Dr'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password is too short')

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})