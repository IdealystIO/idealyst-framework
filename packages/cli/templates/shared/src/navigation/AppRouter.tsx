import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Icon,
  Progress,
  Screen,
  Slider,
  Switch,
  Text,
  View,
} from "@idealyst/components";
import { NavigatorParam } from "@idealyst/navigation";
import { useState } from "react";
import { HelloWorld } from "../components/HelloWorld";

// Dashboard Screen - Overview with stats and quick info
const DashboardScreen = () => {
  const [progress] = useState(68);

  return (
    <Screen>
      <View spacing="lg">
        <View spacing="sm">
          <Text size="xl" weight="bold">
            Dashboard
          </Text>
          <Text size="md" style={{ opacity: 0.7 }}>
            Idealyst Framework Showcase
          </Text>
        </View>

        {/* Stats Cards */}
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            flexWrap: "wrap",
            marginTop: 16,
          }}
        >
          <Card type="elevated" style={{ flex: 1, minWidth: 150, padding: 16 }}>
            <View spacing="sm">
              <Icon name="toy-brick" size="lg" />
              <Text size="xl" weight="bold">
                34
              </Text>
              <Text size="sm" style={{ opacity: 0.7 }}>
                Components
              </Text>
            </View>
          </Card>

          <Card type="elevated" style={{ flex: 1, minWidth: 150, padding: 16 }}>
            <View spacing="sm">
              <Icon name="palette" size="lg" />
              <Text size="xl" weight="bold">
                5
              </Text>
              <Text size="sm" style={{ opacity: 0.7 }}>
                Intent Colors
              </Text>
            </View>
          </Card>

          <Card type="elevated" style={{ flex: 1, minWidth: 150, padding: 16 }}>
            <View spacing="sm">
              <Icon name="devices" size="lg" />
              <Text size="xl" weight="bold">
                2
              </Text>
              <Text size="sm" style={{ opacity: 0.7 }}>
                Platforms
              </Text>
            </View>
          </Card>
        </View>

        {/* Progress Section */}
        <Card type="outlined" style={{ marginTop: 16, padding: 16 }}>
          <View spacing="md">
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text size="lg" weight="semibold">
                Framework Adoption
              </Text>
              <Badge type="filled" color="green">
                Active
              </Badge>
            </View>
            <Progress value={progress} variant="linear" intent="primary" showLabel />
            <Text size="sm" style={{ opacity: 0.7 }}>
              You're making great progress exploring the framework!
            </Text>
          </View>
        </Card>

        {/* Quick Info Alert */}
        <Alert
          intent="info"
          title="Welcome to Idealyst"
          message="This showcase demonstrates drawer navigation and various components from the framework. Explore the different screens using the drawer menu."
          type="soft"
        />
      </View>
    </Screen>
  );
};

// Component Gallery - Showcase UI components
const ComponentGalleryScreen = () => {
  return (
    <Screen>
      <View spacing="lg">
        <View spacing="sm">
          <Text size="xl" weight="bold">
            Component Gallery
          </Text>
          <Text size="md" style={{ opacity: 0.7 }}>
            Explore various UI components
          </Text>
        </View>

        {/* Avatars Section */}
        <Card type="outlined" style={{ marginTop: 16, padding: 16 }}>
          <View spacing="md">
            <Text size="lg" weight="semibold">
              Avatars
            </Text>
            <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
              <Avatar fallback="JD" size="sm" shape="circle" color="blue" />
              <Avatar fallback="AS" size="md" shape="circle" color="purple" />
              <Avatar fallback="MK" size="lg" shape="circle" color="green" />
              <Avatar fallback="RC" size="xl" shape="circle" color="orange" />
            </View>
          </View>
        </Card>

        {/* Badges & Chips */}
        <Card type="outlined" style={{ marginTop: 16, padding: 16 }}>
          <View spacing="md">
            <Text size="lg" weight="semibold">
              Badges & Chips
            </Text>
            <View spacing="sm">
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                <Badge type="filled" color="red">
                  5
                </Badge>
                <Badge type="filled" color="blue">
                  New
                </Badge>
                <Badge type="outlined" color="green">
                  Active
                </Badge>
                <Badge type="dot" color="orange" />
              </View>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                <Chip label="React" />
                <Chip label="React Native" />
                <Chip label="TypeScript" />
                <Chip label="Cross-platform" />
              </View>
            </View>
          </View>
        </Card>

        {/* Buttons */}
        <Card type="outlined" style={{ marginTop: 16, padding: 16 }}>
          <View spacing="md">
            <Text size="lg" weight="semibold">
              Buttons
            </Text>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                <Button type="contained" intent="primary" leftIcon="check">
                  Primary
                </Button>
                <Button type="outlined" intent="neutral" leftIcon="heart">
                  Neutral
                </Button>
                <Button type="text" intent="error" leftIcon="delete">
                  Delete
                </Button>
              </View>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                <Button type="contained" intent="success" size="sm">
                  Success
                </Button>
                <Button type="contained" intent="warning" size="md">
                  Warning
                </Button>
                <Button type="contained" intent="error" size="lg">
                  Error
                </Button>
              </View>
            </View>
          </View>
        </Card>

        {/* Accordion */}
        <Accordion
          type="bordered"
          items={[
            {
              id: "1",
              title: "What is Idealyst?",
              content: (
                <Text size="sm">
                  Idealyst is a cross-platform React framework with 34+ components,
                  built for both web and mobile applications.
                </Text>
              ),
            },
            {
              id: "2",
              title: "Key Features",
              content: (
                <View spacing="sm">
                  <Text size="sm">• Cross-platform (React & React Native)</Text>
                  <Text size="sm">• 7,447+ Material Design Icons</Text>
                  <Text size="sm">• Consistent API patterns</Text>
                  <Text size="sm">• Built-in theming system</Text>
                </View>
              ),
            },
          ]}
          defaultExpanded={["1"]}
        />
      </View>
    </Screen>
  );
};

