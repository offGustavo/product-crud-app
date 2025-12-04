import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  Appbar,
  Snackbar,
  Text,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { useRouter } from "expo-router";
import ProductForm from "../../components/ProductForm";
import { useAuth } from "../../contexts/AuthContext";
import { useProducts } from "../../hooks/useDatabase";
import { ProductFormValues } from "../../utils/validation";

export default function CreateProductScreen() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { addProduct, loading: productsLoading } = useProducts(currentUser?.id);

  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const theme = useTheme();

  // Se não há usuário logado, redireciona para login
  useEffect(() => {
    if (!currentUser) {
      showSnackbar("Please login to create products");
      setTimeout(() => {
        router.replace("/register");
      }, 1500);
    }
  }, [currentUser, router]);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSubmit = async (data: ProductFormValues) => {
    if (!currentUser) {
      showSnackbar("You must be logged in to create products");
      return;
    }

    try {
      setLoading(true);
      await addProduct(data);
      showSnackbar("Product created successfully");
      setTimeout(() => router.back(), 1500);
    } catch (error: any) {
      showSnackbar(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header theme={theme}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title="Create Product"
          titleStyle={{ color: theme.colors.onSurface }}
        />
      </Appbar.Header>

      {!currentUser ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: theme.colors.onSurface }}>
            Redirecting to login...
          </Text>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <ProductForm
            onSubmit={handleSubmit}
            loading={loading || productsLoading}
            userId={currentUser.id}
            theme={theme}
            submitText="Create Product"
          />
        </View>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
        style={{ backgroundColor: theme.colors.inverseSurface }}
      >
        <Text style={{ color: theme.colors.inverseOnSurface }}>
          {snackbarMessage}
        </Text>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
