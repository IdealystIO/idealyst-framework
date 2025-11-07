/**
 * Example component tests for React Native
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

describe('React Native Component Testing Examples', () => {
  // Example 1: Simple Text Component
  const SimpleText = ({ text, color = 'black' }: { text: string; color?: string }) => {
    return React.createElement('Text', { style: { color }, testID: 'simple-text' }, text);
  };

  describe('SimpleText Component', () => {
    it('renders text correctly', () => {
      const tree = ReactTestRenderer.create(<SimpleText text="Hello World" />);
      const textComponent = tree.root.findByProps({ testID: 'simple-text' });
      expect(textComponent.children).toEqual(['Hello World']);
    });

    it('applies custom color', () => {
      const tree = ReactTestRenderer.create(<SimpleText text="Colored Text" color="red" />);
      const textComponent = tree.root.findByProps({ testID: 'simple-text' });
      expect(textComponent.props.style.color).toBe('red');
    });

    it('uses default color when not specified', () => {
      const tree = ReactTestRenderer.create(<SimpleText text="Default Color" />);
      const textComponent = tree.root.findByProps({ testID: 'simple-text' });
      expect(textComponent.props.style.color).toBe('black');
    });
  });

  // Example 2: Button with Press Handler
  const PressableButton = ({ 
    title, 
    onPress, 
    disabled = false 
  }: { 
    title: string; 
    onPress: () => void; 
    disabled?: boolean; 
  }) => {
    return React.createElement(
      'TouchableOpacity',
      {
        testID: 'pressable-button',
        onPress: disabled ? undefined : onPress,
        style: { opacity: disabled ? 0.5 : 1 }
      },
      React.createElement('Text', { testID: 'button-text' }, title)
    );
  };

  describe('PressableButton Component', () => {
    it('renders button with title', () => {
      const mockPress = jest.fn();
      const tree = ReactTestRenderer.create(
        <PressableButton title="Press Me" onPress={mockPress} />
      );

      const buttonText = tree.root.findByProps({ testID: 'button-text' });
      expect(buttonText.children).toEqual(['Press Me']);
    });

    it('calls onPress when pressed', () => {
      const mockPress = jest.fn();
      const tree = ReactTestRenderer.create(
        <PressableButton title="Press Me" onPress={mockPress} />
      );

      const button = tree.root.findByProps({ testID: 'pressable-button' });
      ReactTestRenderer.act(() => {
        button.props.onPress();
      });

      expect(mockPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const mockPress = jest.fn();
      const tree = ReactTestRenderer.create(
        <PressableButton title="Disabled" onPress={mockPress} disabled />
      );

      const button = tree.root.findByProps({ testID: 'pressable-button' });
      expect(button.props.onPress).toBeUndefined();
      expect(button.props.style.opacity).toBe(0.5);
    });
  });

  // Example 3: List Component
  const ItemList = ({ items }: { items: string[] }) => {
    return React.createElement(
      'FlatList',
      {
        testID: 'item-list',
        data: items,
        renderItem: ({ item, index }: { item: string; index: number }) =>
          React.createElement(
            'View',
            { key: index, testID: `item-${index}` },
            React.createElement('Text', { testID: `item-text-${index}` }, item)
          ),
        keyExtractor: (item: string, index: number) => `${item}-${index}`
      }
    );
  };

  describe('ItemList Component', () => {
    it('renders list with items', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];
      const tree = ReactTestRenderer.create(<ItemList items={items} />);

      const flatList = tree.root.findByProps({ testID: 'item-list' });
      expect(flatList.props.data).toEqual(items);
    });

    it('generates correct key extractor', () => {
      const items = ['Apple', 'Banana'];
      const tree = ReactTestRenderer.create(<ItemList items={items} />);

      const flatList = tree.root.findByProps({ testID: 'item-list' });
      const keyExtractor = flatList.props.keyExtractor;
      
      expect(keyExtractor('Apple', 0)).toBe('Apple-0');
      expect(keyExtractor('Banana', 1)).toBe('Banana-1');
    });
  });

  // Example 4: Form Input Component
  const TextInput = ({ 
    value, 
    onChangeText, 
    placeholder,
    secureTextEntry = false 
  }: { 
    value: string; 
    onChangeText: (text: string) => void; 
    placeholder?: string;
    secureTextEntry?: boolean;
  }) => {
    return React.createElement('TextInput', {
      testID: 'text-input',
      value,
      onChangeText,
      placeholder,
      secureTextEntry,
      style: { borderWidth: 1, padding: 10 }
    });
  };

  describe('TextInput Component', () => {
    it('renders with initial value', () => {
      const mockChange = jest.fn();
      const tree = ReactTestRenderer.create(
        <TextInput value="Initial Value" onChangeText={mockChange} />
      );

      const input = tree.root.findByProps({ testID: 'text-input' });
      expect(input.props.value).toBe('Initial Value');
    });

    it('calls onChangeText when text changes', () => {
      const mockChange = jest.fn();
      const tree = ReactTestRenderer.create(
        <TextInput value="" onChangeText={mockChange} />
      );

      const input = tree.root.findByProps({ testID: 'text-input' });
      ReactTestRenderer.act(() => {
        input.props.onChangeText('New Text');
      });

      expect(mockChange).toHaveBeenCalledWith('New Text');
    });

    it('shows placeholder when provided', () => {
      const mockChange = jest.fn();
      const tree = ReactTestRenderer.create(
        <TextInput 
          value="" 
          onChangeText={mockChange} 
          placeholder="Enter text here" 
        />
      );

      const input = tree.root.findByProps({ testID: 'text-input' });
      expect(input.props.placeholder).toBe('Enter text here');
    });

    it('enables secure text entry when specified', () => {
      const mockChange = jest.fn();
      const tree = ReactTestRenderer.create(
        <TextInput 
          value="" 
          onChangeText={mockChange} 
          secureTextEntry 
        />
      );

      const input = tree.root.findByProps({ testID: 'text-input' });
      expect(input.props.secureTextEntry).toBe(true);
    });
  });

  // Example 5: Component with Hooks
  const Counter = ({ initialValue = 0 }: { initialValue?: number }) => {
    const [count, setCount] = React.useState(initialValue);

    return React.createElement(
      'View',
      { testID: 'counter-container' },
      React.createElement('Text', { testID: 'counter-value' }, count.toString()),
      React.createElement(
        'TouchableOpacity',
        {
          testID: 'increment-button',
          onPress: () => setCount(prev => prev + 1)
        },
        React.createElement('Text', null, '+')
      ),
      React.createElement(
        'TouchableOpacity',
        {
          testID: 'decrement-button',
          onPress: () => setCount(prev => prev - 1)
        },
        React.createElement('Text', null, '-')
      ),
      React.createElement(
        'TouchableOpacity',
        {
          testID: 'reset-button',
          onPress: () => setCount(initialValue)
        },
        React.createElement('Text', null, 'Reset')
      )
    );
  };

  describe('Counter Component', () => {
    it('renders with initial value', () => {
      const tree = ReactTestRenderer.create(<Counter initialValue={5} />);
      const counterValue = tree.root.findByProps({ testID: 'counter-value' });
      expect(counterValue.children).toEqual(['5']);
    });

    it('increments counter when increment button is pressed', () => {
      const tree = ReactTestRenderer.create(<Counter />);
      const counterValue = tree.root.findByProps({ testID: 'counter-value' });
      const incrementButton = tree.root.findByProps({ testID: 'increment-button' });

      expect(counterValue.children).toEqual(['0']);

      ReactTestRenderer.act(() => {
        incrementButton.props.onPress();
      });

      expect(counterValue.children).toEqual(['1']);
    });

    it('decrements counter when decrement button is pressed', () => {
      const tree = ReactTestRenderer.create(<Counter initialValue={10} />);
      const counterValue = tree.root.findByProps({ testID: 'counter-value' });
      const decrementButton = tree.root.findByProps({ testID: 'decrement-button' });

      expect(counterValue.children).toEqual(['10']);

      ReactTestRenderer.act(() => {
        decrementButton.props.onPress();
      });

      expect(counterValue.children).toEqual(['9']);
    });

    it('resets counter to initial value when reset is pressed', () => {
      const tree = ReactTestRenderer.create(<Counter initialValue={5} />);
      const counterValue = tree.root.findByProps({ testID: 'counter-value' });
      const incrementButton = tree.root.findByProps({ testID: 'increment-button' });
      const resetButton = tree.root.findByProps({ testID: 'reset-button' });

      // Increment a few times
      ReactTestRenderer.act(() => {
        incrementButton.props.onPress();
        incrementButton.props.onPress();
      });

      expect(counterValue.children).toEqual(['7']);

      // Reset
      ReactTestRenderer.act(() => {
        resetButton.props.onPress();
      });

      expect(counterValue.children).toEqual(['5']);
    });
  });
});
