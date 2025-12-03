import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, Snackbar } from 'react-native-paper';
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

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content 
          title={productId ? 'Edit Product' : 'Create Product'} 
        />
        {productId && (
          <Appbar.Action 
            icon="delete" 
            onPress={handleDelete} 
            disabled={loading}
          />
        )}
      </Appbar.Header>

      {!currentUser ? (
        <View style={styles.authRequired}>
          <Snackbar
            visible={true}
            onDismiss={() => {}}
            action={{
              label: 'Login',
              onPress: () => router.push('/register'),
            }}
          >
            Please register or login to manage products
          </Snackbar>
        </View>
      ) : (
        <ProductForm
          onSubmit={handleSubmit}
          initialData={productData || undefined}
          loading={loading || productsLoading}
          userId={currentUser.id}
        />
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
  authRequired: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});
