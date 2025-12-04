import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextInput, Button, Text, HelperText } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema, ProductFormValues } from "../utils/validation";

interface ProductFormProps {
  onSubmit: (data: ProductFormValues) => void;
  initialData?: ProductFormValues;
  loading?: boolean;
  userId: number;
  theme?: any;
  submitText?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  initialData,
  loading,
  userId,
  theme,
  submitText = "Create Product",
}) => {
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      quantity: initialData?.quantity || 0,
      active: initialData?.active ?? true,
    },
  });

  // Reset form quando initialData mudar
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        quantity: initialData.quantity || 0,
        active: initialData.active ?? true,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: ProductFormValues) => {
    onSubmit(data);
    if (!initialData?.name) {
      reset(); // Clear form after successful create
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                label="Product Name"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                error={!!errors.name}
                disabled={loading}
                style={{
                  backgroundColor: "transparent",
                }}
                outlineStyle={{
                  borderRadius: 12,
                  borderWidth: 1,
                }}
                contentStyle={{
                  fontSize: 16,
                  fontFamily: "Roboto",
                }}
              />
              {errors.name && (
                <HelperText type="error">{errors.name.message}</HelperText>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <TextInput
                label="Description (Optional)"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                multiline
                numberOfLines={3}
                error={!!errors.description}
                disabled={loading}
                style={{
                  backgroundColor: "transparent",
                }}
                outlineStyle={{
                  borderRadius: 12,
                  borderWidth: 1,
                }}
                contentStyle={{
                  fontSize: 16,
                  fontFamily: "Roboto",
                }}
              />
              {errors.description && (
                <HelperText type="error">
                  {errors.description.message}
                </HelperText>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="quantity"
          render={({ field: { onChange, value } }) => (
            <View style={styles.field}>
              <TextInput
                label="Quantity"
                value={value?.toString() || "0"}
                onChangeText={(text) => onChange(parseInt(text) || 0)}
                mode="outlined"
                keyboardType="numeric"
                error={!!errors.quantity}
                disabled={loading}
                style={{
                  backgroundColor: "transparent",
                }}
                outlineStyle={{
                  borderRadius: 12,
                  borderWidth: 1,
                }}
                contentStyle={{
                  fontSize: 16,
                  fontFamily: "Roboto",
                }}
              />
              {errors.quantity && (
                <HelperText type="error">{errors.quantity.message}</HelperText>
              )}
            </View>
          )}
        />

        {initialData?.name && (
          <Controller
            control={control}
            name="active"
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <Button
                  mode={value ? "contained" : "outlined"}
                  onPress={() => onChange(!value)}
                  disabled={loading}
                >
                  {value ? "Active" : "Inactive"}
                </Button>
                <Text style={styles.statusText}>
                  Status: {value ? "Active" : "Inactive"}
                </Text>
              </View>
            )}
          />
        )}

        <Button
          mode="contained"
          onPress={handleSubmit((data) =>
            handleFormSubmit(data as ProductFormValues),
          )}
          loading={loading}
          disabled={loading}
          style={[
            styles.button,
            { backgroundColor: theme?.colors.primary || "#006A6B" },
          ]}
          contentStyle={{ paddingVertical: 12 }}
          labelStyle={{
            fontSize: 14,
            fontWeight: "500",
            fontFamily: "Roboto-Medium",
            letterSpacing: 0.1,
            color: theme?.colors.onPrimary || "#FFFFFF",
          }}
        >
          {submitText}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 24,
    gap: 20,
  },
  field: {
    marginBottom: 4,
  },
  statusText: {
    marginTop: 12,
    fontSize: 12,
    color: "#6F7978",
    textAlign: "center",
    fontFamily: "Roboto",
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  button: {
    marginTop: 32,
    paddingVertical: 8,
    borderRadius: 28,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
});

export default ProductForm;
