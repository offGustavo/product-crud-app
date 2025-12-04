import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  FAB,
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
import ThemeSettings from "../../components/ThemeSettings";
import ThemeVariantSelector from "../../components/ThemeVariantSelector";
import ThemePreview from "../../components/ThemePreview";
import ThemeTestIndicator from "../../components/ThemeTestIndicator";

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
  const insets = useSafeAreaInsets();
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
  const [themeSettingsVisible, setThemeSettingsVisible] = useState(false);

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
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
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

          {/* Theme Test Indicator */}
          <ThemeTestIndicator />

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

              <Button
                mode="contained"
                onPress={() => setThemeSettingsVisible(true)}
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.colors.tertiaryContainer },
                ]}
                contentStyle={styles.actionButtonContent}
                icon="palette"
                labelStyle={{ color: theme.colors.onTertiaryContainer }}
              >
                Advanced Theme
              </Button>
            </Card.Content>
          </Card>

          {/* Theme Selector */}
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
                App Theme
              </Title>
              <ThemeVariantSelector showTitle={false} compact={false} />
            </Card.Content>
          </Card>

          {/* Theme Preview */}
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
                Theme Preview
              </Title>
              <ThemePreview showTitle={false} compact={false} />
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

        {/* Theme Settings Modal */}
        <Modal
          visible={themeSettingsVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setThemeSettingsVisible(false)}
        >
          <ThemeSettings onClose={() => setThemeSettingsVisible(false)} />
        </Modal>
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
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
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
          color: theme.colors.inverseOnSurface,
        }}
      >
        <Text style={{ color: theme.colors.inverseOnSurface }}>
          {snackbarMessage}
        </Text>
      </Snackbar>

      {/* Theme Settings Modal */}
      <Modal
        visible={themeSettingsVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setThemeSettingsVisible(false)}
      >
        <ThemeSettings onClose={() => setThemeSettingsVisible(false)} />
      </Modal>
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
    paddingVertical: 48,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  headerContent: {
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "400",
    marginTop: 20,
    marginBottom: 8,
    fontFamily: "Roboto",
    lineHeight: 36,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.8,
    fontFamily: "Roboto-Medium",
    letterSpacing: 0.15,
    lineHeight: 24,
  },

  userCard: {
    margin: 20,
    borderRadius: 12,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userCardContent: {
    paddingVertical: 24,
  },
  infoRow: {
    paddingVertical: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "Roboto-Medium",
    lineHeight: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Roboto",
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  infoDivider: {
    marginVertical: 12,
    opacity: 0.12,
  },

  actionsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 20,
    fontFamily: "Roboto-Medium",
    lineHeight: 28,
    letterSpacing: 0,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 28,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionButtonContent: {
    paddingVertical: 14,
  },

  signOutCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  signOutButton: {
    borderRadius: 28,
    borderWidth: 1,
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
    fontWeight: "400",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "Roboto",
    lineHeight: 36,
  },
  authSubtitle: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 24,
    fontFamily: "Roboto",
    letterSpacing: 0.5,
  },

  authCard: {
    margin: 20,
    marginTop: 30,
    borderRadius: 12,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  authCardContent: {
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 24,
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    lineHeight: 28,
    letterSpacing: 0,
  },

  inputContainer: {
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    backgroundColor: "transparent",
    fontFamily: "Roboto",
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
    fontFamily: "Roboto",
    letterSpacing: 0.4,
    lineHeight: 16,
  },

  submitButton: {
    marginTop: 24,
    marginBottom: 16,
    borderRadius: 28,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  submitButtonContent: {
    paddingVertical: 12,
  },

  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 8,
  },
  toggleText: {
    fontSize: 14,
    marginRight: 4,
    fontFamily: "Roboto",
    letterSpacing: 0.25,
    lineHeight: 20,
  },
});
