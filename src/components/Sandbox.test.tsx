import { render, screen } from '@testing-library/react'
import Sandbox from './Sandbox'
import { describe, it, expect } from 'vitest'

describe('Sandbox Component', () => {
  it('renders the user email correctly', () => {
    render(<Sandbox userEmail="engineer@tempo.com" />)
    
    // Verify the email is displayed
    expect(screen.getByText('engineer@tempo.com')).toBeInTheDocument()
  })

  it('renders the code textarea and file input', () => {
    render(<Sandbox userEmail="engineer@tempo.com" />)
    
    // Verify the inputs exist by their labels
    expect(screen.getByLabelText(/React Component Code/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Reference Image/i)).toBeInTheDocument()
    
    // Verify the submit button exists
    expect(screen.getByRole('button', { name: /Submit to Sandbox/i })).toBeInTheDocument()
  })
})