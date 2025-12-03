import React, { useState } from 'react'
import { Tabs } from 'react-native-paper-tabs';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Snackbar, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import UserForm from '../../components/UserForm';
import { useAuth } from '../../hooks/useDatabase';
import { LoginFormValues } from '../../utils/validation';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../utils/validation';

export default function RegisterScreen() {
  const router = useRouter();
  const { currentUser, register, login, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm,
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleRegister = async (data: any) => {
    try {
      await register(data);
      showSnackbar('Registration successful!');
      setTimeout(() => router.replace('/'), 1500);
    } catch (error: any) {
      showSnackbar(error.message || 'Registration failed');
    }
  };

  const handleLogin = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      showSnackbar('Login successful!');
      setTimeout(() => router.replace('/'), 1500);
    } catch (error: any) {
      showSnackbar(error.message || 'Login failed');
      resetLoginForm();
    }
  };

  if (currentUser) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Profile" />
        </Appbar.Header>
        
        <ScrollView>
          <Card style={styles.userCard}>
            <Card.Content>
              <Title>Account Information</Title>
              <Paragraph style={styles.userInfo}>
                <Title style={styles.label}>Name:</Title>
                <Paragraph>{currentUser.name}</Paragraph>
              </Paragraph>
              <Paragraph style={styles.userInfo}>
                <Title style={styles.label}>Email:</Title>
                <Paragraph>{currentUser.email}</Paragraph>
              </Paragraph>
              <Paragraph style={styles.userInfo}>
                <Title style={styles.label}>Member Since:</Title>
                <Paragraph>
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </Paragraph>
              </Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.actionsCard}>
            <Card.Content>
              <Title>Quick Actions</Title>
              <Button
                mode="contained"
                onPress={() => router.push('/')}
                style={styles.actionButton}
                icon="home"
              >
                Go to Products
              </Button>
              <Button
                mode="contained"
                onPress={() => router.push('/create')}
                style={styles.actionButton}
                icon="plus"
              >
                Add New Product
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Authentication" />
      </Appbar.Header>

      <Tabs value={activeTab} onValueChange={(index) => setActiveTab(index)}>
        <Tabs label="Register" value={0} />
        <Tabs label="Login" value={1} />
      </Tabs>

      {activeTab === 0 ? (
        <UserForm onSubmit={handleRegister} loading={authLoading} />
      ) : (
        <ScrollView style={styles.loginContainer}>
          <Card style={styles.loginCard}>
            <Card.Content>
              <Title>Login</Title>
              
              <Controller
                control={loginControl}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Email"
                    value={value}
                    onChangeText={onChange}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={!!loginErrors.email}
                    disabled={authLoading}
                    style={styles.input}
                  />
                )}
              />

              <Controller
                control={loginControl}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Password"
                    value={value}
                    onChangeText={onChange}
                    mode="outlined"
                    secureTextEntry
                    error={!!loginErrors.password}
                    disabled={authLoading}
                    style={styles.input}
                  />
                )}
              />

              <Button
                mode="contained"
                onPress={handleLoginSubmit(handleLogin)}
                loading={authLoading}
                disabled={authLoading}
                style={styles.loginButton}
              >
                Login
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loginContainer: {
    flex: 1,
  },
  loginCard: {
    margin: 20,
    padding: 10,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
  userCard: {
    margin: 20,
    marginBottom: 10,
  },
  userInfo: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  actionsCard: {
    margin: 20,
    marginTop: 10,
  },
  actionButton: {
    marginVertical: 8,
  },
});
