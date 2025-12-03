import * as yup from 'yup';

export const productSchema = yup.object().shape({
  name: yup.string()
    .required('Product name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  description: yup.string()
    .max(500, 'Description must not exceed 500 characters'),
  quantity: yup.number()
    .required('Quantity is required')
    .min(0, 'Quantity cannot be negative')
    .integer('Quantity must be a whole number'),
  active: yup.boolean().default(true)
});

export const userSchema = yup.object().shape({
  name: yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

export const loginSchema = yup.object().shape({
  email: yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup.string()
    .required('Password is required')
});

export type ProductFormValues = yup.InferType<typeof productSchema>;
export type UserFormValues = yup.InferType<typeof userSchema>;
export type LoginFormValues = yup.InferType<typeof loginSchema>;
