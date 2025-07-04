import React from 'react';
import { Box, TextField, Button, MenuItem } from '@mui/material';
import { Formik, Form, Field } from 'formik';

const categories = ['Food', 'Rent', 'Shopping', 'Entertainment', 'Transport', 'Utilities', 'Health', 'Other'];
const paymentMethods = ['UPI', 'Credit Card', 'Cash', 'Debit Card', 'Net Banking'];

const ExpenseForm = ({ initialValues, onSubmit, submitLabel = 'Save' }) => (
  <Formik initialValues={initialValues} onSubmit={onSubmit}>
    {() => (
      <Form>
        <Field as={TextField} name="amount" label="Amount (₹)" type="number" fullWidth margin="normal" required />
        <Field as={TextField} name="category" label="Category" select fullWidth margin="normal" required>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Field>
        <Field as={TextField} name="date" label="Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
        <Field as={TextField} name="paymentMethod" label="Payment Method" select fullWidth margin="normal" required>
          {paymentMethods.map((pm) => (
            <MenuItem key={pm} value={pm}>{pm}</MenuItem>
          ))}
        </Field>
        <Field as={TextField} name="notes" label="Notes" fullWidth margin="normal" multiline rows={2} />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>{submitLabel}</Button>
      </Form>
    )}
  </Formik>
);

export default ExpenseForm; 