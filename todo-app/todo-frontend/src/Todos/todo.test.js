import { render } from '@testing-library/react'
import Todo from './Todo'
import React from 'react'
import '@testing-library/jest-dom/extend-expect'

test('component rendered with correct text', () => {
  const content = {
    text: 'Testing todos',
    done: true
  }

  const todo = render(<Todo
      todo={content}
      onClickComplete={() => {}}
      onClickDelete={() => {}}
    />)

  expect(todo.container).toHaveTextContent(content.text)
})