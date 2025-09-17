import React, { useState } from 'react';
import { View, Text, Card, Button, Input } from '@idealyst/components';
import { trpc } from '../utils/trpc';

export const TestDemo: React.FC = () => {
  const [newTestName, setNewTestName] = useState('');
  const [newTestMessage, setNewTestMessage] = useState('');

  // tRPC queries and mutations
  const { data: tests, isLoading, refetch } = trpc.test.getAll.useQuery();
  const createTestMutation = trpc.test.create.useMutation({
    onSuccess: () => {
      refetch();
      setNewTestName('');
      setNewTestMessage('');
    },
  });
  const deleteTestMutation = trpc.test.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleCreateTest = async () => {
    if (!newTestName || !newTestMessage) return;
    
    await createTestMutation.mutateAsync({
      name: newTestName,
      message: newTestMessage,
      status: 'active',
    });
  };

  const handleDeleteTest = async (id: string) => {
    await deleteTestMutation.mutateAsync({ id });
  };

  if (isLoading) {
    return (
      <Card variant="outlined" padding="large">
        <Text size="medium">Loading tests...</Text>
      </Card>
    );
  }

  return (
    <View style={{ gap: 16 }}>
      {/* Header */}
      <Card variant="elevated" padding="large" intent="primary">
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24, marginBottom: 8 }}>🧪</Text>
          <Text size="large" weight="bold" style={{ marginBottom: 8, textAlign: 'center' }}>
            tRPC + Database Test
          </Text>
          <Text size="medium" style={{ textAlign: 'center' }}>
            This demonstrates end-to-end type-safe API calls from the web app to the database.
          </Text>
        </View>
      </Card>

      {/* Create Test Form */}
      <Card variant="outlined" padding="large">
        <Text size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Create New Test
        </Text>
        
        <View style={{ gap: 12 }}>
          <Input
            label="Test Name"
            value={newTestName}
            onChangeText={setNewTestName}
            placeholder="Enter test name"
          />
          <Input
            label="Test Message"
            value={newTestMessage}
            onChangeText={setNewTestMessage}
            placeholder="Enter test message"
            multiline
          />
          <Button
            variant="contained"
            intent="primary"
            onPress={handleCreateTest}
            disabled={!newTestName || !newTestMessage || createTestMutation.isPending}
          >
            {createTestMutation.isPending ? 'Creating...' : 'Create Test'}
          </Button>
        </View>
      </Card>

      {/* Test Results */}
      <Card variant="outlined" padding="large">
        <Text size="medium" weight="bold" style={{ marginBottom: 16 }}>
          Test Entries ({tests?.count || 0})
        </Text>
        
        {tests?.data && tests.data.length > 0 ? (
          <View style={{ gap: 12 }}>
            {tests.data.map((test) => (
              <Card key={test.id} variant="filled" padding="medium">
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  gap: 12
                }}>
                  <View style={{ flex: 1 }}>
                    <Text size="medium" weight="semibold" style={{ marginBottom: 4 }}>
                      {test.name}
                    </Text>
                    <Text size="small" style={{ marginBottom: 8, opacity: 0.8 }}>
                      {test.message}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Card 
                        variant="filled" 
                        padding="small" 
                        intent={test.status === 'active' ? 'success' : 'neutral'}
                      >
                        <Text size="small" weight="semibold">
                          {test.status}
                        </Text>
                      </Card>
                      <Text size="small" style={{ opacity: 0.6 }}>
                        {new Date(test.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <Button
                    variant="outlined"
                    intent="error"
                    size="small"
                    onPress={() => handleDeleteTest(test.id)}
                    disabled={deleteTestMutation.isPending}
                  >
                    Delete
                  </Button>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <Card variant="filled" padding="medium" style={{ opacity: 0.6 }}>
            <Text size="small" style={{ textAlign: 'center' }}>
              No tests found. Create one above to get started!
            </Text>
          </Card>
        )}
      </Card>

      {/* Type Safety Info */}
      <Card variant="filled" intent="success" padding="medium">
        <Text size="small" weight="semibold" style={{ marginBottom: 4 }}>
          ✨ Type Safety Features:
        </Text>
        <Text size="small">
          • Full TypeScript types from database to frontend • tRPC ensures API type safety • 
          Prisma provides database schema validation • Real-time type checking across the stack
        </Text>
      </Card>
    </View>
  );
};
