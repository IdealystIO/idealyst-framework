import React, { useState } from 'react';
import {
  Screen,
  View,
  Text,
  Card,
  Button,
  Icon,
  Badge,
  ActivityIndicator,
  Alert,
  TextInput,
  Divider,
} from '@idealyst/components';
import { trpc } from '../trpc/client';

// Set this to true if database/Prisma is available
// This will be replaced by the CLI generator based on user selection
const HAS_DATABASE = true;

export const TRPCDemoScreen: React.FC = () => {
  const [echoInput, setEchoInput] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');

  // ==========================================================================
  // Base tRPC queries (no database required)
  // ==========================================================================
  const healthQuery = trpc.health.useQuery();
  const counterQuery = trpc.counter.get.useQuery();

  const echoQuery = trpc.echo.useQuery(
    { message: echoInput },
    { enabled: echoInput.length > 0 }
  );

  const incrementMutation = trpc.counter.increment.useMutation({
    onSuccess: () => counterQuery.refetch(),
  });

  const decrementMutation = trpc.counter.decrement.useMutation({
    onSuccess: () => counterQuery.refetch(),
  });

  const resetMutation = trpc.counter.reset.useMutation({
    onSuccess: () => counterQuery.refetch(),
  });

  // ==========================================================================
  // Database tRPC queries (requires Prisma)
  // ==========================================================================
  const itemsQuery = HAS_DATABASE ? trpc.items.list.useQuery() : null;
  const statsQuery = HAS_DATABASE ? trpc.items.stats.useQuery() : null;

  const createMutation = trpc.items.create.useMutation({
    onSuccess: () => {
      itemsQuery?.refetch();
      statsQuery?.refetch();
      setNewItemTitle('');
    },
  });

  const toggleMutation = trpc.items.toggle.useMutation({
    onSuccess: () => {
      itemsQuery?.refetch();
      statsQuery?.refetch();
    },
  });

  const deleteMutation = trpc.items.delete.useMutation({
    onSuccess: () => {
      itemsQuery?.refetch();
      statsQuery?.refetch();
    },
  });

  const isLoading = healthQuery.isLoading;
  const hasError = healthQuery.isError;

  const handleCreateItem = () => {
    if (newItemTitle.trim()) {
      createMutation.mutate({ title: newItemTitle.trim() });
    }
  };

  return (
    <Screen background="primary" padding="lg" scrollable>
      <View gap="lg">
        {/* Header */}
        <View gap="sm">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="api" size={28} intent="primary" />
            <Text typography="h3">tRPC Demo</Text>
          </View>
          <Text color="secondary">
            Type-safe API calls with full end-to-end type safety
          </Text>
        </View>

        {/* Loading State */}
        {isLoading && (
          <Card type="outlined" padding="lg">
            <View style={{ alignItems: 'center', gap: 12 }}>
              <ActivityIndicator size="lg" intent="primary" />
              <Text color="secondary">Connecting to API...</Text>
            </View>
          </Card>
        )}

        {/* Error State */}
        {hasError && (
          <Alert intent="danger" title="Connection Error">
            Could not connect to the API. Make sure the server is running.
          </Alert>
        )}

        {/* ================================================================== */}
        {/* SECTION 1: Base Routes (No Database Required) */}
        {/* ================================================================== */}

        <View gap="sm">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="lightning-bolt" size={20} intent="warning" />
            <Text typography="h5" weight="semibold">Base API Routes</Text>
            <Badge intent="warning" size="sm">No Database</Badge>
          </View>
          <Text typography="caption" color="secondary">
            These routes work without any database setup
          </Text>
        </View>

        {/* Health Check */}
        {healthQuery.data && (
          <Card type="elevated" padding="md" gap="sm">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="heart-pulse" size={20} intent="success" />
              <Text weight="semibold">Health Check</Text>
              <Badge intent="success" size="sm">
                {healthQuery.data.status}
              </Badge>
            </View>
            <Text typography="caption" color="secondary">
              Version: {healthQuery.data.version} | {healthQuery.data.timestamp}
            </Text>
          </Card>
        )}

        {/* Echo Demo */}
        <Card type="outlined" padding="md" gap="md" style={{ minHeight: 180 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="message-reply-text" size={20} intent="primary" />
            <Text weight="semibold">Echo Endpoint</Text>
          </View>

          <TextInput
            placeholder="Type a message to echo..."
            value={echoInput}
            onChangeText={setEchoInput}
          />

          <View
            background="secondary"
            padding="md"
            radius="md"
            gap="xs"
            style={{ height: 80 }}
          >
            {echoQuery.data ? (
              <>
                <Text typography="caption" color="secondary" numberOfLines={1}>Original: {echoQuery.data.original}</Text>
                <Text typography="caption" color="secondary" numberOfLines={1}>Reversed: {echoQuery.data.reversed}</Text>
                <Text typography="caption" color="secondary">Length: {echoQuery.data.length}</Text>
              </>
            ) : (
              <Text typography="caption" color="secondary" style={{ opacity: 0.5 }}>
                Type a message above to see the echo response...
              </Text>
            )}
          </View>
        </Card>

        {/* Counter Demo */}
        <Card type="outlined" padding="md" gap="md">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="counter" size={20} intent="primary" />
            <Text weight="semibold">In-Memory Counter</Text>
          </View>

          <View style={{ alignItems: 'center', gap: 12 }}>
            <Text typography="h2" color="primary">
              {counterQuery.data?.value ?? 0}
            </Text>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button
                size="sm"
                intent="danger"
                leftIcon="minus"
                onPress={() => decrementMutation.mutate()}
                disabled={decrementMutation.isPending}
              >
                -1
              </Button>
              <Button
                size="sm"
                intent="neutral"
                leftIcon="refresh"
                onPress={() => resetMutation.mutate()}
                disabled={resetMutation.isPending}
              >
                Reset
              </Button>
              <Button
                size="sm"
                intent="success"
                leftIcon="plus"
                onPress={() => incrementMutation.mutate()}
                disabled={incrementMutation.isPending}
              >
                +1
              </Button>
            </View>
          </View>

          <Text typography="caption" color="secondary" style={{ textAlign: 'center' }}>
            Server-side state - persists across page refreshes but resets on server restart
          </Text>
        </Card>

        {/* ================================================================== */}
        {/* SECTION 2: Database Routes (Requires Prisma) */}
        {/* ================================================================== */}

        {HAS_DATABASE && (
          <>
            <Divider />

            <View gap="sm">
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="database" size={20} intent="success" />
                <Text typography="h5" weight="semibold">Database Routes</Text>
                <Badge intent="success" size="sm">Prisma</Badge>
              </View>
              <Text typography="caption" color="secondary">
                Full CRUD operations with persistent database storage
              </Text>
            </View>

            {/* Stats */}
            {statsQuery?.data && (
              <Card type="outlined" padding="md" gap="md">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Icon name="chart-bar" size={20} intent="primary" />
                  <Text weight="semibold">Item Statistics</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View
                    background="secondary"
                    padding="md"
                    radius="md"
                    style={{ flex: 1, alignItems: 'center' }}
                  >
                    <Text typography="h4">{statsQuery.data.total}</Text>
                    <Text typography="caption" color="secondary">
                      Total
                    </Text>
                  </View>
                  <View
                    background="secondary"
                    padding="md"
                    radius="md"
                    style={{ flex: 1, alignItems: 'center' }}
                  >
                    <Text typography="h4" color="success">
                      {statsQuery.data.completed}
                    </Text>
                    <Text typography="caption" color="secondary">
                      Completed
                    </Text>
                  </View>
                  <View
                    background="secondary"
                    padding="md"
                    radius="md"
                    style={{ flex: 1, alignItems: 'center' }}
                  >
                    <Text typography="h4" color="warning">
                      {statsQuery.data.pending}
                    </Text>
                    <Text typography="caption" color="secondary">
                      Pending
                    </Text>
                  </View>
                </View>
              </Card>
            )}

            {/* Create Item */}
            <Card type="elevated" padding="md" gap="md">
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="plus-circle" size={20} intent="success" />
                <Text weight="semibold">Create Item</Text>
              </View>

              <TextInput
                placeholder="Enter item title..."
                value={newItemTitle}
                onChangeText={setNewItemTitle}
              />

              <Button
                intent="primary"
                leftIcon="plus"
                onPress={handleCreateItem}
                disabled={!newItemTitle.trim() || createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Add Item'}
              </Button>
            </Card>

            {/* Items List */}
            {itemsQuery?.data && itemsQuery.data.length > 0 && (
              <Card type="outlined" padding="md" gap="md">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Icon name="format-list-checks" size={20} intent="primary" />
                  <Text weight="semibold">Items</Text>
                  <Badge intent="primary" size="sm">
                    {itemsQuery.data.length}
                  </Badge>
                </View>

                <View gap="sm">
                  {itemsQuery.data.map((item: { id: string; title: string; description?: string | null; completed: boolean }) => (
                    <View
                      key={item.id}
                      background="secondary"
                      padding="sm"
                      radius="sm"
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                    >
                      <Button
                        size="sm"
                        intent={item.completed ? 'success' : 'neutral'}
                        leftIcon={item.completed ? 'check-circle' : 'circle-outline'}
                        onPress={() => toggleMutation.mutate({ id: item.id })}
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          weight="medium"
                          style={{
                            textDecorationLine: item.completed ? 'line-through' : 'none',
                            opacity: item.completed ? 0.6 : 1,
                          }}
                        >
                          {item.title}
                        </Text>
                        {item.description && (
                          <Text typography="caption" color="secondary">
                            {item.description}
                          </Text>
                        )}
                      </View>
                      <Button
                        size="sm"
                        intent="danger"
                        leftIcon="delete"
                        onPress={() => deleteMutation.mutate({ id: item.id })}
                      />
                    </View>
                  ))}
                </View>
              </Card>
            )}

            {/* Empty State */}
            {itemsQuery?.data && itemsQuery.data.length === 0 && (
              <Card type="outlined" padding="lg">
                <View style={{ alignItems: 'center', gap: 8 }}>
                  <Icon name="inbox-outline" size={48} textColor="secondary" />
                  <Text color="secondary">No items yet. Create one above!</Text>
                </View>
              </Card>
            )}
          </>
        )}

        {/* Refetch Button */}
        <Button
          intent="primary"
          leftIcon="refresh"
          onPress={() => {
            healthQuery.refetch();
            counterQuery.refetch();
            if (echoInput) echoQuery.refetch();
            if (HAS_DATABASE) {
              itemsQuery?.refetch();
              statsQuery?.refetch();
            }
          }}
        >
          Refetch All Data
        </Button>

        {/* Code Example */}
        <Card type="outlined" padding="md" gap="sm">
          <Text weight="semibold">tRPC Usage Examples</Text>
          <View background="secondary" padding="md" radius="sm">
            <Text
              typography="caption"
              style={{ fontFamily: 'monospace', lineHeight: 20 }}
            >
              {`// Query with full type inference
const { data } = trpc.health.useQuery();
const counter = trpc.counter.get.useQuery();

// Mutations
trpc.counter.increment.useMutation();
trpc.echo.useQuery({ message: 'hello' });${HAS_DATABASE ? `

// Database operations (with Prisma)
const items = trpc.items.list.useQuery();
trpc.items.create.useMutation();
trpc.items.toggle.useMutation();` : ''}`}
            </Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
};

export default TRPCDemoScreen;
