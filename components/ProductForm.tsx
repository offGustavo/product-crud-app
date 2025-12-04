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
          style={styles.button}
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
    padding: 20,
    gap: 16,
  },
  field: {
    marginBottom: 8,
  },
  statusText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
});

export default ProductForm;
