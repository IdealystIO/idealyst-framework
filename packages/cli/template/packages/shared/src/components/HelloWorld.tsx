import { Button, Card, Input, Screen, Text, View } from "@idealyst/components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getGraphQLClient, gql } from "../graphql/client";
import { trpc } from "../trpc/client";

// GraphQL queries and mutations
const TESTS_QUERY = gql`
  query GetTests($take: Int, $skip: Int) {
    tests(take: $take, skip: $skip) {
      id
      name
      message
      status
      createdAt
    }
  }
`;

const CREATE_TEST_MUTATION = gql`
  mutation CreateTest($input: CreateTestInput!) {
    createTest(input: $input) {
      id
      name
      message
      status
      createdAt
    }
  }
`;

const DELETE_TEST_MUTATION = gql`
  mutation DeleteTest($id: String!) {
    deleteTest(id: $id) {
      id
    }
  }
`;

interface HelloWorldProps {
  name?: string;
  platform?: "web" | "mobile";
  projectName?: string;
}

// Type for test records
interface TestRecord {
  id: string;
  name: string;
  message: string;
  status: string;
  createdAt: string;
}

export const HelloWorld = ({
  name = "World",
  platform = "web",
  projectName = "Your Project",
}: HelloWorldProps) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"trpc" | "graphql">("trpc");

  // tRPC state
  const [trpcTestName, setTrpcTestName] = useState("");
  const [trpcTestMessage, setTrpcTestMessage] = useState("");

  // GraphQL state
  const [gqlTestName, setGqlTestName] = useState("");
  const [gqlTestMessage, setGqlTestMessage] = useState("");

  // ========== tRPC Hooks ==========
  const trpcTests = trpc.test.getAll.useQuery({});
  const trpcCreateMutation = trpc.test.create.useMutation({
    onSuccess: () => {
      trpcTests.refetch();
      setTrpcTestName("");
      setTrpcTestMessage("");
    },
  });
  const trpcDeleteMutation = trpc.test.delete.useMutation({
    onSuccess: () => {
      trpcTests.refetch();
    },
  });

  // ========== GraphQL Hooks (with React Query) ==========
  const gqlTests = useQuery<{ tests: TestRecord[] }>({
    queryKey: ["graphql", "tests"],
    queryFn: async () => {
      const client = getGraphQLClient();
      return client.request(TESTS_QUERY, { take: 10 });
    },
  });

  const gqlCreateMutation = useMutation({
    mutationFn: async (data: { name: string; message: string; status: string }) => {
      const client = getGraphQLClient();
      return client.request(CREATE_TEST_MUTATION, { input: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graphql", "tests"] });
      setGqlTestName("");
      setGqlTestMessage("");
    },
  });

  const gqlDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const client = getGraphQLClient();
      return client.request(DELETE_TEST_MUTATION, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graphql", "tests"] });
    },
  });

  // ========== Handlers ==========
  const handleTrpcCreate = async () => {
    if (!trpcTestName || !trpcTestMessage) return;
    await trpcCreateMutation.mutateAsync({
      name: trpcTestName,
      message: trpcTestMessage,
      status: "active",
    });
  };

  const handleTrpcDelete = async (id: string) => {
    await trpcDeleteMutation.mutateAsync({ id });
  };

  const handleGqlCreate = async () => {
    if (!gqlTestName || !gqlTestMessage) return;
    await gqlCreateMutation.mutateAsync({
      name: gqlTestName,
      message: gqlTestMessage,
      status: "active",
    });
  };

  const handleGqlDelete = async (id: string) => {
    await gqlDeleteMutation.mutateAsync(id);
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
          size="xl"
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
          size="lg"
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
        <Card type="elevated" padding="lg" intent="primary">
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 32, marginBottom: 16 }}>🚀</Text>
            <Text
              size="xl"
              weight="bold"
              style={{ marginBottom: 8, textAlign: "center" }}
            >
              Idealyst Framework
            </Text>
            <Text size="md" style={{ marginBottom: 16, textAlign: "center" }}>
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
                type="filled"
                padding="sm"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <Text size="sm" weight="semibold">
                  React
                </Text>
              </Card>
              <Card
                type="filled"
                padding="sm"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <Text size="sm" weight="semibold">
                  TypeScript
                </Text>
              </Card>
              <Card
                type="filled"
                padding="sm"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <Text size="sm" weight="semibold">
                  Cross-Platform
                </Text>
              </Card>
            </View>
          </View>
        </Card>

        {/* Quick Start Guide Card */}
        <Card type="outlined" padding="lg" style={{ marginTop: 16 }}>
          <Text size="lg" weight="bold" style={{ marginBottom: 16 }}>
            🎯 Quick Start Guide
          </Text>

          <View style={{ marginBottom: 16 }}>
            <Text size="md" weight="semibold" style={{ marginBottom: 8 }}>
              Your Workspace Overview:
            </Text>
            <Text size="sm" style={{ marginBottom: 4 }}>
              • <Text weight="semibold">packages/web/</Text> - React web
              application
            </Text>
            <Text size="sm" style={{ marginBottom: 4 }}>
              • <Text weight="semibold">packages/mobile/</Text> - React Native
              mobile app
            </Text>
            <Text size="sm" style={{ marginBottom: 4 }}>
              • <Text weight="semibold">packages/shared/</Text> - Cross-platform
              components
            </Text>
            <Text size="sm" style={{ marginBottom: 4 }}>
              • <Text weight="semibold">packages/api/</Text> - tRPC API server
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text size="md" weight="semibold" style={{ marginBottom: 8 }}>
              Try Editing:
            </Text>
            <Text size="sm" style={{ marginBottom: 4 }}>
              1. Edit this component in{" "}
              <Text weight="semibold">
                packages/shared/src/components/HelloWorld.tsx
              </Text>
            </Text>
            <Text size="sm" style={{ marginBottom: 4 }}>
              2. Watch changes appear in both web and mobile apps instantly!
            </Text>
            <Text size="sm" style={{ marginBottom: 4 }}>
              3. Run <Text weight="semibold">yarn dev</Text> to start all
              development servers
            </Text>
          </View>

          <Card type="filled" intent="success" padding="md">
            <Text size="sm" weight="semibold" style={{ marginBottom: 4 }}>
              ✨ Framework Features:
            </Text>
            <Text size="sm">
              Shared components • Type safety • Hot reload • Cross-platform
              compatibility
            </Text>
          </Card>
        </Card>

        {/* API Testing Section */}
        <Card type="outlined" padding="lg" style={{ marginTop: 16 }}>
          <Text size="lg" weight="bold" style={{ marginBottom: 16 }}>
            🚀 API Demo - Database Integration
          </Text>
          <Text size="md" style={{ marginBottom: 16, color: "#64748b" }}>
            Test your full-stack integration! Toggle between tRPC and GraphQL to
            see both APIs in action.
          </Text>

          {/* API Toggle */}
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <Button
              type={activeTab === "trpc" ? "contained" : "outlined"}
              intent={activeTab === "trpc" ? "primary" : "neutral"}
              onPress={() => setActiveTab("trpc")}
              size="sm"
            >
              tRPC
            </Button>
            <Button
              type={activeTab === "graphql" ? "contained" : "outlined"}
              intent={activeTab === "graphql" ? "primary" : "neutral"}
              onPress={() => setActiveTab("graphql")}
              size="sm"
            >
              GraphQL
            </Button>
          </View>

          {/* tRPC Tab */}
          {activeTab === "trpc" && (
            <>
              <Card
                type="filled"
                padding="md"
                style={{ marginBottom: 16, backgroundColor: "#f0f9ff" }}
              >
                <Text size="md" weight="semibold" style={{ marginBottom: 12 }}>
                  Create via tRPC
                </Text>
                <View style={{ gap: 12 }}>
                  <Input
                    placeholder="Test name"
                    value={trpcTestName}
                    onChangeText={setTrpcTestName}
                  />
                  <Input
                    placeholder="Test message"
                    value={trpcTestMessage}
                    onChangeText={setTrpcTestMessage}
                  />
                  <Button
                    onPress={handleTrpcCreate}
                    disabled={
                      !trpcTestName ||
                      !trpcTestMessage ||
                      trpcCreateMutation.isPending
                    }
                    style={{ alignSelf: "flex-start" }}
                  >
                    {trpcCreateMutation.isPending ? "Creating..." : "Create (tRPC)"}
                  </Button>
                </View>
              </Card>

              <View>
                <Text size="md" weight="semibold" style={{ marginBottom: 12 }}>
                  Records via tRPC ({trpcTests.data?.length || 0})
                </Text>

                {trpcTests.isPending ? (
                  <Card type="outlined" padding="md">
                    <Text size="sm" style={{ color: "#64748b" }}>
                      Loading via tRPC...
                    </Text>
                  </Card>
                ) : trpcTests.data?.length === 0 ? (
                  <Card type="outlined" padding="md">
                    <Text size="sm" style={{ color: "#64748b" }}>
                      No tests found. Create one above!
                    </Text>
                  </Card>
                ) : (
                  <View style={{ gap: 8 }}>
                    {trpcTests.data?.map((test: TestRecord) => (
                      <Card key={test.id} type="outlined" padding="md">
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <Text
                              size="sm"
                              weight="semibold"
                              style={{ marginBottom: 4 }}
                            >
                              {test.name}
                            </Text>
                            <Text
                              size="sm"
                              style={{ color: "#64748b", marginBottom: 4 }}
                            >
                              {test.message}
                            </Text>
                            <Text size="sm" style={{ color: "#0ea5e9" }}>
                              tRPC • {test.status} •{" "}
                              {new Date(test.createdAt).toLocaleDateString()}
                            </Text>
                          </View>
                          <Button
                            intent="error"
                            size="sm"
                            onPress={() => handleTrpcDelete(test.id)}
                            disabled={trpcDeleteMutation.isPending}
                          >
                            Delete
                          </Button>
                        </View>
                      </Card>
                    ))}
                  </View>
                )}
              </View>
            </>
          )}

          {/* GraphQL Tab */}
          {activeTab === "graphql" && (
            <>
              <Card
                type="filled"
                padding="md"
                style={{ marginBottom: 16, backgroundColor: "#fdf4ff" }}
              >
                <Text size="md" weight="semibold" style={{ marginBottom: 12 }}>
                  Create via GraphQL
                </Text>
                <View style={{ gap: 12 }}>
                  <Input
                    placeholder="Test name"
                    value={gqlTestName}
                    onChangeText={setGqlTestName}
                  />
                  <Input
                    placeholder="Test message"
                    value={gqlTestMessage}
                    onChangeText={setGqlTestMessage}
                  />
                  <Button
                    intent="primary"
                    onPress={handleGqlCreate}
                    disabled={
                      !gqlTestName ||
                      !gqlTestMessage ||
                      gqlCreateMutation.isPending
                    }
                    style={{ alignSelf: "flex-start" }}
                  >
                    {gqlCreateMutation.isPending
                      ? "Creating..."
                      : "Create (GraphQL)"}
                  </Button>
                </View>
              </Card>

              <View>
                <Text size="md" weight="semibold" style={{ marginBottom: 12 }}>
                  Records via GraphQL ({gqlTests.data?.tests?.length || 0})
                </Text>

                {gqlTests.isPending ? (
                  <Card type="outlined" padding="md">
                    <Text size="sm" style={{ color: "#64748b" }}>
                      Loading via GraphQL...
                    </Text>
                  </Card>
                ) : gqlTests.data?.tests?.length === 0 ? (
                  <Card type="outlined" padding="md">
                    <Text size="sm" style={{ color: "#64748b" }}>
                      No tests found. Create one above!
                    </Text>
                  </Card>
                ) : (
                  <View style={{ gap: 8 }}>
                    {gqlTests.data?.tests?.map((test: TestRecord) => (
                      <Card key={test.id} type="outlined" padding="md">
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <Text
                              size="sm"
                              weight="semibold"
                              style={{ marginBottom: 4 }}
                            >
                              {test.name}
                            </Text>
                            <Text
                              size="sm"
                              style={{ color: "#64748b", marginBottom: 4 }}
                            >
                              {test.message}
                            </Text>
                            <Text size="sm" style={{ color: "#d946ef" }}>
                              GraphQL • {test.status} •{" "}
                              {new Date(test.createdAt).toLocaleDateString()}
                            </Text>
                          </View>
                          <Button
                            intent="error"
                            size="sm"
                            onPress={() => handleGqlDelete(test.id)}
                            disabled={gqlDeleteMutation.isPending}
                          >
                            Delete
                          </Button>
                        </View>
                      </Card>
                    ))}
                  </View>
                )}
              </View>
            </>
          )}
        </Card>
      </View>
    </Screen>
  );
};
