import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';

// Mock the NavigatorProvider to avoid complex setup
jest.mock('@idealyst/navigation', () => ({
  NavigatorProvider: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="navigator-provider">{children || 'Navigator Content'}</div>
  ),
}));

jest.mock('@idealyst/navigation/examples', () => ({
  ExampleStackRouter: {},
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('navigator-provider')).toBeInTheDocument();
  });

  it('contains the App class', () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    
    expect(container.querySelector('.App')).toBeInTheDocument();
  });

  it('renders NavigatorProvider with BrowserRouter', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    
    const navigatorProvider = screen.getByTestId('navigator-provider');
    expect(navigatorProvider).toBeInTheDocument();
    expect(navigatorProvider).toHaveTextContent('Navigator Content');
  });
});

describe('Sample React Component Tests', () => {
  // Example functional component for testing
  const Button = ({ 
    children, 
    onClick, 
    disabled = false, 
    variant = 'primary' 
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
  }) => (
    <button
      data-testid="custom-button"
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );

  it('renders button with correct text', () => {
    const mockClick = jest.fn();
    render(<Button onClick={mockClick}>Click me</Button>);
    
    const button = screen.getByTestId('custom-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const mockClick = jest.fn();
    
    render(<Button onClick={mockClick}>Click me</Button>);
    
    const button = screen.getByTestId('custom-button');
    await user.click(button);
    
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const mockClick = jest.fn();
    render(
      <Button onClick={mockClick} disabled>
        Disabled Button
      </Button>
    );
    
    const button = screen.getByTestId('custom-button');
    expect(button).toBeDisabled();
  });

  it('applies correct CSS classes based on variant', () => {
    const mockClick = jest.fn();
    const { rerender } = render(
      <Button onClick={mockClick} variant="primary">
        Primary Button
      </Button>
    );
    
    let button = screen.getByTestId('custom-button');
    expect(button).toHaveClass('btn', 'btn-primary');
    
    rerender(
      <Button onClick={mockClick} variant="secondary">
        Secondary Button
      </Button>
    );
    
    button = screen.getByTestId('custom-button');
    expect(button).toHaveClass('btn', 'btn-secondary');
  });
});

describe('Component with State', () => {
  const Counter = ({ initialCount = 0 }: { initialCount?: number }) => {
    const [count, setCount] = React.useState(initialCount);
    
    return (
      <div data-testid="counter">
        <span data-testid="count-display">Count: {count}</span>
        <button
          data-testid="increment-button"
          onClick={() => setCount(c => c + 1)}
        >
          Increment
        </button>
        <button
          data-testid="decrement-button"
          onClick={() => setCount(c => c - 1)}
        >
          Decrement
        </button>
        <button
          data-testid="reset-button"
          onClick={() => setCount(initialCount)}
        >
          Reset
        </button>
      </div>
    );
  };

  it('renders with initial count', () => {
    render(<Counter initialCount={5} />);
    
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 5');
  });

  it('increments count when increment button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    const incrementButton = screen.getByTestId('increment-button');
    const countDisplay = screen.getByTestId('count-display');
    
    expect(countDisplay).toHaveTextContent('Count: 0');
    
    await user.click(incrementButton);
    expect(countDisplay).toHaveTextContent('Count: 1');
    
    await user.click(incrementButton);
    expect(countDisplay).toHaveTextContent('Count: 2');
  });

  it('decrements count when decrement button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={5} />);
    
    const decrementButton = screen.getByTestId('decrement-button');
    const countDisplay = screen.getByTestId('count-display');
    
    expect(countDisplay).toHaveTextContent('Count: 5');
    
    await user.click(decrementButton);
    expect(countDisplay).toHaveTextContent('Count: 4');
  });

  it('resets count to initial value', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={10} />);
    
    const incrementButton = screen.getByTestId('increment-button');
    const resetButton = screen.getByTestId('reset-button');
    const countDisplay = screen.getByTestId('count-display');
    
    // Increment a few times
    await user.click(incrementButton);
    await user.click(incrementButton);
    expect(countDisplay).toHaveTextContent('Count: 12');
    
    // Reset
    await user.click(resetButton);
    expect(countDisplay).toHaveTextContent('Count: 10');
  });
});

describe('Async Component Testing', () => {
  const AsyncDataComponent = () => {
    const [data, setData] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100));
        setData('Fetched data successfully');
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div data-testid="async-component">
        <button data-testid="fetch-button" onClick={fetchData}>
          Fetch Data
        </button>
        
        {loading && <div data-testid="loading">Loading...</div>}
        {error && <div data-testid="error">{error}</div>}
        {data && <div data-testid="data">{data}</div>}
      </div>
    );
  };

  it('fetches and displays data', async () => {
    const user = userEvent.setup();
    render(<AsyncDataComponent />);
    
    const fetchButton = screen.getByTestId('fetch-button');
    
    // Initially no data, loading, or error
    expect(screen.queryByTestId('data')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    
    // Click fetch button
    await user.click(fetchButton);
    
    // Loading should appear
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('data')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('data')).toHaveTextContent('Fetched data successfully');
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });
});

describe('Form Component Testing', () => {
  const ContactForm = ({ onSubmit }: { onSubmit: (data: { name: string; email: string }) => void }) => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({ name, email });
    };
    
    return (
      <form data-testid="contact-form" onSubmit={handleSubmit}>
        <input
          data-testid="name-input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          data-testid="email-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button data-testid="submit-button" type="submit">
          Submit
        </button>
      </form>
    );
  };

  it('submits form with correct data', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn();
    
    render(<ContactForm onSubmit={mockSubmit} />);
    
    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByTestId('submit-button');
    
    // Fill out form
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    
    // Submit form
    await user.click(submitButton);
    
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    });
  });

  it('updates input values as user types', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn();
    
    render(<ContactForm onSubmit={mockSubmit} />);
    
    const nameInput = screen.getByTestId('name-input') as HTMLInputElement;
    
    await user.type(nameInput, 'Test Name');
    
    expect(nameInput.value).toBe('Test Name');
  });
});
