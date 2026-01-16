/**
 * Example component tests for React Web
 * Demonstrates comprehensive testing patterns with React Testing Library
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('React Web Component Testing Examples', () => {
  // Example 1: Simple Display Component
  const WelcomeMessage = ({ 
    name, 
    showGreeting = true 
  }: { 
    name: string; 
    showGreeting?: boolean; 
  }) => (
    <div data-testid="welcome-message">
      {showGreeting && <h1>Welcome, {name}!</h1>}
      <p>Thank you for visiting our site.</p>
    </div>
  );

  describe('WelcomeMessage Component', () => {
    it('renders welcome message with name', () => {
      render(<WelcomeMessage name="John" />);
      
      expect(screen.getByText('Welcome, John!')).toBeInTheDocument();
      expect(screen.getByText('Thank you for visiting our site.')).toBeInTheDocument();
    });

    it('hides greeting when showGreeting is false', () => {
      render(<WelcomeMessage name="John" showGreeting={false} />);
      
      expect(screen.queryByText('Welcome, John!')).not.toBeInTheDocument();
      expect(screen.getByText('Thank you for visiting our site.')).toBeInTheDocument();
    });
  });

  // Example 2: Interactive Button Component
  const ActionButton = ({ 
    children, 
    onClick, 
    variant = 'primary',
    disabled = false,
    loading = false 
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    loading?: boolean;
  }) => (
    <button
      data-testid="action-button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} ${loading ? 'loading' : ''}`}
      aria-label={loading ? 'Loading...' : undefined}
    >
      {loading ? 'Loading...' : children}
    </button>
  );

  describe('ActionButton Component', () => {
    it('renders button with correct text', () => {
      const mockClick = jest.fn();
      render(<ActionButton onClick={mockClick}>Click me</ActionButton>);
      
      const button = screen.getByTestId('action-button');
      expect(button).toHaveTextContent('Click me');
      expect(button).toHaveClass('btn', 'btn-primary');
    });

    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();
      
      render(<ActionButton onClick={mockClick}>Click me</ActionButton>);
      
      await user.click(screen.getByTestId('action-button'));
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('applies correct variant class', () => {
      const mockClick = jest.fn();
      render(<ActionButton onClick={mockClick} variant="danger">Delete</ActionButton>);
      
      expect(screen.getByTestId('action-button')).toHaveClass('btn-danger');
    });

    it('shows loading state', () => {
      const mockClick = jest.fn();
      render(<ActionButton onClick={mockClick} loading>Submit</ActionButton>);
      
      const button = screen.getByTestId('action-button');
      expect(button).toHaveTextContent('Loading...');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('loading');
      expect(button).toHaveAttribute('aria-label', 'Loading...');
    });

    it('is disabled when disabled prop is true', () => {
      const mockClick = jest.fn();
      render(<ActionButton onClick={mockClick} disabled>Disabled</ActionButton>);
      
      expect(screen.getByTestId('action-button')).toBeDisabled();
    });
  });

  // Example 3: Form Component with Validation
  const ContactForm = ({ 
    onSubmit 
  }: { 
    onSubmit: (data: { name: string; email: string; message: string }) => void; 
  }) => {
    const [formData, setFormData] = React.useState({
      name: '',
      email: '',
      message: ''
    });
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const validateForm = () => {
      const newErrors: Record<string, string> = {};
      
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (!formData.message.trim()) {
        newErrors.message = 'Message is required';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        onSubmit(formData);
      }
    };

    const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };

    return (
      <form data-testid="contact-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            data-testid="name-input"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <div id="name-error" data-testid="name-error" role="alert">
              {errors.name}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            data-testid="email-input"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <div id="email-error" data-testid="email-error" role="alert">
              {errors.email}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            data-testid="message-input"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <div id="message-error" data-testid="message-error" role="alert">
              {errors.message}
            </div>
          )}
        </div>

        <button data-testid="submit-button" type="submit">
          Send Message
        </button>
      </form>
    );
  };

  describe('ContactForm Component', () => {
    it('renders all form fields', () => {
      const mockSubmit = jest.fn();
      render(<ContactForm onSubmit={mockSubmit} />);
      
      expect(screen.getByLabelText('Name:')).toBeInTheDocument();
      expect(screen.getByLabelText('Email:')).toBeInTheDocument();
      expect(screen.getByLabelText('Message:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      
      render(<ContactForm onSubmit={mockSubmit} />);
      
      await user.type(screen.getByLabelText('Name:'), 'John Doe');
      await user.type(screen.getByLabelText('Email:'), 'john@example.com');
      await user.type(screen.getByLabelText('Message:'), 'Hello there!');
      
      await user.click(screen.getByRole('button', { name: 'Send Message' }));
      
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello there!'
      });
    });

    it('shows validation errors for empty fields', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      
      render(<ContactForm onSubmit={mockSubmit} />);
      
      await user.click(screen.getByRole('button', { name: 'Send Message' }));
      
      expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');
      expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');
      expect(screen.getByTestId('message-error')).toHaveTextContent('Message is required');
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('shows email validation error for invalid email', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      
      render(<ContactForm onSubmit={mockSubmit} />);
      
      await user.type(screen.getByLabelText('Email:'), 'invalid-email');
      await user.click(screen.getByRole('button', { name: 'Send Message' }));
      
      expect(screen.getByTestId('email-error')).toHaveTextContent('Email is invalid');
    });

    it('clears errors when user starts typing', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      
      render(<ContactForm onSubmit={mockSubmit} />);
      
      // Trigger validation errors
      await user.click(screen.getByRole('button', { name: 'Send Message' }));
      expect(screen.getByTestId('name-error')).toBeInTheDocument();
      
      // Start typing in name field
      await user.type(screen.getByLabelText('Name:'), 'J');
      
      // Error should be cleared
      expect(screen.queryByTestId('name-error')).not.toBeInTheDocument();
    });
  });

  // Example 4: Data Fetching Component
  const UserProfile = ({ userId }: { userId: string }) => {
    const [user, setUser] = React.useState<{ id: string; name: string; email: string } | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchUser = React.useCallback(async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (userId === 'invalid') {
          throw new Error('User not found');
        }
        
        setUser({
          id: userId,
          name: `User ${userId}`,
          email: `user${userId}@example.com`
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }, [userId]);

    React.useEffect(() => {
      fetchUser();
    }, [fetchUser]);

    if (loading) {
      return <div data-testid="loading">Loading user...</div>;
    }

    if (error) {
      return (
        <div data-testid="danger">
          <p>Error: {error}</p>
          <button data-testid="retry-button" onClick={fetchUser}>
            Retry
          </button>
        </div>
      );
    }

    if (!user) {
      return <div data-testid="no-user">No user found</div>;
    }

    return (
      <div data-testid="user-profile">
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>ID: {user.id}</p>
      </div>
    );
  };

  describe('UserProfile Component', () => {
    it('shows loading state initially', () => {
      render(<UserProfile userId="123" />);
      
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('shows user data after successful fetch', async () => {
      render(<UserProfile userId="123" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      });
      
      expect(screen.getByText('User 123')).toBeInTheDocument();
      expect(screen.getByText('Email: user123@example.com')).toBeInTheDocument();
      expect(screen.getByText('ID: 123')).toBeInTheDocument();
    });

    it('shows error state when fetch fails', async () => {
      render(<UserProfile userId="invalid" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Error: User not found')).toBeInTheDocument();
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    });

    it('retries fetch when retry button is clicked', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<UserProfile userId="invalid" />);
      
      // Wait for error state
      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      });
      
      // Change userId to valid and click retry
      rerender(<UserProfile userId="456" />);
      await user.click(screen.getByTestId('retry-button'));
      
      // Should show loading then success
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      });
    });
  });

  // Example 5: Modal Component
  const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children 
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }) => {
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
      <div 
        data-testid="modal-overlay" 
        className="modal-overlay"
        onClick={onClose}
      >
        <div 
          data-testid="modal-content" 
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-labelledby="modal-title"
        >
          <header className="modal-header">
            <h2 id="modal-title">{title}</h2>
            <button 
              data-testid="close-button"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </header>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    );
  };

  describe('Modal Component', () => {
    it('does not render when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={jest.fn()} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
    });

    it('renders when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const mockClose = jest.fn();
      
      render(
        <Modal isOpen={true} onClose={mockClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      await user.click(screen.getByTestId('close-button'));
      expect(mockClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when overlay is clicked', async () => {
      const user = userEvent.setup();
      const mockClose = jest.fn();
      
      render(
        <Modal isOpen={true} onClose={mockClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      await user.click(screen.getByTestId('modal-overlay'));
      expect(mockClose).toHaveBeenCalledTimes(1);
    });

    it('does not close when modal content is clicked', async () => {
      const user = userEvent.setup();
      const mockClose = jest.fn();
      
      render(
        <Modal isOpen={true} onClose={mockClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      await user.click(screen.getByTestId('modal-content'));
      expect(mockClose).not.toHaveBeenCalled();
    });

    it('closes when Escape key is pressed', async () => {
      const user = userEvent.setup();
      const mockClose = jest.fn();
      
      render(
        <Modal isOpen={true} onClose={mockClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      await user.keyboard('{Escape}');
      expect(mockClose).toHaveBeenCalledTimes(1);
    });

    it('has proper accessibility attributes', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      const modalContent = screen.getByTestId('modal-content');
      expect(modalContent).toHaveAttribute('role', 'dialog');
      expect(modalContent).toHaveAttribute('aria-labelledby', 'modal-title');
      
      const closeButton = screen.getByTestId('close-button');
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
    });
  });
});
