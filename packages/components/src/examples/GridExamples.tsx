import { Screen, View, Text, Card, Grid } from '../index';

export const GridExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View gap="xl">
        <Text typography="h4" align="center">
          Grid Examples
        </Text>

        {/* Fixed Columns */}
        <View gap="md">
          <Text typography="subtitle1">Fixed Columns</Text>
          <Grid columns={3} gap="md">
            {Array.from({ length: 6 }, (_, i) => (
              <Card key={i} type="outlined" padding="md">
                <Text weight="medium">Item {i + 1}</Text>
              </Card>
            ))}
          </Grid>
        </View>

        {/* Responsive Columns */}
        <View gap="md">
          <Text typography="subtitle1">Responsive Columns</Text>
          <Text typography="caption" color="secondary">
            1 col on mobile, 2 on tablet, 4 on desktop
          </Text>
          <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
            {Array.from({ length: 8 }, (_, i) => (
              <Card key={i} type="elevated" padding="md">
                <Text weight="medium">Card {i + 1}</Text>
                <Text typography="caption" color="secondary">Responsive</Text>
              </Card>
            ))}
          </Grid>
        </View>

        {/* Gap Variants */}
        <View gap="md">
          <Text typography="subtitle1">Gap Variants</Text>

          <Text typography="caption" color="secondary">gap="xs"</Text>
          <Grid columns={4} gap="xs">
            {Array.from({ length: 4 }, (_, i) => (
              <Card key={i} type="outlined" padding="sm">
                <Text typography="caption">XS</Text>
              </Card>
            ))}
          </Grid>

          <Text typography="caption" color="secondary">gap="md"</Text>
          <Grid columns={4} gap="md">
            {Array.from({ length: 4 }, (_, i) => (
              <Card key={i} type="outlined" padding="sm">
                <Text typography="caption">MD</Text>
              </Card>
            ))}
          </Grid>

          <Text typography="caption" color="secondary">gap="xl"</Text>
          <Grid columns={4} gap="xl">
            {Array.from({ length: 4 }, (_, i) => (
              <Card key={i} type="outlined" padding="sm">
                <Text typography="caption">XL</Text>
              </Card>
            ))}
          </Grid>
        </View>

        {/* Dashboard Layout */}
        <View gap="md">
          <Text typography="subtitle1">Dashboard Layout</Text>
          <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap="md">
            <Card type="elevated" padding="md">
              <Text typography="caption" color="secondary">Revenue</Text>
              <Text typography="h3" weight="bold">$12,345</Text>
            </Card>
            <Card type="elevated" padding="md">
              <Text typography="caption" color="secondary">Users</Text>
              <Text typography="h3" weight="bold">1,234</Text>
            </Card>
            <Card type="elevated" padding="md">
              <Text typography="caption" color="secondary">Orders</Text>
              <Text typography="h3" weight="bold">567</Text>
            </Card>
            <Card type="elevated" padding="md">
              <Text typography="caption" color="secondary">Growth</Text>
              <Text typography="h3" weight="bold">+12%</Text>
            </Card>
          </Grid>
        </View>

        {/* Grid with Padding */}
        <View gap="md">
          <Text typography="subtitle1">Grid with Padding</Text>
          <Grid columns={2} gap="sm" padding="lg">
            {Array.from({ length: 4 }, (_, i) => (
              <Card key={i} type="outlined" padding="md">
                <Text>Padded Item {i + 1}</Text>
              </Card>
            ))}
          </Grid>
        </View>
      </View>
    </Screen>
  );
};
