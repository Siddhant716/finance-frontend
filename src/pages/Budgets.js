import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import api from '../utils/axios';

const categories = ['Food', 'Rent', 'Shopping', 'Entertainment', 'Transport', 'Utilities', 'Health', 'Other'];

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');

  const fetchBudgets = async () => {
    try {
      const res = await api.get('/budgets');
      setBudgets(res.data);
    } catch (err) {
      // handle error
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', { category: selectedCategory, amount });
      setOpen(false);
      setSelectedCategory('');
      setAmount('');
      fetchBudgets();
    } catch (err) {
      // handle error
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Budgets</Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Set Budget
      </Button>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Amount (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgets.map((b) => (
              <TableRow key={b.category}>
                <TableCell>{b.category}</TableCell>
                <TableCell>{b.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Set Budget</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddOrUpdate}>
            <TextField
              select
              label="Category"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              fullWidth
              margin="normal"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </TextField>
            <TextField
              label="Amount (₹)"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Budgets; 