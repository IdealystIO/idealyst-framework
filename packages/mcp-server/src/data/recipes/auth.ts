/**
 * Auth Recipes - Login, signup, and authentication patterns
 */

import { Recipe } from "./types.js";

export const authRecipes: Record<string, Recipe> = {
  "login-form": {
    name: "Login Form",
    description: "A complete login form with email/password validation and error handling",
    category: "auth",
    difficulty: "beginner",
    packages: ["@idealyst/components", "@idealyst/theme"],
    code: `import React, { useState } from 'react';
import { Button, Input, Card, Text, View } from '@idealyst/components';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onForgotPassword?: () => void;
}

export function LoginForm({ onSubmit, onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      await onSubmit(email, password);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card padding="lg">
      <Text variant="headline" style={{ marginBottom: 24 }}>
        Sign In
      </Text>

      {submitError && (
        <View style={{ marginBottom: 16 }}>
          <Text intent="danger">{submitError}</Text>
        </View>
      )}

      <View style={{ gap: 16 }}>
        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="current-password"
          error={errors.password}
        />

        <Button
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
        >
          Sign In
        </Button>

        {onForgotPassword && (
          <Button type="text" onPress={onForgotPassword}>
            Forgot Password?
          </Button>
        )}
      </View>
    </Card>
  );
}`,
    explanation: `This login form demonstrates:
- Controlled inputs with useState
- Client-side validation with error messages
- Loading state during submission
- Error handling for failed login attempts
- Proper keyboard types and autocomplete hints for better UX`,
    tips: [
      "Add onBlur validation for immediate feedback",
      "Consider using react-hook-form for complex forms",
      "Store tokens securely using @idealyst/storage after successful login",
    ],
    relatedRecipes: ["signup-form", "forgot-password", "protected-route"],
  },

  "signup-form": {
    name: "Signup Form",
    description: "User registration form with password confirmation and terms acceptance",
    category: "auth",
    difficulty: "beginner",
    packages: ["@idealyst/components", "@idealyst/theme"],
    code: `import React, { useState } from 'react';
import { Button, Input, Card, Text, View, Checkbox, Link } from '@idealyst/components';

interface SignupFormProps {
  onSubmit: (data: { name: string; email: string; password: string }) => Promise<void>;
  onTermsPress?: () => void;
}

export function SignupForm({ onSubmit, onTermsPress }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await onSubmit({ name, email, password });
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Signup failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card padding="lg">
      <Text variant="headline" style={{ marginBottom: 24 }}>
        Create Account
      </Text>

      {errors.submit && (
        <View style={{ marginBottom: 16 }}>
          <Text intent="danger">{errors.submit}</Text>
        </View>
      )}

      <View style={{ gap: 16 }}>
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
          autoComplete="name"
          error={errors.name}
        />

        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
        />

        <Input
          label="Password"
          placeholder="At least 8 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoComplete="new-password"
          error={errors.confirmPassword}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Checkbox
            checked={acceptedTerms}
            onChange={setAcceptedTerms}
          />
          <Text>
            I agree to the{' '}
            <Link onPress={onTermsPress}>Terms and Conditions</Link>
          </Text>
        </View>
        {errors.terms && <Text intent="danger" size="sm">{errors.terms}</Text>}

        <Button
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
        >
          Create Account
        </Button>
      </View>
    </Card>
  );
}`,
    explanation: `This signup form includes:
- Multiple field validation including password matching
- Terms and conditions checkbox with validation
- Proper autocomplete hints for password managers
- Loading and error states`,
    tips: [
      "Add password strength indicator for better UX",
      "Consider email verification flow after signup",
      "Use secure password hashing on the backend",
    ],
    relatedRecipes: ["login-form", "email-verification"],
  },

  "protected-route": {
    name: "Protected Route",
    description: "Route guard that redirects unauthenticated users",
    category: "auth",
    difficulty: "intermediate",
    packages: ["@idealyst/components", "@idealyst/navigation"],
    code: `import React, { useEffect } from 'react';
import { View, ActivityIndicator } from '@idealyst/components';
import { useNavigate } from '@idealyst/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isLoading?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  isAuthenticated,
  isLoading = false,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="lg" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

// Usage with auth context
import { useAuth } from './AuthContext';

function DashboardScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
      <DashboardContent />
    </ProtectedRoute>
  );
}`,
    explanation: `Protected routes prevent unauthorized access:
- Checks authentication state
- Shows loading indicator while checking
- Redirects to login if not authenticated
- Renders children only when authenticated`,
    tips: [
      "Store redirect URL to return after login",
      "Use React Context for global auth state",
      "Consider role-based access for admin routes",
    ],
    relatedRecipes: ["login-form", "auth-context"],
  },
};
