const dummy = (blogs) => {
  return blogs.length - blogs.length + 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return (!blogs.length)
    ? 0
    : blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (prev, next) => {
    return prev > next
      ? prev
      : next
  }

  return (!blogs.length)
    ? null
    : blogs.filter(blog => {
      return blog.likes === blogs.map(blog => blog.likes).reduce(reducer, 0)
    })[0]
}

const mostBlogs = (blogs) => {
  const reducer = (prev, next) => {
    return prev.blogs > next.blogs
      ? prev
      : next
  }
  let newList = []
  for (let i = 0; i < blogs.length; i++) {
    const name = blogs[i].author
    let found = false
    for (let j = 0; j < newList.length; j++) {
      if (!newList[j]) {
        continue
      }
      else if (newList[j].author === name) {
        newList[j].blogs++
        found = true
        break
      }
    }
    if (!found) {
      newList.push({ author: name, blogs: 1 })
    }
  }

  return newList.reduce(reducer, 0)
}

const mostLikes = (blogs) => {
  const reducer = (prev, next) => {
    return prev.likes > next.likes
      ? prev
      : next
  }
  let newList = []
  for (let i = 0; i < blogs.length; i++) {
    const name = blogs[i].author
    let found = false
    for (let j = 0; j < newList.length; j++) {
      if (!newList[j]) {
        continue
      }
      else if (newList[j].author === name) {
        newList[j].likes += blogs[i].likes
        found = true
        break
      }
    }
    if (!found) {
      newList.push({ author: name, likes: blogs[i].likes })
    }
  }

  return newList.reduce(reducer, 0)
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }