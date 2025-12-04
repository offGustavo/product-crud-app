import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Button, Appbar, Snackbar, Chip, Text, useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ProductForm from '../../components/ProductForm';
import { useAuth } from '../../hooks/useDatabase';
import { useProducts } from '../../hooks/useDatabase';
import { ProductFormValues } from '../../utils/validation';


export default function EditProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.productId ? parseInt(params.productId as string) : null;

  const { currentUser } = useAuth();
  const { 
    updateProduct,
    deleteProduct,
    products,
    loading: productsLoading,
  } = useProducts(currentUser?.id || 0);

  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [productData, setProductData] = useState<ProductFormValues | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const theme = useTheme();

  // Função para carregar o produto específico
  const loadProductData = async () => {
    if (!productId || !currentUser) return;

    try {
      setInitialLoad(true);

      // Buscar produto da lista
      const product = products.find(p => p.id === productId);

      if (product) {
        setProductData({
          name: product.name,
          description: product.description || '',
          quantity: product.quantity,
          active: product.active
        });
      } else {
        showSnackbar('Product not found');
        setTimeout(() => router.back(), 1500);
      }
    } catch (error) {
      showSnackbar('Failed to load product data');
    } finally {
      setInitialLoad(false);
    }
  };

  // Carregar produto quando o ID mudar
  useEffect(() => {
    if (productId && currentUser) {
      loadProductData();
    }
  }, [productId, currentUser?.id]);

  // Monitorar mudanças na lista de produtos
  useEffect(() => {
    if (productId && products.length > 0) {
      const product = products.find(p => p.id === productId);
      if (product && !productData) {
        setProductData({
          name: product.name,
          description: product.description || '',
          quantity: product.quantity,
          active: product.active
        });
      }
    }
  }, [productId, products]);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSubmit = async (data: ProductFormValues) => {
    if (!currentUser) {
      showSnackbar('You must be logged in to edit products');
      return;
    }

    if (!productId) {
      showSnackbar('Invalid product ID');
      return;
    }

    try {
      setLoading(true);

      // Update existing product
      const success = await updateProduct(productId, data);
      if (success) {
        showSnackbar('Product updated successfully');
        setTimeout(() => router.back(), 1500);
      } else {
        showSnackbar('Failed to update product');
      }
    } catch (error: any) {
      showSnackbar(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productId || !deleteProduct) return;

    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(productId);
              showSnackbar('Product deleted successfully');
              setTimeout(() => router.back(), 1500);
            } catch (error) {
              showSnackbar('Failed to delete product');
            }
          },
        },
      ]
    );
  };

  const renderQuantityChip = (quantity: number) => {
    const isNormalQuantity = quantity > 10;

    return (
      <Chip
        style={isNormalQuantity ? styles.normalQuantityChip : styles.lowQuantityChip}
        textStyle={isNormalQuantity ? styles.normalQuantityChipText : styles.lowQuantityChipText}
        icon={isNormalQuantity ? "check-circle" : "alert-circle"}
      >
        {isNormalQuantity ? 'In Stock' : 'Low Stock'}
      </Chip>
    );
  };

  // Se não houver productId, mostrar erro
  if (!productId) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Appbar.Header theme={theme}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content 
            title="Edit Product" 
            titleStyle={{ color: theme.colors.onSurface }}
          />
        </Appbar.Header>
        <View style={styles.errorContainer}>
          <Text style={{ color: theme.colors.error, fontSize: 16 }}>
            Product ID not provided
          </Text>
          <Button
            mode="contained"
            onPress={() => router.back()}
            style={{ marginTop: 16 }}
          >
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  // Se estiver carregando inicialmente, mostrar spinner
  if (initialLoad) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Appbar.Header theme={theme}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content 
            title="Edit Product" 
            titleStyle={{ color: theme.colors.onSurface }}
          />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: theme.colors.onSurface }}>
            Loading product data...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header theme={theme}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content 
          title="Edit Product" 
          titleStyle={{ color: theme.colors.onSurface }}
        />
        <Appbar.Action 
          icon="delete" 
          onPress={handleDelete} 
          disabled={loading}
          color={theme.colors.error}
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
              Please register or login to edit products
            </Text>
          </Snackbar>
        </View>
      ) : (
        <View style={styles.formContainer}>
          {productData?.quantity !== undefined && (
            <View style={styles.chipContainer}>
              {renderQuantityChip(productData.quantity)}
            </View>
          )}

          <ProductForm
            onSubmit={handleSubmit}
            initialData={productData || undefined}
            loading={loading || productsLoading}
            userId={currentUser.id}
            theme={theme}
            submitText="Update Product"
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
  chipContainer: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  normalQuantityChip: {
    backgroundColor: "#E8DEF8",
  },
  normalQuantityChipText: {
    color: "#6750A4",
  },
  lowQuantityChip: {
    backgroundColor: "#FFD8E4",
  },
  lowQuantityChipText: {
    color: "#8C1D18",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
