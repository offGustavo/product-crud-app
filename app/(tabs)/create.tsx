import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Snackbar, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ProductForm from '../../components/ProductForm';
import { useAuth } from '../../hooks/useDatabase';
import { useProducts } from '../../hooks/useDatabase';
import { ProductFormValues } from '../../utils/validation';

export default function CreateProductScreen() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { 
    addProduct,
    loading: productsLoading,
  } = useProducts(currentUser?.id || 0);

  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const theme = useTheme();

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSubmit = async (data: ProductFormValues) => {
    if (!currentUser) {
      showSnackbar('You must be logged in to create products');
      return;
    }

    try {
      setLoading(true);
      await addProduct(data);
      showSnackbar('Product created successfully');
      setTimeout(() => router.back(), 1500);
    } catch (error: any) {
      showSnackbar(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header theme={theme}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content 
          title="Create Product" 
          titleStyle={{ color: theme.colors.onSurface }}
        />
      </Appbar.Header>

      {!currentUser ? (
        <View style={[styles.authRequired, { backgroundColor: theme.colors.surface }]}>
          <Snackbar
            visible={true}
            onDismiss={() => {}}
            action={{
              label: 'Login',
              onPress: () => router.push('/register'),
            }}
            style={{ backgroundColor: theme.colors.primaryContainer }}
          >
            <Text style={{ color: theme.colors.onPrimaryContainer }}>
              Please register or login to create products
            </Text>
          </Snackbar>
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
          label: 'OK',
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
  authRequired: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
});
