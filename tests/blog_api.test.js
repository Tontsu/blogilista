const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, blogsInDb } = require('./test_helper')

describe('when there is initially some blogs saved', async () => {

  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(b => new Blog(b))
    await Promise.all(blogObjects.map(b => b.save()))
  })

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
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hc2EiLCJpZCI6IjVhOTFmNTBkOGYxZGJiMTU3NjE2YzlmNSIsImlhdCI6MTUxOTUxOTM4MX0.h-98GioE40Pxp7IiVqoCGqIoohKgIQeiV3zBe3xOHOs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)

    const contents = blogsAfterOperation.map(r => r.title)
    expect(contents).toContain('The #NoEstimates debate: An unbiased look at the origins, arguments, and thought leaders behind the movement')

  })

  test('POST /api/blogs sets likes to 0 if likes field is missing from request', async () => {
    const newBlog = {
      "title": "Ohjelmistorobotti vapauttaa asiantuntijan rutiinitehtävien ikeestä",
      "author": "Tomi Leppälahti",
      "url": "https://www.vincit.fi/blog/ohjelmistorobotti-vapauttaa-asiantuntijan-rutiinitehtavien-ikeesta/"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hc2EiLCJpZCI6IjVhOTFmNTBkOGYxZGJiMTU3NjE2YzlmNSIsImlhdCI6MTUxOTUxOTM4MX0.h-98GioE40Pxp7IiVqoCGqIoohKgIQeiV3zBe3xOHOs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const addedBlog = await Blog.find({ title: "Ohjelmistorobotti vapauttaa asiantuntijan rutiinitehtävien ikeestä" })
    expect(addedBlog[0].likes).toBe(0)
  })


test('POST /api/blogs returns 400 bad request if title or url is missing', async () => {
  let newBlog = {
    "author": "Edsger W. Dijkstra",
    "url": "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hc2EiLCJpZCI6IjVhOTFmNTBkOGYxZGJiMTU3NjE2YzlmNSIsImlhdCI6MTUxOTUxOTM4MX0.h-98GioE40Pxp7IiVqoCGqIoohKgIQeiV3zBe3xOHOs')
    .expect(400)
    .expect('Content-Type', /application\/json/)

   newBlog = {
    "title": "React patterns",
    "author": "Michael Chan"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hc2EiLCJpZCI6IjVhOTFmNTBkOGYxZGJiMTU3NjE2YzlmNSIsImlhdCI6MTUxOTUxOTM4MX0.h-98GioE40Pxp7IiVqoCGqIoohKgIQeiV3zBe3xOHOs')
    .expect(400)
    .expect('Content-Type', /application\/json/)
  })

})

afterAll(() => {
  server.close()
})