// Interactive Demo - Forms and interactive elements
const InteractiveDemoScreen = () => {
  const [switchValue, setSwitchValue] = useState(true);
  const [sliderValue, setSliderValue] = useState(50);
  const [loading, setLoading] = useState(false);

  const handleAction = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Screen>
      <View spacing="lg">
        <View spacing="sm">
          <Text size="xl" weight="bold">
            Interactive Demo
          </Text>
          <Text size="md" style={{ opacity: 0.7 }}>
            Try out interactive components
          </Text>
        </View>

        {/* Switch Control */}
        <Card type="outlined" style={{ marginTop: 16, padding: 16 }}>
          <View spacing="md">
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View spacing="xs" style={{ flex: 1 }}>
                <Text size="md" weight="semibold">
                  Enable Notifications
                </Text>
                <Text size="sm" style={{ opacity: 0.7 }}>
                  Receive updates and alerts
                </Text>
              </View>
              <Switch checked={switchValue} onCheckedChange={setSwitchValue} />
            </View>
          </View>
        </Card>

        {/* Slider Control */}
        <Card type="outlined" style={{ marginTop: 16, padding: 16 }}>
          <View spacing="md">
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text size="md" weight="semibold">
                Volume
              </Text>
              <Badge type="filled" color="blue">
                {sliderValue}%
              </Badge>
            </View>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              min={0}
              max={100}
            />
          </View>
        </Card>

        {/* Action Buttons */}
        <Card type="outlined" style={{ marginTop: 16, padding: 16 }}>
          <View spacing="md">
            <Text size="md" weight="semibold">
              Actions
            </Text>
            <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
              <Button
                type="contained"
                intent="primary"
                leftIcon="rocket"
                onPress={handleAction}
              >
                Launch
              </Button>
              <Button type="outlined" intent="neutral" leftIcon="refresh">
                Refresh
              </Button>
              <Button type="text" intent="error" leftIcon="close">
                Cancel
              </Button>
            </View>
          </View>
        </Card>

        {/* Status Alerts */}
        <View spacing="sm" style={{ marginTop: 16 }}>
          <Alert
            intent="success"
            title="Success"
            message="Your changes have been saved successfully."
            type="soft"
          />
          <Alert
            intent="warning"
            title="Warning"
            message="Please review your settings before continuing."
            type="outlined"
          />
        </View>
      </View>
    </Screen>
  );
};

