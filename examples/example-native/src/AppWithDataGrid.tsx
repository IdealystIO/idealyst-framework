import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExampleStackRouter } from '@idealyst/navigation/examples';
import { NavigatorProvider } from '@idealyst/navigation';
import { DataGridShowcase } from './DataGridShowcase';
import { View, Button, Text, Screen } from '@idealyst/components';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: any) {
  return (
    <Screen background="primary" safeArea padding>
      <View spacing="lg">
        <Text size="xlarge" weight="bold">Example App</Text>
        
        <Button 
          onPress={() => navigation.navigate('Components')}
          variant="contained"
        >
          Component Examples
        </Button>
        
        <Button 
          onPress={() => navigation.navigate('DataGrid')}
          variant="contained"
          intent="primary"
        >
          DataGrid Showcase
        </Button>
      </View>
    </Screen>
  );
}

function ComponentExamples() {
  return <NavigatorProvider route={ExampleStackRouter} />;
}

export default function AppWithDataGrid() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Idealyst Examples' }}
        />
        <Stack.Screen 
          name="Components" 
          component={ComponentExamples}
          options={{ title: 'Component Examples' }}
        />
        <Stack.Screen 
          name="DataGrid" 
          component={DataGridShowcase}
          options={{ title: 'DataGrid Showcase' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}