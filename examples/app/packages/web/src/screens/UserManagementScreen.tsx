/**
 * User Management Screen
 *
 * Demonstrates strongly-typed tRPC API access with:
 * - Full CRUD operations (Create, Read, Update, Delete)
 * - Search and filtering
 * - User statistics dashboard
 * - Settings management
 * - Proper loading and error states
 *
 * All API calls are fully type-safe from database → API → frontend
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Card,
  Button,
  Input,
  IconButton,
  Switch,
  ActivityIndicator,
  Alert,
} from '@idealyst/components';
import { trpc } from '../utils/trpc';

// =============================================================================
// Types - Inferred from tRPC router for full type safety
// =============================================================================

// User type is inferred from the API response
type User = NonNullable<
  Awaited<ReturnType<typeof trpc.users.getAll.useQuery>>['data']
>['data'][number];

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Statistics Dashboard - Shows user metrics
 */
const StatsDashboard: React.FC = () => {
  const { data: stats, isLoading } = trpc.users.getStats.useQuery();

  if (isLoading) {
    return (
      <Card variant="outlined" padding="lg">
        <View style={{ alignItems: 'center', padding: 16 }}>
          <ActivityIndicator size="md" />
        </View>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card variant="elevated" padding="lg">
      <Text size="lg" weight="bold" style={{ marginBottom: 16 }}>
        User Statistics
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <StatCard label="Total Users" value={stats.totalUsers} intent="primary" />
        <StatCard label="New This Week" value={stats.newUsersThisWeek} intent="success" />
        <StatCard label="With Posts" value={stats.usersWithPosts} intent="info" />
        <StatCard label="No Posts Yet" value={stats.usersWithoutPosts} intent="neutral" />
      </View>
    </Card>
  );
};

const StatCard: React.FC<{
  label: string;
  value: number;
  intent: 'primary' | 'success' | 'info' | 'neutral';
}> = ({ label, value, intent }) => (
  <Card variant="filled" padding="md" intent={intent} style={{ flex: 1, minWidth: 120 }}>
    <Text size="xl" weight="bold" style={{ textAlign: 'center' }}>
      {value}
    </Text>
    <Text size="sm" style={{ textAlign: 'center', opacity: 0.8 }}>
      {label}
    </Text>
  </Card>
);

/**
 * Create User Form
 */
const CreateUserForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createMutation = trpc.users.create.useMutation({
    onSuccess: () => {
      // Clear form
      setEmail('');
      setName('');
      setBio('');
      setLocation('');
      setWebsite('');
      setError(null);
      onSuccess();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    setError(null);
    await createMutation.mutateAsync({
      email,
      name: name || undefined,
      bio: bio || undefined,
      location: location || undefined,
      website: website || undefined,
      createSettings: true,
    });
  };

  return (
    <Card variant="outlined" padding="lg">
      <Text size="lg" weight="bold" style={{ marginBottom: 16 }}>
        Create New User
      </Text>

      {error && (
        <Alert intent="danger" title="Error" style={{ marginBottom: 16 }}>
          {error}
        </Alert>
      )}

      <View style={{ gap: 12 }}>
        <Input
          label="Email *"
          value={email}
          onChangeText={setEmail}
          placeholder="user@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input label="Name" value={name} onChangeText={setName} placeholder="John Doe" />
        <Input
          label="Bio"
          value={bio}
          onChangeText={setBio}
          placeholder="A short description..."
          multiline
        />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Input
              label="Location"
              value={location}
              onChangeText={setLocation}
              placeholder="New York, USA"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Website"
              value={website}
              onChangeText={setWebsite}
              placeholder="https://example.com"
              keyboardType="url"
            />
          </View>
        </View>
        <Button
          intent="primary"
          onPress={handleSubmit}
          disabled={!email || createMutation.isPending}
        >
          {createMutation.isPending ? 'Creating...' : 'Create User'}
        </Button>
      </View>
    </Card>
  );
};

/**
 * Search Bar Component
 */
const SearchBar: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}> = ({ value, onChange, onSearch }) => (
  <View style={{ flexDirection: 'row', gap: 8 }}>
    <View style={{ flex: 1 }}>
      <Input
        value={value}
        onChangeText={onChange}
        placeholder="Search by name, email, or bio..."
        leftIcon="magnify"
        onSubmitEditing={onSearch}
      />
    </View>
    <Button intent="primary" onPress={onSearch}>
      Search
    </Button>
  </View>
);

/**
 * User Card - Displays a single user with actions
 */
const UserCard: React.FC<{
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}> = ({ user, onEdit, onDelete, isDeleting }) => (
  <Card variant="outlined" padding="md">
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      {/* User Info */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Text size="md" weight="bold">
            {user.name || 'Unnamed User'}
          </Text>
          {user._count && (
            <Card variant="filled" padding="sm" intent="neutral">
              <Text size="xs">
                {user._count.posts} posts, {user._count.comments} comments
              </Text>
            </Card>
          )}
        </View>

        <Text size="sm" style={{ opacity: 0.7, marginBottom: 4 }}>
          {user.email}
        </Text>

        {user.bio && (
          <Text size="sm" style={{ marginBottom: 4 }}>
            {user.bio}
          </Text>
        )}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          {user.location && (
            <Text size="xs" style={{ opacity: 0.6 }}>
              {user.location}
            </Text>
          )}
          {user.website && (
            <Text size="xs" style={{ opacity: 0.6 }}>
              {user.website}
            </Text>
          )}
          <Text size="xs" style={{ opacity: 0.5 }}>
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: 4 }}>
        <IconButton
          icon="pencil"
          type="outlined"
          size="sm"
          intent="primary"
          onPress={() => onEdit(user)}
          accessibilityLabel="Edit user"
        />
        <IconButton
          icon="delete"
          type="outlined"
          size="sm"
          intent="danger"
          onPress={() => onDelete(user.id)}
          disabled={isDeleting}
          accessibilityLabel="Delete user"
        />
      </View>
    </View>
  </Card>
);

