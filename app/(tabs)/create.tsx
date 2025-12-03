import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, Snackbar, Chip, Text, useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ProductForm from '../../components/ProductForm';
import { useAuth } from '../../hooks/useDatabase';
import { useProducts } from '../../hooks/useDatabase';
import { ProductFormValues } from '../../utils/validation';

export default function CreateProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.productId ? parseInt(params.productId as string) : null;
  
  const { currentUser } = useAuth();
  const { 
    addProduct, 
    updateProduct,
    products,
    loading: productsLoading 
  } = useProducts(currentUser?.id || 0);
  
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [productData, setProductData] = useState<ProductFormValues | null>(null);
  
  // Using Material-UI theme
  const theme = useTheme();

  useEffect(() => {
    if (productId && products.length > 0) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setProductData({
          name: product.name,
          description: product.description,
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
      showSnackbar('You must be logged in to manage products');
      return;
    }

    try {
      setLoading(true);
      
      if (productId) {
        // Update existing product
        const success = await updateProduct(productId, data);
        if (success) {
          showSnackbar('Product updated successfully');
          setTimeout(() => router.back(), 1500);
        } else {
          showSnackbar('Failed to update product');
        }
      } else {
        // Create new product
        await addProduct(data);
        showSnackbar('Product created successfully');
        setTimeout(() => router.back(), 1500);
      }
    } catch (error: any) {
      showSnackbar(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!productId) return;

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
              const { deleteProduct } = useProducts(currentUser?.id || 0);
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

  // Example function to render a Material-UI styled Chip for quantity status
  const renderQuantityChip = (quantity: number) => {
    const isNormalQuantity = quantity > 10; // Example condition
    
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header theme={theme}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content 
          title={productId ? 'Edit Product' : 'Create Product'} 
          titleStyle={{ color: theme.colors.onSurface }}
        />
        {productId && (
          <Appbar.Action 
            icon="delete" 
            onPress={handleDelete} 
            disabled={loading}
            color={theme.colors.error}
          />
        )}
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
              Please register or login to manage products
            </Text>
          </Snackbar>
        </View>
      ) : (
        <View style={styles.formContainer}>
          {/* Example usage of quantity chip - you might want to integrate this with your ProductForm */}
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
    backgroundColor: "#E8DEF8", // Secondary container
  },
  normalQuantityChipText: {
    color: "#6750A4", // Primary color
  },
  lowQuantityChip: {
    backgroundColor: "#FFD8E4", // Error container
  },
  lowQuantityChipText: {
    color: "#8C1D18", // On error container
  },
});
