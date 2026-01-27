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
} from '@idealyst/components';
import { useQuery, useMutation, gql } from '../graphql/client';

// GraphQL Queries
const GET_ITEMS = gql`
  query GetItems {
    items {
      id
      title
      description
      completed
      createdAt
    }
  }
`;

const GET_ITEM_STATS = gql`
  query GetItemStats {
    itemStats {
      total
      completed
      pending
    }
  }
`;

// GraphQL Mutations
const CREATE_ITEM = gql`
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      id
      title
      description
      completed
    }
  }
`;

const TOGGLE_ITEM = gql`
  mutation ToggleItem($id: String!) {
    toggleItem(id: $id) {
      id
      completed
    }
  }
`;

const DELETE_ITEM = gql`
  mutation DeleteItem($id: String!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

interface Item {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
}

interface ItemStats {
  total: number;
  completed: number;
  pending: number;
}

export const GraphQLDemoScreen: React.FC = () => {
  const [newItemTitle, setNewItemTitle] = useState('');

  // Queries
  const {
    data: itemsData,
    loading: itemsLoading,
    error: itemsError,
    refetch: refetchItems,
  } = useQuery<{ items: Item[] }>(GET_ITEMS);

  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery<{ itemStats: ItemStats }>(GET_ITEM_STATS);

  // Mutations
  const [createItem, { loading: createLoading }] = useMutation(CREATE_ITEM, {
    onCompleted: () => {
      refetchItems();
      refetchStats();
      setNewItemTitle('');
    },
  });

  const [toggleItem] = useMutation(TOGGLE_ITEM, {
    onCompleted: () => {
      refetchItems();
      refetchStats();
    },
  });

  const [deleteItem] = useMutation(DELETE_ITEM, {
    onCompleted: () => {
      refetchItems();
      refetchStats();
    },
  });

  const isLoading = itemsLoading || statsLoading;
  const hasError = itemsError || statsError;

  const handleCreateItem = () => {
    if (newItemTitle.trim()) {
      createItem({ variables: { input: { title: newItemTitle.trim() } } });
    }
  };

  return (
    <Screen background="primary" padding="lg" scrollable>
      <View gap="lg">
        {/* Header */}
        <View gap="sm">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="graphql" size={28} intent="danger" />
            <Text typography="h3">GraphQL Demo</Text>
          </View>
          <Text color="secondary">
            Flexible queries and mutations with Apollo Client
          </Text>
        </View>

        {/* Loading State */}
        {isLoading && (
          <Card type="outlined" padding="lg">
            <View style={{ alignItems: 'center', gap: 12 }}>
              <ActivityIndicator size="lg" intent="danger" />
              <Text color="secondary">Fetching GraphQL data...</Text>
            </View>
          </Card>
        )}

        {/* Error State */}
        {hasError && (
          <Alert intent="danger" title="GraphQL Error">
            Could not fetch data. Make sure the API server is running and the
            database is set up.
          </Alert>
        )}

        {/* Stats */}
        {statsData?.itemStats && (
          <Card type="elevated" padding="md" gap="md">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="chart-pie" size={20} intent="danger" />
              <Text weight="semibold">Item Statistics</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View
                background="secondary"
                padding="md"
                radius="md"
                style={{ flex: 1, alignItems: 'center' }}
              >
                <Text typography="h4">{statsData.itemStats.total}</Text>
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
                <Text typography="h4">
                  {statsData.itemStats.completed}
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
                <Text typography="h4">
                  {statsData.itemStats.pending}
                </Text>
                <Text typography="caption" color="secondary">
                  Pending
                </Text>
              </View>
            </View>

            <View background="secondary" padding="sm" radius="sm">
              <Text typography="caption" style={{ fontFamily: 'monospace' }}>
                {`query { itemStats { total completed pending } }`}
              </Text>
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
            intent="danger"
            leftIcon="plus"
            onPress={handleCreateItem}
            disabled={!newItemTitle.trim() || createLoading}
          >
            {createLoading ? 'Creating...' : 'Add Item (GraphQL)'}
          </Button>

          <View background="secondary" padding="sm" radius="sm">
            <Text typography="caption" style={{ fontFamily: 'monospace' }}>
              {`mutation { createItem(input: { title: "..." }) { id } }`}
            </Text>
          </View>
        </Card>

        {/* Items List */}
        {itemsData?.items && itemsData.items.length > 0 && (
          <Card type="outlined" padding="md" gap="md">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="format-list-checks" size={20} intent="danger" />
              <Text weight="semibold">Items</Text>
              <Badge intent="danger" size="sm">
                {itemsData.items.length}
              </Badge>
            </View>

            <View gap="sm">
              {itemsData.items.map((item) => (
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
                    onPress={() => toggleItem({ variables: { id: item.id } })}
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
                    onPress={() => deleteItem({ variables: { id: item.id } })}
                  />
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Empty State */}
        {itemsData?.items && itemsData.items.length === 0 && (
          <Card type="outlined" padding="lg">
            <View style={{ alignItems: 'center', gap: 8 }}>
              <Icon name="inbox-outline" size={48} textColor="secondary" />
              <Text color="secondary">No items yet. Create one above!</Text>
            </View>
          </Card>
        )}

        {/* Refetch Button */}
        <Button
          intent="danger"
          leftIcon="refresh"
          onPress={() => {
            refetchItems();
            refetchStats();
          }}
        >
          Refetch All Queries
        </Button>

        {/* GraphQL Benefits */}
        <Card type="elevated" padding="md" gap="sm">
          <Text weight="semibold">GraphQL Benefits</Text>
          <View gap="xs">
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Icon name="check-circle" size={16} intent="success" />
              <Text typography="caption">Request only the fields you need</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Icon name="check-circle" size={16} intent="success" />
              <Text typography="caption">Single endpoint for all operations</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Icon name="check-circle" size={16} intent="success" />
              <Text typography="caption">
                Built-in GraphiQL playground at /graphql
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Icon name="check-circle" size={16} intent="success" />
              <Text typography="caption">Strong typing with schema</Text>
            </View>
          </View>
        </Card>
      </View>
    </Screen>
  );
};

export default GraphQLDemoScreen;
