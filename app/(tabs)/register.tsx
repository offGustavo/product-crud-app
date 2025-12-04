import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Card,
  Title,
  Button,
  Snackbar,
  TextInput,
  Text,
  Divider,
  Surface,
  Avatar,
  useTheme,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import {
  LoginFormValues,
  UserFormValues,
  loginSchema,
  userSchema,
} from "../../utils/validation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Define default values outside component to prevent re-creation
const LOGIN_DEFAULT_VALUES: LoginFormValues = {
  email: "",
  password: "",
};

const REGISTER_DEFAULT_VALUES: UserFormValues = {
  name: "",
  email: "",
  password: "",
};

export default function AuthScreen() {
  const router = useRouter();
  const theme = useTheme();
  const {
    currentUser,
    register,
    login,
    logout,
    loading: authLoading,
  } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Memoize resolvers to prevent re-creation
  const loginResolver = useMemo(() => yupResolver(loginSchema), []);
  const registerResolver = useMemo(() => yupResolver(userSchema), []);

  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm,
  } = useForm<LoginFormValues>({
    resolver: loginResolver,
    defaultValues: LOGIN_DEFAULT_VALUES,
    mode: "onChange",
  });

  const {
    control: registerControl,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegisterForm,
  } = useForm<UserFormValues>({
    resolver: registerResolver,
    defaultValues: REGISTER_DEFAULT_VALUES,
    mode: "onChange",
  });

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleRegister = async (data: UserFormValues) => {
    try {
      await register(data);
      showSnackbar("Registration successful! Welcome!");
      // resetRegisterForm();
      setTimeout(() => {
        router.replace("/");
      }, 1500);
    } catch (error: any) {
      showSnackbar(error.message || "Registration failed");
    }
  };

  const handleLogin = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      showSnackbar("Login successful! Welcome back!");
      resetLoginForm();
      setTimeout(() => {
        router.replace("/");
      }, 1500);
    } catch (error: any) {
      showSnackbar(error.message || "Invalid credentials");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setLogoutLoading(true);
          try {
            logout();
            showSnackbar("Signed out successfully");
            resetLoginForm();
            resetRegisterForm();
          } catch (error: any) {
            showSnackbar(error.message || "Sign out failed");
          } finally {
            setLogoutLoading(false);
          }
        },
      },
    ]);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    // Don't reset forms when toggling modes to preserve user input
  };

  // User Profile Screen
  if (currentUser) {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Surface
            style={[
              styles.header,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          >
            <View style={styles.headerContent}>
              <Avatar.Text
                size={80}
                label={currentUser.name.charAt(0).toUpperCase()}
                style={{ backgroundColor: theme.colors.primary }}
                labelStyle={{
                  color: theme.colors.onPrimary,
                  fontSize: 32,
                  fontWeight: "bold",
                }}
              />
              <Title
                style={[
                  styles.welcomeTitle,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                Welcome back!
              </Title>
              <Text
                style={[
                  styles.userName,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                {currentUser.name}
              </Text>
            </View>
          </Surface>

          {/* User Info Card */}
          <Card
            style={[styles.userCard, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content style={styles.userCardContent}>
              <View style={styles.infoRow}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Full Name
                </Text>
                <Text
                  style={[styles.infoValue, { color: theme.colors.onSurface }]}
                >
                  {currentUser.name}
                </Text>
              </View>

              <Divider style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Email Address
                </Text>
                <Text
                  style={[styles.infoValue, { color: theme.colors.onSurface }]}
                >
                  {currentUser.email}
                </Text>
              </View>

              <Divider style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Member Since
                </Text>
                <Text
                  style={[styles.infoValue, { color: theme.colors.onSurface }]}
                >
                  {new Date(currentUser.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Quick Actions */}
          <Card
            style={[
              styles.actionsCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Card.Content>
              <Title
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                Quick Actions
              </Title>

              <Button
                mode="contained"
                onPress={() => router.push("/")}
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                contentStyle={styles.actionButtonContent}
                icon="view-list"
                labelStyle={{ color: theme.colors.onPrimary }}
              >
                View My Products
              </Button>

              <Button
                mode="contained"
                onPress={() => router.push("/create")}
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.colors.secondary },
                ]}
                contentStyle={styles.actionButtonContent}
                icon="plus-circle"
                labelStyle={{ color: theme.colors.onSecondary }}
              >
                Add New Product
              </Button>
            </Card.Content>
          </Card>

          {/* Sign Out Button */}
          <Card
            style={[
              styles.signOutCard,
              { backgroundColor: theme.colors.errorContainer },
            ]}
          >
            <Card.Content>
              <Button
                mode="outlined"
                onPress={handleLogout}
                loading={logoutLoading}
                disabled={logoutLoading}
                style={[
                  styles.signOutButton,
                  { borderColor: theme.colors.error },
                ]}
                contentStyle={styles.actionButtonContent}
                icon="logout"
                labelStyle={{ color: theme.colors.error }}
              >
                Sign Out
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Authentication Screen
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Surface
          style={[
            styles.authHeader,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <View style={styles.authHeaderContent}>
            <Avatar.Icon
              size={64}
              icon="account-circle"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <Title
              style={[
                styles.authTitle,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              {isLoginMode ? "Welcome Back" : "Create Account"}
            </Title>
            <Text
              style={[
                styles.authSubtitle,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              {isLoginMode
                ? "Sign in to manage your products"
                : "Join us to start managing your inventory"}
            </Text>
          </View>
        </Surface>

        {/* Auth Form */}
        <Card
          style={[styles.authCard, { backgroundColor: theme.colors.surface }]}
        >
          <Card.Content style={styles.authCardContent}>
            <Title
              style={[styles.formTitle, { color: theme.colors.onSurface }]}
            >
              {isLoginMode ? "Sign In" : "Sign Up"}
            </Title>

            {/* Name Field - Only for Register */}
            <View
              style={!isLoginMode ? styles.inputContainer : { display: "none" }}
            >
              <Controller
                control={registerControl}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      label="Full Name"
                      value={value}
                      onChangeText={onChange}
                      mode="outlined"
                      error={!!registerErrors.name}
                      disabled={authLoading || isLoginMode}
                      style={styles.input}
                      left={<TextInput.Icon icon="account" />}
                      outlineColor={theme.colors.outline}
                      activeOutlineColor={theme.colors.primary}
                    />
                    {registerErrors.name && (
                      <Text
                        style={[
                          styles.errorText,
                          { color: theme.colors.error },
                        ]}
                      >
                        {registerErrors.name.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Email Field - Login */}
            <View
              style={isLoginMode ? styles.inputContainer : { display: "none" }}
            >
              <Controller
                control={loginControl}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      label="Email Address"
                      value={value}
                      onChangeText={onChange}
                      mode="outlined"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      error={!!loginErrors.email}
                      disabled={authLoading || !isLoginMode}
                      style={styles.input}
                      left={<TextInput.Icon icon="email" />}
                      outlineColor={theme.colors.outline}
                      activeOutlineColor={theme.colors.primary}
                    />
                    {loginErrors.email && (
                      <Text
                        style={[
                          styles.errorText,
                          { color: theme.colors.error },
                        ]}
                      >
                        {loginErrors.email.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Email Field - Register */}
            <View
              style={!isLoginMode ? styles.inputContainer : { display: "none" }}
            >
              <Controller
                control={registerControl}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      label="Email Address"
                      value={value}
                      onChangeText={onChange}
                      mode="outlined"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      error={!!registerErrors.email}
                      disabled={authLoading || isLoginMode}
                      style={styles.input}
                      left={<TextInput.Icon icon="email" />}
                      outlineColor={theme.colors.outline}
                      activeOutlineColor={theme.colors.primary}
                    />
                    {registerErrors.email && (
                      <Text
                        style={[
                          styles.errorText,
                          { color: theme.colors.error },
                        ]}
                      >
                        {registerErrors.email.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Password Field - Login */}
            <View
              style={isLoginMode ? styles.inputContainer : { display: "none" }}
            >
              <Controller
                control={loginControl}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      label="Password"
                      value={value}
                      onChangeText={onChange}
                      mode="outlined"
                      secureTextEntry
                      error={!!loginErrors.password}
                      disabled={authLoading || !isLoginMode}
                      style={styles.input}
                      left={<TextInput.Icon icon="lock" />}
                      outlineColor={theme.colors.outline}
                      activeOutlineColor={theme.colors.primary}
                    />
                    {loginErrors.password && (
                      <Text
                        style={[
                          styles.errorText,
                          { color: theme.colors.error },
                        ]}
                      >
                        {loginErrors.password.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Password Field - Register */}
            <View
              style={!isLoginMode ? styles.inputContainer : { display: "none" }}
            >
              <Controller
                control={registerControl}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      label="Password"
                      value={value}
                      onChangeText={onChange}
                      mode="outlined"
                      secureTextEntry
                      error={!!registerErrors.password}
                      disabled={authLoading || isLoginMode}
                      style={styles.input}
                      left={<TextInput.Icon icon="lock" />}
                      outlineColor={theme.colors.outline}
                      activeOutlineColor={theme.colors.primary}
                    />
                    {registerErrors.password && (
                      <Text
                        style={[
                          styles.errorText,
                          { color: theme.colors.error },
                        ]}
                      >
                        {registerErrors.password.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={
                isLoginMode
                  ? handleLoginSubmit(handleLogin)
                  : handleRegisterSubmit(handleRegister)
              }
              loading={authLoading}
              disabled={authLoading}
              style={[
                styles.submitButton,
                { backgroundColor: theme.colors.primary },
              ]}
              contentStyle={styles.submitButtonContent}
              labelStyle={{
                color: theme.colors.onPrimary,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {isLoginMode ? "Sign In" : "Create Account"}
            </Button>

            {/* Toggle Mode */}
            <View style={styles.toggleContainer}>
              <Text
                style={[
                  styles.toggleText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {isLoginMode
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </Text>
              <Button
                mode="text"
                onPress={toggleMode}
                disabled={authLoading}
                labelStyle={{ color: theme.colors.primary, fontWeight: "600" }}
              >
                {isLoginMode ? "Sign Up" : "Sign In"}
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
          labelStyle: { color: theme.colors.inversePrimary },
        }}
        style={{ backgroundColor: theme.colors.inverseSurface }}
      >
        <Text style={{ color: theme.colors.inverseOnSurface }}>
          {snackbarMessage}
        </Text>
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },

  // Profile Screen Styles
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerContent: {
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: "400",
    opacity: 0.8,
  },

  userCard: {
    margin: 20,
    borderRadius: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userCardContent: {
    paddingVertical: 20,
  },
  infoRow: {
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "400",
  },
  infoDivider: {
    marginVertical: 8,
    opacity: 0.5,
  },

  actionsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 0,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },

  signOutCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    elevation: 1,
  },
  signOutButton: {
    borderRadius: 12,
    borderWidth: 2,
  },

  // Auth Screen Styles
  authHeader: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  authHeaderContent: {
    alignItems: "center",
  },
  authTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  authSubtitle: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 22,
  },

  authCard: {
    margin: 20,
    marginTop: 30,
    borderRadius: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  authCardContent: {
    paddingVertical: 30,
    paddingHorizontal: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },

  inputContainer: {
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    backgroundColor: "transparent",
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },

  submitButton: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 12,
    elevation: 3,
  },
  submitButtonContent: {
    paddingVertical: 12,
  },

  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  toggleText: {
    fontSize: 14,
    marginRight: 4,
  },
});
