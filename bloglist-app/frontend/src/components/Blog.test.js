import React from 'react'
import Blog from './Blog'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'

describe('<Blog />', () => {
  const mockHandleLikes = jest.fn()
  const mockHandleRemoval = jest.fn()

  const blog = {
    title: 'Only title and author',
    author: 'Tester',
    likes: 2,
    url: 'www.example.com'
  }

  let component
  beforeEach(() => {
    component = render(
      <Blog blog={blog} handleLikes={mockHandleLikes} handleBlogRemove={mockHandleRemoval} />
    )
  })

  test('renders title amd author, but not url and likes', () => {
    expect(component.container).toHaveTextContent(blog.title)
    expect(component.container).toHaveTextContent(blog.author)
    expect(component.container).not.toHaveTextContent(blog.likes)
    expect(component.container).not.toHaveTextContent(blog.url)
  })

  test('renders likes and url when clicked', () => {
    const button = component.container.querySelector('.show')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent(blog.likes)
    expect(component.container).toHaveTextContent(blog.url)
  })

  test('two clicks - two calls', () => {
    const showButton = component.getByText('show')
    fireEvent.click(showButton)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandleLikes.mock.calls).toHaveLength(2)
  })
})