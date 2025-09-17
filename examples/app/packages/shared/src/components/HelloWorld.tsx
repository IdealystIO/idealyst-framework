import { Button, Card, Input, Screen, Text, View } from "@idealyst/components";
import { useState } from "react";
import { trpc } from "../trpc/client";

interface HelloWorldProps {
  name?: string;
  platform?: "web" | "mobile";
  projectName?: string;
}

export const HelloWorld = ({
  name = "World",
  platform = "web",
  projectName = "Your Project",
}: HelloWorldProps) => {
  const [newTestName, setNewTestName] = useState("");
  const [newTestMessage, setNewTestMessage] = useState("");

  // Use tRPC hooks directly
  const tests = trpc.test.getAll.useQuery({});
  const createTestMutation = trpc.test.create.useMutation({
    onSuccess: () => {
      tests.refetch();
      setNewTestName("");
      setNewTestMessage("");
    },
  });
  const deleteTestMutation = trpc.test.delete.useMutation({
    onSuccess: () => {
      tests.refetch();
    },
  });

  const handleCreateTest = async () => {
    if (!newTestName || !newTestMessage) return;

    await createTestMutation.mutateAsync({
      name: newTestName,
      message: newTestMessage,
      status: "active",
    });
  };

  const handleDeleteTest = async (id: string) => {
    await deleteTestMutation.mutateAsync({ id });
  };

  const platformEmoji = platform === "mobile" ? "📱" : "🌐";
  const platformText =
    platform === "mobile"
      ? "Your mobile development environment is ready. This shared component works seamlessly across mobile and web platforms."
      : "Your web development environment is ready. This shared component works seamlessly across web and mobile platforms.";

  return (
    <Screen style={{ flex: 1, padding: 20 }}>
      <View style={{ maxWidth: 600, alignSelf: "center" }}>
        <Text
          size="xlarge"
          weight="bold"
          style={{
            marginBottom: 16,
            textAlign: "center",
            color: "#1e293b",
          }}
        >
          Welcome to {projectName}! {platformEmoji}
        </Text>

        <Text
          size="large"
          style={{
            marginBottom: 32,
            textAlign: "center",
            color: "#64748b",
            lineHeight: 24,
            paddingHorizontal: 16,
          }}
        >
          {platformText}
        </Text>
        {/* Framework Branding Card */}
        <Card variant="elevated" padding="large" intent="primary">
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 32, marginBottom: 16 }}>🚀</Text>
            <Text
              size="xlarge"
              weight="bold"
              style={{ marginBottom: 8, textAlign: "center" }}
            >
              Idealyst Framework
            </Text>
            <Text
              size="medium"
              style={{ marginBottom: 16, textAlign: "center" }}
            >
              Hello, {name}! Welcome to your cross-platform workspace.
            </Text>

            {/* Technology Tags */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Card
                variant="filled"
                padding="small"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <Text size="small" weight="semibold">
                  React
                </Text>
              </Card>
              <Card
                variant="filled"
                padding="small"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <Text size="small" weight="semibold">
                  TypeScript
                </Text>
              </Card>
              <Card
                variant="filled"
                padding="small"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <Text size="small" weight="semibold">
                  Cross-Platform
                </Text>
              </Card>
            </View>
          </View>
        </Card>

        {/* Quick Start Guide Card */}
        <Card variant="outlined" padding="large" style={{ marginTop: 16 }}>
          <Text size="large" weight="bold" style={{ marginBottom: 16 }}>
            🎯 Quick Start Guide
          </Text>

          <View style={{ marginBottom: 16 }}>
            <Text size="medium" weight="semibold" style={{ marginBottom: 8 }}>
              Your Workspace Overview:
            </Text>
            <Text size="small" style={{ marginBottom: 4 }}>
              • <Text weight="semibold">packages/web/</Text> - React web
              application
            </Text>
            <Text size="small" style={{ marginBottom: 4 }}>
              • <Text weight="semibold">packages/mobile/</Text> - React Native
              mobile app
            </Text>
            <Text size="small" style={{ marginBottom: 4 }}>
              • <Text weight="semibold">packages/shared/</Text> - Cross-platform
              components
            </Text>
            <Text size="small" style={{ marginBottom: 4 }}>
              • <Text weight="semibold">packages/api/</Text> - tRPC API server
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text size="medium" weight="semibold" style={{ marginBottom: 8 }}>
              Try Editing:
            </Text>
            <Text size="small" style={{ marginBottom: 4 }}>
              1. Edit this component in{" "}
              <Text weight="semibold">
                packages/shared/src/components/HelloWorld.tsx
              </Text>
            </Text>
            <Text size="small" style={{ marginBottom: 4 }}>
              2. Watch changes appear in both web and mobile apps instantly!
            </Text>
            <Text size="small" style={{ marginBottom: 4 }}>
              3. Run <Text weight="semibold">yarn dev</Text> to start all
              development servers
            </Text>
          </View>

          <Card variant="filled" intent="success" padding="medium">
            <Text size="small" weight="semibold" style={{ marginBottom: 4 }}>
              ✨ Framework Features:
            </Text>
            <Text size="small">
              Shared components • Type safety • Hot reload • Cross-platform
              compatibility
            </Text>
          </Card>
        </Card>

        {/* API Testing Section */}
        <Card variant="outlined" padding="large" style={{ marginTop: 16 }}>
          <Text size="large" weight="bold" style={{ marginBottom: 16 }}>
            🚀 API Demo - Database Integration
          </Text>
          <Text size="medium" style={{ marginBottom: 16, color: "#64748b" }}>
            Test your full-stack integration! This section demonstrates
            real-time database operations.
          </Text>

          {/* Create New Test Form */}
          <Card
            variant="filled"
            padding="medium"
            style={{ marginBottom: 16, backgroundColor: "#f8fafc" }}
          >
            <Text size="medium" weight="semibold" style={{ marginBottom: 12 }}>
              Create New Test Entry
            </Text>

            <View style={{ gap: 12 }}>
              <Input
                placeholder="Test name"
                value={newTestName}
                onChangeText={setNewTestName}
              />
              <Input
                placeholder="Test message"
                value={newTestMessage}
                onChangeText={setNewTestMessage}
              />
              <Button
                onPress={handleCreateTest}
                disabled={
                  !newTestName ||
                  !newTestMessage ||
                  createTestMutation.isLoading
                }
                style={{ alignSelf: "flex-start" }}
              >
                {createTestMutation.isLoading ? "Creating..." : "Create Test"}
              </Button>
            </View>
          </Card>

          {/* Tests List */}
          <View>
            <Text size="medium" weight="semibold" style={{ marginBottom: 12 }}>
              Database Records ({tests.data?.length || 0})
            </Text>

            {tests.isLoading ? (
              <Card variant="outlined" padding="medium">
                <Text size="small" style={{ color: "#64748b" }}>
                  Loading tests...
                </Text>
              </Card>
            ) : tests.data?.length === 0 ? (
              <Card variant="outlined" padding="medium">
                <Text size="small" style={{ color: "#64748b" }}>
                  No tests found. Create one above!
                </Text>
              </Card>
            ) : (
              <View style={{ gap: 8 }}>
                {tests.data?.map((test: any) => (
                  <Card key={test.id} variant="outlined" padding="medium">
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          size="small"
                          weight="semibold"
                          style={{ marginBottom: 4 }}
                        >
                          {test.name}
                        </Text>
                        <Text
                          size="small"
                          style={{ color: "#64748b", marginBottom: 4 }}
                        >
                          {test.message}
                        </Text>
                        <Text size="small" style={{ color: "#10b981" }}>
                          Status: {test.status} •{" "}
                          {new Date(test.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <Button
                        variant="destructive"
                        size="small"
                        onPress={() => handleDeleteTest(test.id)}
                        disabled={deleteTestMutation.isLoading}
                      >
                        Delete
                      </Button>
                    </View>
                  </Card>
                ))}
              </View>
            )}
          </View>
        </Card>
      </View>
    </Screen>
  );
};
