import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Text,
  Divider,
  Snackbar,
  Chip,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useDatabase';
import { useProducts } from '../../hooks/useDatabase';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ProductListScreen() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const {
    products,
    loading,
    error,
    loadProducts,
    deleteProduct,
    getProductStats,
  } = useProducts(currentUser?.id || 0);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [stats, setStats] = useState<{
    total: number;
    active: number;
    lowStock: number;
  }>({ total: 0, active: 0, lowStock: 0 });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await loadProducts();
      const productStats = await getProductStats();
      setStats(productStats);
    } catch (error) {
      showSnackbar('Failed to refresh products');
    } finally {
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    const loadStats = async () => {
      if (currentUser?.id) {
        const productStats = await getProductStats();
        setStats(productStats);
      }
    };
    loadStats();
  }, [currentUser?.id, products]);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleDelete = async (productId: number, productName: string) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${productName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(productId);
              showSnackbar('Product deleted successfully');
            } catch (error) {
              showSnackbar('Failed to delete product');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (productId: number) => {
    router.push({
      pathname: '/create',
      params: { productId: productId.toString() },
    });
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/register');
        },
      },
    ]);
  };

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading products..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Section */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Product Overview</Title>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.active}</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, styles.lowStock]}>
                  {stats.lowStock}
                </Text>
                <Text style={styles.statLabel}>Low Stock</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Product List */}
        {error ? (
          <Card style={styles.errorCard}>
            <Card.Content>
              <Paragraph style={styles.errorText}>{error}</Paragraph>
              <Button
                mode="contained"
                onPress={loadProducts}
                style={styles.retryButton}
              >
                Retry
              </Button>
            </Card.Content>
          </Card>
        ) : products.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Title>No Products Found</Title>
              <Paragraph>
                You haven't added any products yet. Tap the + button to add
                your first product.
              </Paragraph>
            </Card.Content>
          </Card>
        ) : (
          products.map((product) => (
            <Card key={product.id} style={styles.productCard}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Title style={styles.productName}>{product.name}</Title>
                  <Chip
                    icon={product.active ? 'check' : 'close'}
                    mode="outlined"
                    style={[
                      styles.statusChip,
                      product.active ? styles.activeChip : styles.inactiveChip,
                    ]}
                  >
                    {product.active ? 'Active' : 'Inactive'}
                  </Chip>
                </View>
                {product.description ? (
                  <Paragraph style={styles.description}>
                    {product.description}
                  </Paragraph>
                ) : null}
                <View style={styles.cardFooter}>
                  <Chip
                    icon="package-variant"
                    style={styles.quantityChip}
                    textStyle={styles.quantityText}
                  >
                    Qty: {product.quantity}
                  </Chip>
                  <Text style={styles.dateText}>
                    Added: {new Date(product.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button
                  mode="outlined"
                  onPress={() => handleEdit(product.id)}
                  style={styles.actionButton}
                >
                  Edit
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleDelete(product.id, product.name)}
                  style={[styles.actionButton, styles.deleteButton]}
                >
                  Delete
                </Button>
              </Card.Actions>
            </Card>
          ))
        )}

        {/* User Info */}
        <Card style={styles.userCard}>
          <Card.Content>
            <Title>Account</Title>
            <Paragraph>Logged in as: {currentUser?.name}</Paragraph>
            <Paragraph>Email: {currentUser?.email}</Paragraph>
            <Button
              mode="outlined"
              onPress={handleLogout}
              style={styles.logoutButton}
              icon="logout"
            >
              Logout
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/create')}
      />

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
    backgroundColor: '#f5f5f5',
  },
  statsCard: {
    margin: 16,
    elevation: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  lowStock: {
    color: '#ff6b6b',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
  },
  productCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    flex: 1,
    marginRight: 8,
  },
  statusChip: {
    height: 32,
  },
  activeChip: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  inactiveChip: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  description: {
    marginBottom: 12,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityChip: {
    backgroundColor: '#e3f2fd',
  },
  quantityText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  actionButton: {
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
  },
  errorCard: {
    margin: 16,
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 12,
  },
  retryButton: {
    marginTop: 8,
  },
  emptyCard: {
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  userCard: {
    margin: 16,
    marginTop: 8,
  },
  logoutButton: {
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});
