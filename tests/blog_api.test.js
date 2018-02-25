const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const blogsInDb = require('./test_helper')

describe('when there is initially some blogs saved', async () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are three blogs', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(3)
  })

  test('the first blog is about react patterns', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body[0].title).toBe('React patterns')
  })

})

describe('addition of a new blog', async () => {

  test('POST /api/blogs succeeds with a valid data', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlog = {
      "title": "The #NoEstimates debate: An unbiased look at the origins, arguments, and thought leaders behind the movement",
      "author": "Malcolm Isaacs",
      "url": "https://techbeacon.com/noestimates-debate-unbiased-look-origins-arguments-thought-leaders-behind-movement",
      "likes": 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)

    const contents = blogsAfterOperation.map(r => r.title)
    expect(contents).toContain('The #NoEstimates debate: An unbiased look at the origins, arguments, and thought leaders behind the movement')

  })
})

afterAll(() => {
  server.close()
})