// Theme Showcase - Different variants and intents
const ThemeShowcaseScreen = () => {
  return (
    <Screen>
      <View spacing="lg">
        <View spacing="sm">
          <Text size="xl" weight="bold">
            Theme Showcase
          </Text>
          <Text size="md" style={{ opacity: 0.7 }}>
            Explore variants and intent colors
          </Text>
        </View>

        {/* Card Variants */}
        <View spacing="sm" style={{ marginTop: 16 }}>
          <Text size="lg" weight="semibold">
            Card Variants
          </Text>
          <Card type="default" style={{ padding: 16 }}>
            <Text weight="semibold">Default Card</Text>
            <Text size="sm" style={{ opacity: 0.7 }}>
              Standard card with minimal styling
            </Text>
          </Card>
          <Card type="outlined" style={{ padding: 16 }}>
            <Text weight="semibold">Outlined Card</Text>
            <Text size="sm" style={{ opacity: 0.7 }}>
              Card with visible border
            </Text>
          </Card>
          <Card type="elevated" style={{ padding: 16 }}>
            <Text weight="semibold">Elevated Card</Text>
            <Text size="sm" style={{ opacity: 0.7 }}>
              Card with shadow elevation
            </Text>
          </Card>
          <Card type="filled" style={{ padding: 16 }}>
            <Text weight="semibold">Filled Card</Text>
            <Text size="sm" style={{ opacity: 0.7 }}>
              Card with background fill
            </Text>
          </Card>
        </View>

        {/* Intent Colors */}
        <View spacing="sm" style={{ marginTop: 16 }}>
          <Text size="lg" weight="semibold">
            Intent Colors
          </Text>
          <View style={{ gap: 12 }}>
            <Button type="contained" intent="primary">
              Primary Intent
            </Button>
            <Button type="contained" intent="neutral">
              Neutral Intent
            </Button>
            <Button type="contained" intent="success">
              Success Intent
            </Button>
            <Button type="contained" intent="warning">
              Warning Intent
            </Button>
            <Button type="contained" intent="error">
              Error Intent
            </Button>
          </View>
        </View>

        {/* Progress Indicators */}
        <Card type="outlined" style={{ marginTop: 16, padding: 16 }}>
          <View spacing="md">
            <Text size="lg" weight="semibold">
              Progress Indicators
            </Text>
            <View spacing="sm">
              <Progress value={80} variant="linear" intent="primary" showLabel />
              <Progress value={60} variant="linear" intent="success" showLabel />
              <Progress value={40} variant="linear" intent="warning" showLabel />
              <Progress value={20} variant="linear" intent="error" showLabel />
            </View>
          </View>
        </Card>
      </View>
    </Screen>
  );
};

// API Integration - HelloWorld component showcase
const APIIntegrationScreen = () => (
  <Screen>
    <View spacing="lg">
      <View spacing="sm">
        <Text size="xl" weight="bold">
          API Integration
        </Text>
        <Text size="md" style={{ opacity: 0.7 }}>
          RPC communication example
        </Text>
      </View>

      <Card type="outlined" style={{ marginTop: 16, padding: 16 }}>
        <View spacing="md">
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Icon name="api" size="md" />
            <Text size="lg" weight="semibold">
              Server Communication
            </Text>
          </View>
          <Text size="sm" style={{ opacity: 0.7 }}>
            This component demonstrates RPC integration between the client and server.
          </Text>
        </View>
      </Card>

      <HelloWorld name="Idealyst Framework" />

      <Alert
        intent="info"
        title="How it works"
        message="The HelloWorld component uses RPC to communicate with the backend server, showcasing the framework's built-in API integration capabilities."
        type="soft"
        style={{ marginTop: 16 }}
      />
    </View>
  </Screen>
);

const AppRouter: NavigatorParam = {
  type: "navigator",
  path: "/",
  layout: "drawer",
  routes: [
    {
      type: "screen",
      path: "/",
      component: DashboardScreen,
      options: {
        title: "Dashboard",
        tabBarLabel: "Dashboard",
        tabBarIcon: ({ focused }: { focused: boolean }) => (
          <Icon
            name="view-dashboard"
            color={focused ? "blue" : "gray"}
            size="md"
          />
        ),
      },
    },
    {
      type: "screen",
      path: "/gallery",
      component: ComponentGalleryScreen,
      options: {
        title: "Component Gallery",
        tabBarLabel: "Gallery",
        tabBarIcon: ({ focused }: { focused: boolean }) => (
          <Icon name="toy-brick" color={focused ? "blue" : "gray"} size="md" />
        ),
      },
    },
    {
      type: "screen",
      path: "/interactive",
      component: InteractiveDemoScreen,
      options: {
        title: "Interactive Demo",
        tabBarLabel: "Interactive",
        tabBarIcon: ({ focused }: { focused: boolean }) => (
          <Icon
            name="gesture-tap"
            color={focused ? "blue" : "gray"}
            size="md"
          />
        ),
      },
    },
    {
      type: "screen",
      path: "/theme",
      component: ThemeShowcaseScreen,
      options: {
        title: "Theme Showcase",
        tabBarLabel: "Themes",
        tabBarIcon: ({ focused }: { focused: boolean }) => (
          <Icon name="palette" color={focused ? "blue" : "gray"} size="md" />
        ),
      },
    },
    {
      type: "screen",
      path: "/api",
      component: APIIntegrationScreen,
      options: {
        title: "API Integration",
        tabBarLabel: "API",
        tabBarIcon: ({ focused }: { focused: boolean }) => (
          <Icon name="api" color={focused ? "blue" : "gray"} size="md" />
        ),
      },
    },
  ],
};

export default AppRouter;
