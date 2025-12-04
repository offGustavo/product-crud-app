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
    pathname: '/edit',
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
                    textStyle={product.active ? styles.activeText : styles.inactiveText}
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
                    icon={
                      product.quantity === 0 ? "alert-circle-outline" :
                        product.quantity < 5 ? "alert-circle" :
                          product.quantity < 10 ? "alert" :
                            "package-variant"
                    }
                    style={[
                      styles.quantityChip,
                      product.quantity === 0 && styles.outOfStockChip,
                      product.quantity < 5 && product.quantity > 0 && styles.criticalQuantityChip,
                      product.quantity < 10 && product.quantity >= 5 && styles.lowQuantityChip,
                      product.quantity >= 10 && styles.normalQuantityChip
                    ]}
                    textStyle={[
                      styles.quantityChipText,
                      product.quantity === 0 && styles.outOfStockChipText,
                      product.quantity < 5 && product.quantity > 0 && styles.criticalQuantityChipText,
                      product.quantity < 10 && product.quantity >= 5 && styles.lowQuantityChipText,
                      product.quantity >= 10 && styles.normalQuantityChipText
                    ]}
                        //TODO: fix this
                        // iconStyle={{
                        //   color: product.quantity === 0 ? "#BA1A1A" :
                        //     product.quantity < 5 ? "#BA1A1A" :
                        //       product.quantity < 10 ? "#FF9800" :
                        //         "#6750A4"
                        // }}
                  >
                    Qty: {product.quantity}
                  </Chip>
                </View>
              </Card.Content>
              <Card.Actions>
                  <Text style={styles.dateText}>
                    Added: {new Date(product.createdAt).toLocaleDateString()}
                  </Text>
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

      </ScrollView>

      {/* <FAB */}
      {/*   icon="plus" */}
      {/*   style={styles.fab} */}
      {/*   onPress={() => router.push('/create')} */}
      {/*   label="New Product" */}
      {/* /> */}

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
    backgroundColor: "#fef7ff", // M3 surface
  },

  statsCard: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16, // M3 rounded corners
    elevation: 1,
    shadowOpacity: 0.1,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },

  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "600",
    color: "#6750A4", // M3 primary
  },

  statLabel: {
    fontSize: 12,
    color: "#49454F", // M3 on-surface-variant
    marginTop: 4,
  },

  lowStock: {
    color: "#B3261E", // M3 error
  },

  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#E7E0EC", // M3 outline-variant
  },

  productCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    elevation: 1,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  productName: {
    flex: 1,
    marginRight: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#1D1B20", // M3 on-surface
  },

  statusChip: {
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 5,
    paddingVertical: 0,
  },

  activeChip: {
    backgroundColor: "#E8F3E8",
    borderColor: "#4CAF50",
  },

  inactiveChip: {
    backgroundColor: "#FCEEEE",
    borderColor: "#E53935",
  },

  activeText: {
    color: "#2E7D32", // green text
  },

  inactiveText: {
    color: "#C62828", // red text
  },

  description: {
    marginBottom: 12,
    color: "#49454F",
    fontSize: 14,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  quantityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "transparent",
    flexDirection: 'row',
    alignItems: 'center',
  },

  quantityChipText: {
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },

  normalQuantityChip: {
    backgroundColor: "#E8DEF8", // Secondary container
  },

  normalQuantityChipText: {
    color: "#6750A4", // Primary color
  },

  lowQuantityChip: {
    backgroundColor: "#FFF3E0", // Warning container
    borderColor: "#FF9800", // Warning color
  },

  lowQuantityChipText: {
    color: "#EF6C00", // Warning text
    fontWeight: "700",
  },

  criticalQuantityChip: {
    backgroundColor: "#FFE4E6", // Error container variant
    borderColor: "#BA1A1A", // Error color
  },

  criticalQuantityChipText: {
    color: "#BA1A1A", // Error color
    fontWeight: "700",
  },

  outOfStockChip: {
    backgroundColor: "#FFEBEE", // Error container
    borderColor: "#C62828", // Darker error
  },

  outOfStockChipText: {
    color: "#C62828", // Darker error text
    fontWeight: "700",
  },

  dateText: {
    fontSize: 12,
    color: "#6D6D6D",
    flex: 1,
  },

  actionButton: {
    borderWidth: 0,
    backgroundColor: "#E8DEF8", // Secondary container
    marginRight: 8,
  },

  deleteButton: {
    backgroundColor: "#B3261E", // M3 error
  },

  // ======= Error Card ======= //

  errorCard: {
    margin: 16,
    backgroundColor: "#F9DEDC", // M3 error-container
    padding: 16,
    borderRadius: 16,
  },

  errorText: {
    color: "#410E0B", // M3 on-error-container
    marginBottom: 12,
    fontWeight: "500",
  },

  retryButton: {
    marginTop: 8,
  },

  // ===== Empty State ===== //

  emptyCard: {
    margin: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyContent: {
    alignItems: "center",
    paddingVertical: 32,
  },

  userCard: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 1,
  },

  logoutButton: {
    marginTop: 16,
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },

});
