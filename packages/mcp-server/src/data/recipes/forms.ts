/**
 * Forms Recipes - Form validation and input patterns
 */

import { Recipe } from "./types.js";

export const formsRecipes: Record<string, Recipe> = {
  "form-with-validation": {
    name: "Form with Validation",
    description: "Comprehensive form with field validation and error display",
    category: "forms",
    difficulty: "intermediate",
    packages: ["@idealyst/components"],
    code: `import React, { useState } from 'react';
import { View, Text, TextInput, TextArea, Select, Button, Card } from '@idealyst/components';

interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  message: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const initialData: FormData = {
  name: '',
  email: '',
  phone: '',
  country: '',
  message: '',
};

export function ContactForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) return 'Invalid email address';
        break;
      case 'phone':
        if (value && !/^\\+?[0-9]{10,15}$/.test(value.replace(/\\s/g, ''))) return 'Invalid phone number';
        break;
      case 'country':
        if (!value) return 'Please select a country';
        break;
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.length < 10) return 'Message must be at least 10 characters';
        break;
    }
    return undefined;
  };

  const handleChange = (name: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [name]: value }));
    if (touched.has(name)) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (name: keyof FormData) => {
    setTouched((prev) => new Set(prev).add(name));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, data[name]) }));
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    (Object.keys(data) as (keyof FormData)[]).forEach((key) => {
      newErrors[key] = validateField(key, data[key]);
    });
    setErrors(newErrors);
    setTouched(new Set(Object.keys(data)));
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setData(initialData);
      setTouched(new Set());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card padding="lg">
      <Text typography="subtitle1" weight="bold" style={{ marginBottom: 24 }}>Contact Us</Text>

      <View style={{ gap: 16 }}>
        <View>
          <Text typography="body2" weight="semibold" style={{ marginBottom: 4 }}>Name</Text>
          <TextInput
            value={data.name}
            onChangeText={(v) => handleChange('name', v)}
            onBlur={() => handleBlur('name')}
            placeholder="Your name"
            intent={touched.has('name') && errors.name ? 'danger' : undefined}
          />
          {touched.has('name') && errors.name && (
            <Text typography="body2" color="danger">{errors.name}</Text>
          )}
        </View>

        <View>
          <Text typography="body2" weight="semibold" style={{ marginBottom: 4 }}>Email</Text>
          <TextInput
            value={data.email}
            onChangeText={(v) => handleChange('email', v)}
            onBlur={() => handleBlur('email')}
            placeholder="you@example.com"
            inputMode="email"
            autoCapitalize="none"
            intent={touched.has('email') && errors.email ? 'danger' : undefined}
          />
          {touched.has('email') && errors.email && (
            <Text typography="body2" color="danger">{errors.email}</Text>
          )}
        </View>

        <View>
          <Text typography="body2" weight="semibold" style={{ marginBottom: 4 }}>Phone (optional)</Text>
          <TextInput
            value={data.phone}
            onChangeText={(v) => handleChange('phone', v)}
            onBlur={() => handleBlur('phone')}
            placeholder="+1 234 567 8900"
            inputMode="number"
            intent={touched.has('phone') && errors.phone ? 'danger' : undefined}
          />
          {touched.has('phone') && errors.phone && (
            <Text typography="body2" color="danger">{errors.phone}</Text>
          )}
        </View>

        <Select
          label="Country"
          value={data.country}
          onChange={(v) => handleChange('country', v)}
          placeholder="Select a country"
          options={[
            { label: 'United States', value: 'us' },
            { label: 'Canada', value: 'ca' },
            { label: 'United Kingdom', value: 'uk' },
            { label: 'Australia', value: 'au' },
          ]}
          error={touched.has('country') && !!errors.country}
          helperText={touched.has('country') ? errors.country : undefined}
        />

        <TextArea
          label="Message"
          value={data.message}
          onChange={(v) => handleChange('message', v)}
          placeholder="Tell us what you need..."
          rows={4}
          error={touched.has('message') ? errors.message : undefined}
        />

        <Button onPress={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
          Send Message
        </Button>
      </View>
    </Card>
  );
}`,
    explanation: `Comprehensive form with:
- Per-field validation with custom rules
- Touched state tracking (only show errors after blur)
- Real-time validation after first touch
- Submit validation
- Loading state during submission
- Form reset after success`,
    tips: [
      "Consider using react-hook-form for complex forms",
      "Add async validation for unique fields (email, username)",
      "Show success message after submission",
      "Persist form data for long forms",
    ],
    relatedRecipes: ["login-form", "signup-form"],
  },
};
