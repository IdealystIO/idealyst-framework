/**
 * Popover Component Examples
 *
 * These examples are type-checked against the actual PopoverProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Popover, View, Text, Button, Icon } from '@idealyst/components';

// Example 1: Basic Popover
export function BasicPopover() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  return (
    <View spacing="md">
      <Button ref={anchorRef} onPress={() => setOpen(true)}>
        Open Popover
      </Button>
      <Popover open={open} onOpenChange={setOpen} anchor={anchorRef}>
        <View spacing="md" background="surface.primary" radius="md">
          <Text>This is a basic popover content</Text>
        </View>
      </Popover>
    </View>
  );
}

// Example 2: Popover Placements
export function PopoverPlacements() {
  const [placement, setPlacement] = React.useState<
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'
  >('bottom');
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  return (
    <View spacing="lg">
      <View spacing="sm">
        <Button size="sm" onPress={() => { setPlacement('top'); setOpen(true); }}>
          Top
        </Button>
        <Button size="sm" onPress={() => { setPlacement('bottom'); setOpen(true); }}>
          Bottom
        </Button>
        <Button size="sm" onPress={() => { setPlacement('left'); setOpen(true); }}>
          Left
        </Button>
        <Button size="sm" onPress={() => { setPlacement('right'); setOpen(true); }}>
          Right
        </Button>
      </View>
      <Button ref={anchorRef}>Anchor Element</Button>
      <Popover open={open} onOpenChange={setOpen} anchor={anchorRef} placement={placement}>
        <View spacing="md" background="surface.primary" radius="md">
          <Text>Popover at {placement}</Text>
        </View>
      </Popover>
    </View>
  );
}

// Example 3: Popover with Arrow
export function PopoverWithArrow() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  return (
    <View spacing="md">
      <Button ref={anchorRef} onPress={() => setOpen(true)}>
        Open Popover with Arrow
      </Button>
      <Popover open={open} onOpenChange={setOpen} anchor={anchorRef} showArrow>
        <View spacing="md" background="surface.primary" radius="md">
          <Text>This popover has an arrow pointing to the anchor</Text>
        </View>
      </Popover>
    </View>
  );
}

// Example 4: Popover with Offset
export function PopoverWithOffset() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  return (
    <View spacing="md">
      <Button ref={anchorRef} onPress={() => setOpen(true)}>
        Open Popover
      </Button>
      <Popover open={open} onOpenChange={setOpen} anchor={anchorRef} offset={20} showArrow>
        <View spacing="md" background="surface.primary" radius="md">
          <Text>This popover has 20px offset from anchor</Text>
        </View>
      </Popover>
    </View>
  );
}

// Example 5: Popover with Close Behaviors
export function PopoverWithCloseBehaviors() {
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const anchor1Ref = React.useRef(null);
  const anchor2Ref = React.useRef(null);

  return (
    <View spacing="lg">
      <View spacing="md">
        <Text weight="semibold">Closes on outside click</Text>
        <Button ref={anchor1Ref} onPress={() => setOpen1(true)}>
          Open Popover
        </Button>
        <Popover
          open={open1}
          onOpenChange={setOpen1}
          anchor={anchor1Ref}
          closeOnClickOutside
        >
          <View spacing="md" background="surface.primary" radius="md">
            <Text>Click outside to close</Text>
          </View>
        </Popover>
      </View>

      <View spacing="md">
        <Text weight="semibold">Stays open on outside click</Text>
        <Button ref={anchor2Ref} onPress={() => setOpen2(true)}>
          Open Popover
        </Button>
        <Popover
          open={open2}
          onOpenChange={setOpen2}
          anchor={anchor2Ref}
          closeOnClickOutside={false}
        >
          <View spacing="md" background="surface.primary" radius="md">
            <Text>Use close button</Text>
            <Button size="sm" onPress={() => setOpen2(false)}>
              Close
            </Button>
          </View>
        </Popover>
      </View>
    </View>
  );
}

// Example 6: Popover with Form
export function PopoverWithForm() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const anchorRef = React.useRef(null);

  const handleSubmit = () => {
    console.log('Submitted:', { name, email });
    setOpen(false);
  };

  return (
    <View spacing="md">
      <Button ref={anchorRef} onPress={() => setOpen(true)}>
        Quick Add User
      </Button>
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchor={anchorRef}
        placement="bottom-start"
        closeOnClickOutside={false}
      >
        <View spacing="lg" background="surface.primary" radius="md">
          <Text weight="bold">Add New User</Text>
          <View spacing="sm">
            <Text size="sm">Name (placeholder for input)</Text>
            <Text size="sm">Email (placeholder for input)</Text>
          </View>
          <View spacing="sm">
            <Button size="sm" onPress={handleSubmit}>
              Add
            </Button>
            <Button size="sm" type="outlined" onPress={() => setOpen(false)}>
              Cancel
            </Button>
          </View>
        </View>
      </Popover>
    </View>
  );
}

// Example 7: Popover with Rich Content
export function PopoverWithRichContent() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  return (
    <View spacing="md">
      <Button ref={anchorRef} onPress={() => setOpen(true)}>
        View Profile
      </Button>
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchor={anchorRef}
        placement="bottom-start"
        showArrow
      >
        <View spacing="md" background="surface.primary" radius="lg">
          <View spacing="sm">
            <Text size="lg" weight="bold">
              John Doe
            </Text>
            <Text size="sm" color="gray.600">
              @johndoe
            </Text>
          </View>
          <View spacing="xs">
            <Text size="sm">Software Engineer at Tech Corp</Text>
            <Text size="sm" color="gray.600">
              San Francisco, CA
            </Text>
          </View>
          <View spacing="sm">
            <Text size="sm" weight="semibold">
              Bio
            </Text>
            <Text size="sm">
              Passionate about building great products and writing clean code.
            </Text>
          </View>
          <Button size="sm">View Full Profile</Button>
        </View>
      </Popover>
    </View>
  );
}

// Example 8: Popover Menu
export function PopoverMenu() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const menuItems = [
    { icon: 'pencil', label: 'Edit', onClick: () => console.log('Edit') },
    { icon: 'content-copy', label: 'Duplicate', onClick: () => console.log('Duplicate') },
    { icon: 'share', label: 'Share', onClick: () => console.log('Share') },
    { icon: 'delete', label: 'Delete', onClick: () => console.log('Delete') },
  ];

  return (
    <View spacing="md">
      <Button ref={anchorRef} type="outlined" onPress={() => setOpen(true)}>
        <Icon name="dots-vertical" />
      </Button>
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchor={anchorRef}
        placement="bottom-end"
        closeOnClickOutside
      >
        <View spacing="none" background="surface.primary" radius="md">
          {menuItems.map((item, index) => (
            <View
              key={index}
              spacing="sm"
              style={{ cursor: 'pointer' }}
              onPress={() => {
                item.onClick();
                setOpen(false);
              }}
            >
              <Icon name={item.icon} size="sm" />
              <Text size="sm">{item.label}</Text>
            </View>
          ))}
        </View>
      </Popover>
    </View>
  );
}

// Example 9: Color Picker Popover
export function ColorPickerPopover() {
  const [open, setOpen] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState('#3b82f6');
  const anchorRef = React.useRef(null);

  const colors = [
    '#ef4444',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#6b7280',
  ];

  return (
    <View spacing="md">
      <Button
        ref={anchorRef}
        onPress={() => setOpen(true)}
        style={{ backgroundColor: selectedColor }}
      >
        Pick Color
      </Button>
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchor={anchorRef}
        placement="bottom"
        closeOnClickOutside
      >
        <View spacing="md" background="surface.primary" radius="md">
          <Text weight="semibold">Choose a color</Text>
          <View spacing="sm">
            {colors.map((color) => (
              <View
                key={color}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: color,
                  borderRadius: 8,
                  cursor: 'pointer',
                  border: selectedColor === color ? '2px solid black' : 'none',
                }}
                onPress={() => {
                  setSelectedColor(color);
                  setOpen(false);
                }}
              />
            ))}
          </View>
        </View>
      </Popover>
    </View>
  );
}

// Example 10: Info Popover
export function InfoPopover() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  return (
    <View spacing="md">
      <View spacing="sm">
        <Text>Account Status</Text>
        <Icon
          ref={anchorRef}
          name="information"
          size="sm"
          color="blue.500"
          style={{ cursor: 'pointer' }}
          onPress={() => setOpen(true)}
        />
      </View>
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchor={anchorRef}
        placement="right"
        showArrow
        offset={8}
      >
        <View spacing="sm" background="surface.primary" radius="md">
          <Text weight="semibold" size="sm">
            What does this mean?
          </Text>
          <Text size="sm">
            Your account status determines which features you have access to. Active accounts have
            full access to all features.
          </Text>
        </View>
      </Popover>
    </View>
  );
}

// Example 11: Share Popover
export function SharePopover() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  return (
    <View spacing="md">
      <Button ref={anchorRef} type="outlined" onPress={() => setOpen(true)}>
        <Icon name="share" />
        Share
      </Button>
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchor={anchorRef}
        placement="bottom"
        showArrow
      >
        <View spacing="md" background="surface.primary" radius="md">
          <Text weight="bold">Share this content</Text>
          <View spacing="sm">
            <Button size="sm" type="outlined">
              <Icon name="facebook" size="sm" />
              Facebook
            </Button>
            <Button size="sm" type="outlined">
              <Icon name="twitter" size="sm" />
              Twitter
            </Button>
            <Button size="sm" type="outlined">
              <Icon name="linkedin" size="sm" />
              LinkedIn
            </Button>
            <Button size="sm" type="outlined">
              <Icon name="email" size="sm" />
              Email
            </Button>
          </View>
        </View>
      </Popover>
    </View>
  );
}
