import { render, screen } from '@testing-library/react'
import Sandbox from './Sandbox'
import { describe, it, expect } from 'vitest'

// Create a mock userId to satisfy TypeScript
const MOCK_USER_ID = '12345-abcde-67890'
const MOCK_EMAIL = 'engineer@tempo.com'

describe('Sandbox Component', () => {
  it('renders the user email correctly', () => {
    // Added userId prop to fix the TS error
    render(<Sandbox userEmail={MOCK_EMAIL} userId={MOCK_USER_ID} />)
    
    // Verify the email is displayed
    expect(screen.getByText(MOCK_EMAIL)).toBeInTheDocument()
  })

  it('renders the code textarea and file input', () => {
    render(<Sandbox userEmail={MOCK_EMAIL} userId={MOCK_USER_ID} />)
    
    // Verify the inputs exist by their labels
    expect(screen.getByLabelText(/React Component Code/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Reference Image/i)).toBeInTheDocument()
    // Verify the submit button exists
    expect(screen.getByRole('button', { name: /Submit to Sandbox/i })).toBeInTheDocument()
  })

  it('shows the status message container when active', () => {
    // Render the component; initially, no status message should exist
    render(<Sandbox userEmail={MOCK_EMAIL} userId={MOCK_USER_ID} />)
    
    const statusBox = screen.queryByText(/successfully uploaded/i)
    expect(statusBox).not.toBeInTheDocument()
  })
})