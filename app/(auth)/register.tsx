/**
 * SAHNE - Register Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context';
import { Button, Input, Logo } from '@/src/components/ui';
import { Colors, FontFamily, FontSize, FontWeight, Spacing, BorderRadius } from '@/src/constants';
import { validation } from '@/src/utils';
import { ApiError, UserRole } from '@/src/types';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validation.required(name)) {
      newErrors.name = 'Name is required';
    }

    if (!validation.required(email)) {
      newErrors.email = 'Email is required';
    } else if (!validation.email(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!validation.required(phone)) {
      newErrors.phone = 'Phone is required';
    } else if (!validation.phone(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!validation.required(password)) {
      newErrors.password = 'Password is required';
    } else if (!validation.password(password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!validation.passwordMatch(password, passwordConfirmation)) {
      newErrors.passwordConfirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({
        name,
        email,
        phone,
        password,
        password_confirmation: passwordConfirmation,
        role,
      });
      // Navigation is handled by AuthContext and splash screen
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.errors) {
        // Backend validation errors
        setErrors(
          Object.entries(apiError.errors).reduce(
            (acc, [key, messages]) => ({
              ...acc,
              [key]: Array.isArray(messages) ? messages[0] : messages,
            }),
            {}
          )
        );
      } else {
        Alert.alert(
          'Registration Failed',
          apiError.message || 'Something went wrong. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: UserRole; label: string; description: string }[] = [
    { value: 'client', label: 'Client', description: 'Book chefs for events' },
    { value: 'chef', label: 'Chef', description: 'Offer your services' },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Logo size="medium" />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join SAHNE today</Text>
        </View>

        <View style={styles.form}>
          {/* Role Selection */}
          <Text style={styles.roleLabel}>I want to:</Text>
          <View style={styles.roleContainer}>
            {roles.map((r) => (
              <TouchableOpacity
                key={r.value}
                style={[
                  styles.roleCard,
                  role === r.value && styles.roleCardActive,
                ]}
                onPress={() => setRole(r.value)}
              >
                <Text
                  style={[
                    styles.roleTitle,
                    role === r.value && styles.roleTextActive,
                  ]}
                >
                  {r.label}
                </Text>
                <Text
                  style={[
                    styles.roleDescription,
                    role === r.value && styles.roleTextActive,
                  ]}
                >
                  {r.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            error={errors.name}
            autoComplete="name"
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            label="Phone"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              setErrors((prev) => ({ ...prev, phone: undefined }));
            }}
            error={errors.phone}
            keyboardType="phone-pad"
            autoComplete="tel"
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            secureTextEntry
            autoComplete="password"
            helperText="At least 8 characters"
          />

          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={passwordConfirmation}
            onChangeText={(text) => {
              setPasswordConfirmation(text);
              setErrors((prev) => ({ ...prev, passwordConfirmation: undefined }));
            }}
            error={errors.passwordConfirmation}
            secureTextEntry
            autoComplete="password"
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            fullWidth
            size="large"
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  roleLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.label,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  roleCard: {
    flex: 1,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
  },
  roleCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  roleTitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  roleDescription: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  roleTextActive: {
    color: Colors.primaryDark,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  loginText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMedium,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
});
