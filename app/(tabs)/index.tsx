import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  Divider,
  Snackbar,
  Chip,
  useTheme,
  FAB,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { useProducts } from "../../hooks/useDatabase";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ProductListScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const insets = useSafeAreaInsets();
  const {
    products,
    loading,
    error,
    loadProducts,
    deleteProduct,
    getProductStats,
  } = useProducts(currentUser?.id);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
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
    } catch (err) {
      showSnackbar("Failed to refresh products");
    } finally {
      setRefreshing(false);
    }
  }, [loadProducts, getProductStats]);

  React.useEffect(() => {
    const loadStats = async () => {
      if (currentUser?.id) {
        const productStats = await getProductStats();
        setStats(productStats);
      }
    };
    loadStats();
  }, [currentUser?.id, products, getProductStats]);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleDelete = async (productId: number, productName: string) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${productName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(productId);
              showSnackbar("Product deleted successfully");
            } catch (err) {
              showSnackbar("Failed to delete product");
            }
          },
        },
      ],
    );
  };

  const handleEdit = (productId: number) => {
    router.push({
      pathname: "/(tabs)/edit",
      params: { productId: productId.toString() },
    });
  };

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading products..." />;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Stats Section */}
        <Card
          style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}
          elevation={2}
        >
          <Card.Content>
            <Title style={{ color: theme.colors.onSurface }}>
              Product Overview
            </Title>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text
                  style={[styles.statNumber, { color: theme.colors.primary }]}
                >
                  {stats.total}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Total
                </Text>
              </View>
              <Divider
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.outlineVariant },
                ]}
              />
              <View style={styles.statItem}>
                <Text
                  style={[styles.statNumber, { color: theme.colors.primary }]}
                >
                  {stats.active}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Active
                </Text>
              </View>
              <Divider
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.outlineVariant },
                ]}
              />
              <View style={styles.statItem}>
                <Text
                  style={[styles.statNumber, { color: theme.colors.error }]}
                >
                  {stats.lowStock}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Low Stock
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Product List */}
        {error ? (
          <Card
            style={[
              styles.errorCard,
              { backgroundColor: theme.colors.errorContainer },
            ]}
            elevation={1}
          >
            <Card.Content>
              <Paragraph
                style={[
                  styles.errorText,
                  { color: theme.colors.onErrorContainer },
                ]}
              >
                {error}
              </Paragraph>
              <Button
                mode="contained"
                onPress={() => loadProducts()}
                style={[
                  styles.retryButton,
                  { backgroundColor: theme.colors.error },
                ]}
                labelStyle={{ color: theme.colors.onError }}
              >
                Retry
              </Button>
            </Card.Content>
          </Card>
        ) : products.length === 0 ? (
          <Card
            style={[
              styles.emptyCard,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            elevation={1}
          >
            <Card.Content style={styles.emptyContent}>
              <Title style={{ color: theme.colors.onSurface }}>
                No Products Found
              </Title>
              <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
                You haven&apos;t added any products yet. Tap the + button to add
                your first product.
              </Paragraph>
            </Card.Content>
          </Card>
        ) : (
          products.map((product) => (
            <Card
              key={product.id}
              style={[
                styles.productCard,
                { backgroundColor: theme.colors.surface },
              ]}
              elevation={2}
            >
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Title
                    style={[
                      styles.productName,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {product.name}
                  </Title>
                  <Chip
                    icon={product.active ? "check" : "close"}
                    mode="outlined"
                    style={[
                      styles.statusChip,
                      product.active
                        ? {
                            backgroundColor: "#E8F3E8",
                            borderColor: "#4CAF50",
                          }
                        : {
                            backgroundColor: theme.colors.errorContainer,
                            borderColor: theme.colors.error,
                          },
                    ]}
                    textStyle={{
                      color: product.active ? "#4CAF50" : theme.colors.error,
                      fontWeight: "500",
                    }}
                  >
                    {product.active ? "Active" : "Inactive"}
                  </Chip>
                </View>
                {product.description ? (
                  <Paragraph
                    style={[
                      styles.description,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {product.description}
                  </Paragraph>
                ) : null}
                <View style={styles.cardFooter}>
                  <Chip
                    icon={
                      product.quantity === 0
                        ? "alert-circle-outline"
                        : product.quantity < 5
                          ? "alert"
                          : product.quantity < 10
                            ? "alert-circle"
                            : "package-variant"
                    }
                    style={[
                      styles.quantityChip,
                      product.quantity === 0 && {
                        backgroundColor: theme.colors.errorContainer,
                      },
                      product.quantity < 5 &&
                        product.quantity > 0 && {
                          backgroundColor: theme.colors.errorContainer,
                        },
                      product.quantity < 10 &&
                        product.quantity >= 5 && {
                          backgroundColor: "#FFF3E0",
                        },
                      product.quantity >= 10 && {
                        backgroundColor: theme.colors.primaryContainer,
                      },
                    ]}
                    textStyle={[
                      styles.quantityChipText,
                      product.quantity === 0 && {
                        color: theme.colors.onErrorContainer,
                      },
                      product.quantity < 5 &&
                        product.quantity > 0 && {
                          color: theme.colors.onErrorContainer,
                        },
                      product.quantity < 10 &&
                        product.quantity >= 5 && {
                          color: "#EF6C00",
                        },
                      product.quantity >= 10 && {
                        color: theme.colors.onPrimaryContainer,
                      },
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
                <Text
                  style={[
                    styles.dateText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Added: {new Date(product.createdAt).toLocaleDateString()}
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => handleEdit(product.id)}
                  style={[
                    styles.actionButton,
                    { borderColor: theme.colors.primary },
                  ]}
                  labelStyle={{ color: theme.colors.primary }}
                >
                  Edit
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleDelete(product.id, product.name)}
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.colors.error },
                  ]}
                  labelStyle={{ color: theme.colors.onError }}
                >
                  Delete
                </Button>
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  statsCard: {
    margin: 16,
    padding: 16,
    borderRadius: 20,
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
  },

  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  divider: {
    width: 1,
    height: 40,
  },

  productCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 20,
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
  },

  statusChip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  description: {
    marginBottom: 12,
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
    borderRadius: 12,
    borderWidth: 0,
    borderColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },

  quantityChipText: {
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },

  dateText: {
    fontSize: 12,
    flex: 1,
  },

  actionButton: {
    marginRight: 8,
    borderRadius: 12,
  },

  // ======= Error Card ======= //

  errorCard: {
    margin: 16,
    padding: 16,
    borderRadius: 20,
  },

  errorText: {
    marginBottom: 12,
    fontWeight: "500",
  },

  retryButton: {
    marginTop: 8,
    borderRadius: 12,
  },

  // ===== Empty State ===== //

  emptyCard: {
    margin: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },

  emptyContent: {
    alignItems: "center",
    paddingVertical: 32,
  },

  userCard: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 20,
  },

  logoutButton: {
    marginTop: 16,
  },

  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
});
