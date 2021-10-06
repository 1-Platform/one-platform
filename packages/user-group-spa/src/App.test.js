import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

test('renders learn react link', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )
  const navElement = getByText(/User\-Group\ Menu/i)
  expect(navElement).toBeInTheDocument()
})
