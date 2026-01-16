/**
 * Popover Component Examples
 *
 * These examples are type-checked against the actual PopoverProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Popover, View, Text, Button, Icon, Pressable, IdealystElement } from '@idealyst/components';

// Example 1: Basic Popover
export function BasicPopover() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<IdealystElement>(null);

  return (
    <View spacing="md">
      <Button ref={anchorRef} onPress={() => setOpen(true)}>
        Open Popover
      </Button>
      <Popover open={open} onOpenChange={setOpen} anchor={anchorRef}>
        <View spacing="md" background="primary" radius="md">
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
  const anchorRef = React.useRef<IdealystElement>(null);

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
        <View spacing="md" background="primary" radius="md">
          <Text>Popover at {placement}</Text>
        </View>
      </Popover>
    </View>
  );
}

// Example 3: Popover with Arrow
export function PopoverWithArrow() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<IdealystElement>(null);

  return (
    <View spacing="md">
      <Button ref={anchorRef} onPress={() => setOpen(true)}>
        Open Popover with Arrow
      </Button>
      <Popover open={open} onOpenChange={setOpen} anchor={anchorRef} showArrow>
        <View spacing="md" background="primary" radius="md">
          <Text>This popover has an arrow pointing to the anchor</Text>
        </View>
      </Popover>
    </View>
  );
}

// Example 4: Popover with Offset
export function PopoverWithOffset() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<IdealystElement>(null);

  return (
    <View spacing="md">
      <Button ref={anchorRef} onPress={() => setOpen(true)}>
        Open Popover
      </Button>
      <Popover open={open} onOpenChange={setOpen} anchor={anchorRef} offset={20} showArrow>
        <View spacing="md" background="primary" radius="md">
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
  const anchor1Ref = React.useRef<IdealystElement>(null);
  const anchor2Ref = React.useRef<IdealystElement>(null);

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
          <View spacing="md" background="primary" radius="md">
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
          <View spacing="md" background="primary" radius="md">
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
  const anchorRef = React.useRef<IdealystElement>(null);

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
        <View spacing="lg" background="primary" radius="md">
          <Text weight="bold">Add New User</Text>
          <View spacing="sm">
            <Text typography="body2">Name (placeholder for input)</Text>
            <Text typography="body2">Email (placeholder for input)</Text>
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
  const anchorRef = React.useRef<IdealystElement>(null);

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
        <View spacing="md" background="primary" radius="lg">
          <View spacing="sm">
            <Text typography="subtitle1" weight="bold">
              John Doe
            </Text>
            <Text typography="body2">
              @johndoe
            </Text>
          </View>
          <View spacing="xs">
            <Text typography="body2">Software Engineer at Tech Corp</Text>
            <Text typography="body2">
              San Francisco, CA
            </Text>
          </View>
          <View spacing="sm">
            <Text typography="body2" weight="semibold">
              Bio
            </Text>
            <Text typography="body2">
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
  const anchorRef = React.useRef<IdealystElement>(null);

  const menuItems = [
    { icon: 'pencil' as const, label: 'Edit', onClick: () => console.log('Edit') },
    { icon: 'content-copy' as const, label: 'Duplicate', onClick: () => console.log('Duplicate') },
    { icon: 'share' as const, label: 'Share', onClick: () => console.log('Share') },
    { icon: 'delete' as const, label: 'Delete', onClick: () => console.log('Delete') },
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
        <View spacing="none" background="primary" radius="md">
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              style={{ cursor: 'pointer', padding: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}
              onPress={() => {
                item.onClick();
                setOpen(false);
              }}
            >
              <Icon name={item.icon} size="sm" />
              <Text typography="body2">{item.label}</Text>
            </Pressable>
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
  const anchorRef = React.useRef<IdealystElement>(null);

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
        <View spacing="md" background="primary" radius="md">
          <Text weight="semibold">Choose a color</Text>
          <View spacing="sm" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {colors.map((color) => (
              <Pressable
                key={color}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: color,
                  borderRadius: 8,
                  cursor: 'pointer',
                  borderWidth: selectedColor === color ? 2 : 0,
                  borderColor: selectedColor === color ? 'black' : 'transparent',
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
  const anchorRef = React.useRef<IdealystElement>(null);

  return (
    <View spacing="md">
      <View spacing="sm" style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>Account Status</Text>
        <Pressable
          ref={anchorRef}
          style={{ cursor: 'pointer' }}
          onPress={() => setOpen(true)}
        >
          <Icon name="information" size="sm" />
        </Pressable>
      </View>
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchor={anchorRef}
        placement="right"
        showArrow
        offset={8}
      >
        <View spacing="sm" background="primary" radius="md">
          <Text weight="semibold" typography="body2">
            What does this mean?
          </Text>
          <Text typography="body2">
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
  const anchorRef = React.useRef<IdealystElement>(null);

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
        <View spacing="md" background="primary" radius="md">
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
