import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productSchema, ProductFormValues } from '../utils/validation';

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
  submitText = 'Create Product' 
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      quantity: initialData?.quantity || 0,
      active: initialData?.active ?? true,
    }
  });

  const handleFormSubmit = async (data: ProductFormValues) => {
    try {
      await onSubmit(data);
      if (!initialData?.name) {
        reset(); // Clear form after successful create
      }
    } catch (error) {
      // Error is handled by parent component
    }
  };

  return (
    <ScrollView style={styles.container}>
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
                <HelperText type="error">
                  {errors.name.message}
                </HelperText>
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
                value={value.toString()}
                onChangeText={(text) => onChange(parseInt(text) || 0)}
                mode="outlined"
                keyboardType="numeric"
                error={!!errors.quantity}
                disabled={loading}
              />
              {errors.quantity && (
                <HelperText type="error">
                  {errors.quantity.message}
                </HelperText>
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
                  mode={value ? 'contained' : 'outlined'}
                  onPress={() => onChange(!value)}
                  disabled={loading}
                >
                  {value ? 'Active' : 'Inactive'}
                </Button>
                <Text style={styles.statusText}>
                  Status: {value ? 'Active' : 'Inactive'}
                </Text>
              </View>
            )}
          />
        )}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
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
    color: '#666',
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
});

export default ProductForm;
