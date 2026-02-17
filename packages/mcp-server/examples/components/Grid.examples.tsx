/**
 * Grid Component Examples
 *
 * These examples are type-checked against the actual GridProps interface
 * to ensure accuracy and correctness.
 */

import { Grid, Card, Text, View } from '@idealyst/components';

// Example 1: Basic Grid
export function BasicGrid() {
  return (
    <Grid columns={2} gap="md">
      <Card><Text>Item 1</Text></Card>
      <Card><Text>Item 2</Text></Card>
      <Card><Text>Item 3</Text></Card>
      <Card><Text>Item 4</Text></Card>
    </Grid>
  );
}

// Example 2: Responsive Columns
export function ResponsiveGrid() {
  return (
    <Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="md">
      <Card padding="md"><Text>Item 1</Text></Card>
      <Card padding="md"><Text>Item 2</Text></Card>
      <Card padding="md"><Text>Item 3</Text></Card>
      <Card padding="md"><Text>Item 4</Text></Card>
      <Card padding="md"><Text>Item 5</Text></Card>
      <Card padding="md"><Text>Item 6</Text></Card>
    </Grid>
  );
}

// Example 3: Gap Variants
export function GridGapVariants() {
  return (
    <>
      <Grid columns={3} gap="xs">
        <Card><Text>XS Gap</Text></Card>
        <Card><Text>XS Gap</Text></Card>
        <Card><Text>XS Gap</Text></Card>
      </Grid>
      <Grid columns={3} gap="md">
        <Card><Text>MD Gap</Text></Card>
        <Card><Text>MD Gap</Text></Card>
        <Card><Text>MD Gap</Text></Card>
      </Grid>
      <Grid columns={3} gap="xl">
        <Card><Text>XL Gap</Text></Card>
        <Card><Text>XL Gap</Text></Card>
        <Card><Text>XL Gap</Text></Card>
      </Grid>
    </>
  );
}

// Example 4: Grid with Padding
export function GridWithPadding() {
  return (
    <Grid columns={2} gap="sm" padding="lg">
      <Card type="outlined"><Text>Padded Grid Item 1</Text></Card>
      <Card type="outlined"><Text>Padded Grid Item 2</Text></Card>
      <Card type="outlined"><Text>Padded Grid Item 3</Text></Card>
      <Card type="outlined"><Text>Padded Grid Item 4</Text></Card>
    </Grid>
  );
}

// Example 5: Dashboard Layout
export function DashboardLayout() {
  return (
    <View gap="md">
      <Text typography="h2">Dashboard</Text>
      <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap="md">
        <Card type="elevated" padding="md">
          <Text typography="h3">Revenue</Text>
          <Text typography="h1">$12,345</Text>
        </Card>
        <Card type="elevated" padding="md">
          <Text typography="h3">Users</Text>
          <Text typography="h1">1,234</Text>
        </Card>
        <Card type="elevated" padding="md">
          <Text typography="h3">Orders</Text>
          <Text typography="h1">567</Text>
        </Card>
        <Card type="elevated" padding="md">
          <Text typography="h3">Growth</Text>
          <Text typography="h1">+12%</Text>
        </Card>
      </Grid>
    </View>
  );
}
