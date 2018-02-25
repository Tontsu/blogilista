const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const reducer = (sum, item) => {
    return sum + item
  }
  return likes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length <= 0) {
    return 0
  }
  else {
    return blogs.reduce((prev, current) => {
      return (prev.likes > current.likes) ? prev : current
    })
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
