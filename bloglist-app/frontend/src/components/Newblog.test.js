import React from 'react'
import Newblog from './Newblog'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'

test('newblog form is posted as expected', () => {
  const createBlog = jest.fn()

  const component = render(
    <Newblog createBlog={createBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'Testing forms' }
  })
  fireEvent.change(author, {
    target: { value: 'Tester' }
  })
  fireEvent.change(url, {
    target: { value: 'www.example.com/form' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing forms')
  expect(createBlog.mock.calls[0][0].author).toBe('Tester')
  expect(createBlog.mock.calls[0][0].url).toBe('www.example.com/form')
})