/**
 * Edit User Modal/Form
 */
const EditUserForm: React.FC<{
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ user, onClose, onSuccess }) => {
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [location, setLocation] = useState(user.location || '');
  const [website, setWebsite] = useState(user.website || '');
  const [error, setError] = useState<string | null>(null);

  const updateMutation = trpc.users.update.useMutation({
    onSuccess: () => {
      setError(null);
      onSuccess();
      onClose();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = async () => {
    await updateMutation.mutateAsync({
      id: user.id,
      data: {
        name: name || undefined,
        bio: bio || undefined,
        location: location || undefined,
        website: website || undefined,
      },
    });
  };

  return (
    <Card variant="elevated" padding="lg" style={{ marginBottom: 16 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text size="lg" weight="bold">
          Edit User: {user.email}
        </Text>
        <IconButton icon="close" type="text" size="sm" onPress={onClose} accessibilityLabel="Close" />
      </View>

      {error && (
        <Alert intent="danger" title="Error" style={{ marginBottom: 16 }}>
          {error}
        </Alert>
      )}

      <View style={{ gap: 12 }}>
        <Input label="Name" value={name} onChangeText={setName} placeholder="John Doe" />
        <Input
          label="Bio"
          value={bio}
          onChangeText={setBio}
          placeholder="A short description..."
          multiline
        />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Input
              label="Location"
              value={location}
              onChangeText={setLocation}
              placeholder="New York, USA"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Website"
              value={website}
              onChangeText={setWebsite}
              placeholder="https://example.com"
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button intent="neutral" type="outlined" onPress={onClose} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button
            intent="primary"
            onPress={handleSubmit}
            disabled={updateMutation.isPending}
            style={{ flex: 1 }}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </View>
      </View>
    </Card>
  );
};

/**
 * User Settings Editor
 */
const UserSettingsEditor: React.FC<{
  userId: string;
  onClose: () => void;
}> = ({ userId, onClose }) => {
  const { data: user, isLoading } = trpc.users.getById.useQuery({ id: userId });
  const utils = trpc.useUtils();

  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);

  // Initialize form when user data loads
  React.useEffect(() => {
    if (user?.settings) {
      setTheme(user.settings.theme as 'light' | 'dark' | 'auto');
      setNotifications(user.settings.notifications);
      setEmailUpdates(user.settings.emailUpdates);
      setPublicProfile(user.settings.publicProfile);
    }
  }, [user]);

  const updateSettingsMutation = trpc.users.updateSettings.useMutation({
    onSuccess: () => {
      utils.users.getById.invalidate({ id: userId });
    },
  });

  const handleSave = async () => {
    await updateSettingsMutation.mutateAsync({
      userId,
      settings: {
        theme,
        notifications,
        emailUpdates,
        publicProfile,
      },
    });
    onClose();
  };

  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg">
        <ActivityIndicator size="md" />
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="lg" style={{ marginBottom: 16 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text size="lg" weight="bold">
          Settings: {user?.name || user?.email}
        </Text>
        <IconButton icon="close" type="text" size="sm" onPress={onClose} accessibilityLabel="Close" />
      </View>

      <View style={{ gap: 16 }}>
        {/* Theme Selection */}
        <View>
          <Text size="sm" weight="semibold" style={{ marginBottom: 8 }}>
            Theme
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['light', 'dark', 'auto'] as const).map((t) => (
              <Button
                key={t}
                intent={theme === t ? 'primary' : 'neutral'}
                type={theme === t ? 'contained' : 'outlined'}
                size="sm"
                onPress={() => setTheme(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Button>
            ))}
          </View>
        </View>

        {/* Toggle Settings */}
        <View style={{ gap: 12 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View>
              <Text size="sm" weight="semibold">
                Push Notifications
              </Text>
              <Text size="xs" style={{ opacity: 0.6 }}>
                Receive notifications for new activity
              </Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View>
              <Text size="sm" weight="semibold">
                Email Updates
              </Text>
              <Text size="xs" style={{ opacity: 0.6 }}>
                Receive weekly digest emails
              </Text>
            </View>
            <Switch value={emailUpdates} onValueChange={setEmailUpdates} />
          </View>

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View>
              <Text size="sm" weight="semibold">
                Public Profile
              </Text>
              <Text size="xs" style={{ opacity: 0.6 }}>
                Allow others to see your profile
              </Text>
            </View>
            <Switch value={publicProfile} onValueChange={setPublicProfile} />
          </View>
        </View>

        {/* Save Button */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <Button intent="neutral" type="outlined" onPress={onClose} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button
            intent="primary"
            onPress={handleSave}
            disabled={updateSettingsMutation.isPending}
            style={{ flex: 1 }}
          >
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </View>
      </View>
    </Card>
  );
};

// =============================================================================
// Main Screen Component
// =============================================================================

export const UserManagementScreen: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [settingsUserId, setSettingsUserId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // tRPC hooks - all fully typed!
  const utils = trpc.useUtils();

  // Use search endpoint when there's a search query, otherwise use getAll
  const {
    data: usersData,
    isLoading,
    error,
  } = activeSearch
    ? trpc.users.search.useQuery({
        query: activeSearch,
        take: 20,
        orderBy: 'createdAt',
        orderDirection: 'desc',
      })
    : trpc.users.getAll.useQuery({
        take: 20,
        orderBy: 'createdAt',
        orderDirection: 'desc',
      });

  const deleteMutation = trpc.users.delete.useMutation({
    onSuccess: () => {
      // Invalidate queries to refetch
      utils.users.getAll.invalidate();
      utils.users.search.invalidate();
      utils.users.getStats.invalidate();
    },
  });

  // Handlers
  const handleSearch = () => {
    setActiveSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const handleCreateSuccess = () => {
    utils.users.getAll.invalidate();
    utils.users.getStats.invalidate();
    setShowCreateForm(false);
  };

  const handleEditSuccess = () => {
    utils.users.getAll.invalidate();
    utils.users.search.invalidate();
  };

  // Render
  return (
    <View style={{ padding: 16, gap: 16, maxWidth: 1200, marginHorizontal: 'auto' }}>
      {/* Header */}
      <Card variant="elevated" padding="lg" intent="primary">
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 32, marginBottom: 8 }}>Users</Text>
          <Text size="lg" weight="bold" style={{ marginBottom: 8, textAlign: 'center' }}>
            User Management
          </Text>
          <Text size="md" style={{ textAlign: 'center', maxWidth: 500 }}>
            Full CRUD operations with strongly-typed tRPC API access. All types flow from Prisma
            schema → Zod validation → tRPC router → React components.
          </Text>
        </View>
      </Card>

      {/* Stats Dashboard */}
      <StatsDashboard />

      {/* Actions Bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text size="lg" weight="bold">
          Users ({usersData?.count ?? 0})
        </Text>
        <Button
          intent={showCreateForm ? 'neutral' : 'success'}
          leftIcon={showCreateForm ? 'close' : 'plus'}
          onPress={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Add User'}
        </Button>
      </View>

      {/* Create Form (conditionally shown) */}
      {showCreateForm && <CreateUserForm onSuccess={handleCreateSuccess} />}

      {/* Settings Editor (conditionally shown) */}
      {settingsUserId && (
        <UserSettingsEditor userId={settingsUserId} onClose={() => setSettingsUserId(null)} />
      )}

      {/* Edit Form (conditionally shown) */}
      {editingUser && (
        <EditUserForm
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Search */}
      <Card variant="outlined" padding="md">
        <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} />
        {activeSearch && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginTop: 8,
            }}
          >
            <Text size="sm" style={{ opacity: 0.7 }}>
              Showing results for: "{activeSearch}"
            </Text>
            <Button size="sm" type="text" intent="neutral" onPress={handleClearSearch}>
              Clear
            </Button>
          </View>
        )}
      </Card>

      {/* User List */}
      {isLoading ? (
        <Card variant="outlined" padding="lg">
          <View style={{ alignItems: 'center', padding: 32 }}>
            <ActivityIndicator size="lg" />
            <Text size="md" style={{ marginTop: 16 }}>
              Loading users...
            </Text>
          </View>
        </Card>
      ) : error ? (
        <Alert intent="danger" title="Error loading users">
          {error.message}
        </Alert>
      ) : usersData?.data && usersData.data.length > 0 ? (
        <View style={{ gap: 8 }}>
          {usersData.data.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={setEditingUser}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </View>
      ) : (
        <Card variant="filled" padding="lg">
          <View style={{ alignItems: 'center', padding: 32 }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>No Users</Text>
            <Text size="md" style={{ opacity: 0.6, textAlign: 'center' }}>
              {activeSearch
                ? `No users found matching "${activeSearch}"`
                : 'No users found. Create one to get started!'}
            </Text>
            {!showCreateForm && (
              <Button intent="primary" style={{ marginTop: 16 }} onPress={() => setShowCreateForm(true)}>
                Create First User
              </Button>
            )}
          </View>
        </Card>
      )}

      {/* Type Safety Info */}
      <Card variant="filled" intent="success" padding="md">
        <Text size="sm" weight="semibold" style={{ marginBottom: 8 }}>
          Type Safety Features Demonstrated:
        </Text>
        <View style={{ gap: 4 }}>
          <Text size="sm">
            • <Text weight="semibold">Zod schemas</Text> - Runtime validation with{' '}
            <Text style={{ fontFamily: 'monospace' }}>createUserSchema</Text>,{' '}
            <Text style={{ fontFamily: 'monospace' }}>updateUserSchema</Text>
          </Text>
          <Text size="sm">
            • <Text weight="semibold">tRPC procedures</Text> - Type-safe queries (
            <Text style={{ fontFamily: 'monospace' }}>getAll</Text>,{' '}
            <Text style={{ fontFamily: 'monospace' }}>search</Text>,{' '}
            <Text style={{ fontFamily: 'monospace' }}>getStats</Text>) and mutations (
            <Text style={{ fontFamily: 'monospace' }}>create</Text>,{' '}
            <Text style={{ fontFamily: 'monospace' }}>update</Text>,{' '}
            <Text style={{ fontFamily: 'monospace' }}>delete</Text>)
          </Text>
          <Text size="sm">
            • <Text weight="semibold">React Query integration</Text> - Automatic caching,
            invalidation, loading states via <Text style={{ fontFamily: 'monospace' }}>useQuery</Text>
            /<Text style={{ fontFamily: 'monospace' }}>useMutation</Text>
          </Text>
          <Text size="sm">
            • <Text weight="semibold">Prisma relations</Text> - Includes{' '}
            <Text style={{ fontFamily: 'monospace' }}>_count</Text> for posts/comments, nested
            settings
          </Text>
        </View>
      </Card>
    </View>
  );
};

export default UserManagementScreen;
