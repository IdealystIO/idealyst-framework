import React from 'react';
import { Screen, View, IconButton, Text } from '@idealyst/components';
import { useUnistyles } from 'react-native-unistyles';

export const IconButtonExamples = () => {
  const handlePress = (label: string) => {
    console.log(`IconButton pressed: ${label}`);
  };

  const { theme } = useUnistyles();

  return (
    <Screen background="primary">
      <View gap="xl">
        <Text typography="h4" align="center">
          IconButton Examples
        </Text>

        {/* Type Variants */}
        <View gap="md">
          <Text typography="subtitle1">Variants</Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <IconButton
              icon="heart"
              type="contained"
              intent="primary"
              onPress={() => handlePress('contained')}
            />
            <IconButton
              icon="heart"
              type="outlined"
              intent="primary"
              onPress={() => handlePress('outlined')}
            />
            <IconButton
              icon="heart"
              type="text"
              intent="primary"
              onPress={() => handlePress('text')}
            />
          </View>
        </View>

        {/* All Intents */}
        <View gap="md">
          <Text typography="subtitle1">All Intents</Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {(Object.keys(theme.intents) as Array<keyof typeof theme.intents>).map((intent) => (
              <IconButton
                key={intent}
                icon="star"
                type="contained"
                intent={intent}
                onPress={() => handlePress(`intent-${intent}`)}
              />
            ))}
          </View>
        </View>

        {/* Outlined Intents */}
        <View gap="md">
          <Text typography="subtitle1">Outlined Intents</Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <IconButton icon="information" type="outlined" intent="primary" onPress={() => handlePress('outlined-primary')} />
            <IconButton icon="check-circle" type="outlined" intent="success" onPress={() => handlePress('outlined-success')} />
            <IconButton icon="alert" type="outlined" intent="warning" onPress={() => handlePress('outlined-warning')} />
            <IconButton icon="alert-circle" type="outlined" intent="danger" onPress={() => handlePress('outlined-danger')} />
            <IconButton icon="cog" type="outlined" intent="neutral" onPress={() => handlePress('outlined-neutral')} />
          </View>
        </View>

        {/* Sizes */}
        <View gap="md">
          <Text typography="subtitle1">Sizes</Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <IconButton icon="plus" size="xs" type="contained" intent="primary" onPress={() => handlePress('xs')} />
            <IconButton icon="plus" size="sm" type="contained" intent="primary" onPress={() => handlePress('sm')} />
            <IconButton icon="plus" size="md" type="contained" intent="primary" onPress={() => handlePress('md')} />
            <IconButton icon="plus" size="lg" type="contained" intent="primary" onPress={() => handlePress('lg')} />
            <IconButton icon="plus" size="xl" type="contained" intent="primary" onPress={() => handlePress('xl')} />
          </View>
        </View>

        {/* Disabled States */}
        <View gap="md">
          <Text typography="subtitle1">Disabled States</Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <IconButton icon="pencil" type="contained" intent="primary" disabled onPress={() => handlePress('disabled-contained')} />
            <IconButton icon="pencil" type="outlined" intent="primary" disabled onPress={() => handlePress('disabled-outlined')} />
            <IconButton icon="pencil" type="text" intent="primary" disabled onPress={() => handlePress('disabled-text')} />
          </View>
        </View>

        {/* Gradient Overlay */}
        <View gap="md">
          <Text typography="subtitle1">Gradient Overlay</Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <IconButton icon="rocket-launch" type="contained" intent="primary" onPress={() => handlePress('no-gradient')} />
            <IconButton icon="rocket-launch" type="contained" intent="primary" gradient="darken" onPress={() => handlePress('gradient-darken')} />
            <IconButton icon="rocket-launch" type="contained" intent="primary" gradient="lighten" onPress={() => handlePress('gradient-lighten')} />
          </View>
        </View>

        {/* Gradient with Different Intents */}
        <View gap="md">
          <Text typography="subtitle1">Gradient Intents (Darken)</Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <IconButton icon="star" type="contained" intent="primary" gradient="darken" onPress={() => handlePress('gradient-primary')} />
            <IconButton icon="check" type="contained" intent="success" gradient="darken" onPress={() => handlePress('gradient-success')} />
            <IconButton icon="alert" type="contained" intent="warning" gradient="darken" onPress={() => handlePress('gradient-warning')} />
            <IconButton icon="close" type="contained" intent="danger" gradient="darken" onPress={() => handlePress('gradient-danger')} />
            <IconButton icon="cog" type="contained" intent="neutral" gradient="darken" onPress={() => handlePress('gradient-neutral')} />
          </View>
        </View>

        {/* Loading State */}
        <View gap="md">
          <Text typography="subtitle1">Loading State</Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <IconButton icon="refresh" type="contained" intent="primary" loading onPress={() => handlePress('loading-contained')} />
            <IconButton icon="refresh" type="outlined" intent="primary" loading onPress={() => handlePress('loading-outlined')} />
            <IconButton icon="refresh" type="text" intent="primary" loading onPress={() => handlePress('loading-text')} />
          </View>
        </View>

        {/* Interactive Loading */}
        <View gap="md">
          <Text typography="subtitle1">Interactive Loading</Text>
          <InteractiveLoadingIconButton />
        </View>

        {/* Common Use Cases */}
        <View gap="md">
          <Text typography="subtitle1">Common Use Cases</Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <IconButton icon="magnify" type="text" intent="neutral" onPress={() => handlePress('search')} />
            <IconButton icon="bell" type="text" intent="neutral" onPress={() => handlePress('notifications')} />
            <IconButton icon="cog" type="text" intent="neutral" onPress={() => handlePress('settings')} />
            <IconButton icon="dots-vertical" type="text" intent="neutral" onPress={() => handlePress('more')} />
            <IconButton icon="close" type="text" intent="neutral" onPress={() => handlePress('close')} />
            <IconButton icon="plus" type="contained" intent="primary" onPress={() => handlePress('add')} />
            <IconButton icon="delete" type="contained" intent="danger" onPress={() => handlePress('delete')} />
          </View>
        </View>
      </View>
    </Screen>
  );
};

const InteractiveLoadingIconButton = () => {
  const [loading, setLoading] = React.useState(false);

  const handlePress = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <IconButton
        icon="refresh"
        type="contained"
        intent="primary"
        loading={loading}
        onPress={handlePress}
      />
      <IconButton
        icon="download"
        type="outlined"
        intent="success"
        loading={loading}
        onPress={handlePress}
      />
    </View>
  );
};
