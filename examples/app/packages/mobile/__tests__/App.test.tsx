/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// Mock the NavigatorProvider to avoid complex navigation setup
jest.mock('@idealyst/navigation', () => ({
  NavigatorProvider: ({ children }: { children?: React.ReactNode }) => (
    React.createElement('View', { testID: 'navigator-provider' }, children || 'Navigator Content')
  ),
}));

jest.mock('@idealyst/navigation/examples', () => ({
  ExampleStackRouter: {},
}));

describe('App Component', () => {
  it('renders correctly', async () => {
    let component: ReactTestRenderer.ReactTestRenderer;
    
    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<App />);
    });
    
    expect(component!).toBeDefined();
    expect(component!.toJSON()).toMatchSnapshot();
  });

  it('renders without crashing', () => {
    const tree = ReactTestRenderer.create(<App />);
    expect(tree).toBeDefined();
    expect(tree.root).toBeDefined();
  });

  it('contains NavigatorProvider', () => {
    const tree = ReactTestRenderer.create(<App />);
    const navigatorProvider = tree.root.findByProps({ testID: 'navigator-provider' });
    expect(navigatorProvider).toBeDefined();
  });

  it('has proper SafeAreaView structure', () => {
    const tree = ReactTestRenderer.create(<App />);
    const safeAreaView = tree.root.findByType('SafeAreaView');
    expect(safeAreaView).toBeDefined();
    expect(safeAreaView.props.style).toEqual({ flex: 1 });
  });
});

describe('Sample Component Tests', () => {
  // Example of testing a simple functional component
  const SimpleButton = ({ title, onPress, disabled = false }: {
    title: string;
    onPress: () => void;
    disabled?: boolean;
  }) => {
    return React.createElement(
      'TouchableOpacity',
      {
        testID: 'simple-button',
        onPress: disabled ? undefined : onPress,
        style: { opacity: disabled ? 0.5 : 1 }
      },
      React.createElement('Text', null, title)
    );
  };

  it('renders button with correct title', () => {
    const mockPress = jest.fn();
    const tree = ReactTestRenderer.create(
      <SimpleButton title="Test Button" onPress={mockPress} />
    );
    
    const textElement = tree.root.findByType('Text');
    expect(textElement.children).toEqual(['Test Button']);
  });

  it('handles press events', () => {
    const mockPress = jest.fn();
    const tree = ReactTestRenderer.create(
      <SimpleButton title="Test Button" onPress={mockPress} />
    );
    
    const button = tree.root.findByProps({ testID: 'simple-button' });
    ReactTestRenderer.act(() => {
      button.props.onPress();
    });
    
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    const mockPress = jest.fn();
    const tree = ReactTestRenderer.create(
      <SimpleButton title="Disabled Button" onPress={mockPress} disabled={true} />
    );
    
    const button = tree.root.findByProps({ testID: 'simple-button' });
    expect(button.props.onPress).toBeUndefined();
    expect(button.props.style.opacity).toBe(0.5);
  });

  it('handles component state changes', () => {
    const StatefulComponent = () => {
      const [count, setCount] = React.useState(0);
      
      return React.createElement(
        'View',
        { testID: 'stateful-component' },
        React.createElement('Text', { testID: 'count' }, count.toString()),
        React.createElement(
          'TouchableOpacity',
          {
            testID: 'increment-button',
            onPress: () => setCount(c => c + 1)
          },
          React.createElement('Text', null, 'Increment')
        )
      );
    };

    const tree = ReactTestRenderer.create(<StatefulComponent />);
    
    // Check initial state
    const countText = tree.root.findByProps({ testID: 'count' });
    expect(countText.children).toEqual(['0']);
    
    // Simulate button press
    const incrementButton = tree.root.findByProps({ testID: 'increment-button' });
    ReactTestRenderer.act(() => {
      incrementButton.props.onPress();
    });
    
    // Check updated state
    expect(countText.children).toEqual(['1']);
  });
});

describe('Sample Native Tests', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const greeting = 'Hello World';
    expect(greeting).toContain('World');
  });

  it('should work with arrays', () => {
    const items = [1, 2, 3];
    expect(items).toHaveLength(3);
    expect(items).toContain(2);
  });
});
