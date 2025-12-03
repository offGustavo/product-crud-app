import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userSchema, UserFormValues } from '../utils/validation';

interface UserFormProps {
  onSubmit: (data: UserFormValues) => Promise<void>;
  loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, loading }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UserFormValues>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  });

  const handleFormSubmit = async (data: UserFormValues) => {
    try {
      await onSubmit(data);
      reset(); // Clear form after successful registration
    } catch (error) {
      // Error is handled by parent component
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                label="Full Name"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                error={!!errors.name}
                disabled={loading}
                autoCapitalize="words"
              />
              {errors.name && (
                <HelperText type="error">
                  {errors.name.message}
                </HelperText>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <TextInput
                label="Email"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errors.email}
                disabled={loading}
              />
              {errors.email && (
                <HelperText type="error">
                  {errors.email.message}
                </HelperText>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <TextInput
                label="Password"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                secureTextEntry
                error={!!errors.password}
                disabled={loading}
              />
              {errors.password && (
                <HelperText type="error">
                  {errors.password.message}
                </HelperText>
              )}
              <HelperText type="info" style={styles.passwordHelper}>
                Password must be at least 6 characters
              </HelperText>
            </View>
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(handleFormSubmit)}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        >
          Register
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 20,
    gap: 16,
  },
  field: {
    marginBottom: 8,
  },
  passwordHelper: {
    marginTop: 4,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
});

export default UserForm;
