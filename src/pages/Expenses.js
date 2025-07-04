import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Dialog, DialogTitle, DialogContent, AppBar, Toolbar, IconButton, Tooltip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, InputAdornment, Grid } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import BudgetAlert from '../components/BudgetAlert';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const categories = ['Food', 'Rent', 'Shopping', 'Entertainment', 'Transport', 'Utilities', 'Health', 'Other'];
const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking'];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [userName, setUserName] = useState('');
  const [open, setOpen] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [filters, setFilters] = useState({ category: '', paymentMethod: '', search: '' });
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [budgetValues, setBudgetValues] = useState({});
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fetch budgets and user info
  const fetchBudgetsAndUser = async () => {
    try {
      const res = await api.get('/users/my-expenses-details');
      setBudgets(res.data.user?.categoryBudgets || {});
      setTotalExpenses(res.data.totalExpenses || 0);
      setUserName(res.data.user?.name || '');
    } catch (err) {
      setBudgets({});
      setTotalExpenses(0);
      setUserName('');
    }
  };

  // Fetch expenses with filters
  const fetchExpenses = async (appliedFilters = filters) => {
    try {
      const params = {};
      if (appliedFilters.category) params.category = appliedFilters.category;
      if (appliedFilters.paymentMethod) params.paymentMethod = appliedFilters.paymentMethod;
      if (appliedFilters.search) params.search = appliedFilters.search;
      const res = await api.get('/expenses', { params });
      setExpenses(res.data.expenses || []);
    } catch (err) {
      setExpenses([]);
    }
  };

  useEffect(() => {
    fetchBudgetsAndUser();
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Calculate category-wise spending
  const categorySpending = {};
  expenses.forEach(exp => {
    categorySpending[exp.category] = (categorySpending[exp.category] || 0) + exp.amount;
  });

  const handleAddOrEdit = async (values, { resetForm }) => {
    try {
      if (editExpense) {
        await api.patch(`/expenses/${editExpense._id}`, values);
        toast.success('Expense updated successfully!', { position: 'top-center' });
      } else {
        await api.post('/expenses', values);
        toast.success('Expense added successfully!', { position: 'top-center' });
      }
      setOpen(false);
      setEditExpense(null);
      fetchBudgetsAndUser();
      fetchExpenses();
      resetForm();
    } catch (err) {
      toast.error('Failed to save expense. Please try again.', { position: 'top-center' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchBudgetsAndUser();
      fetchExpenses();
      toast.success('Expense deleted successfully!', { position: 'top-center' });
    } catch (err) {
      console.error('Failed to delete expense:', id, `/expenses/${id}`, err);
      toast.error('Failed to delete expense. Please try again.', { position: 'top-center' });
    }
  };

  const handleEdit = (expense) => {
    setEditExpense(expense);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditExpense(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      // handle error
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updated = { ...prev, [name]: value };
      // If category or paymentMethod changes, filter immediately
      if (name === 'category' || name === 'paymentMethod') {
        fetchExpenses(updated);
      }
      // If search is cleared, show all data
      if (name === 'search' && value === '') {
        fetchExpenses({ ...updated, search: '' });
      }
      return updated;
    });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchExpenses(filters);
    }
  };

  const handleSearchClick = () => {
    fetchExpenses(filters);
  };

  const handleBudgetUpdate = async () => {
    try {
      await api.patch('/users/category-budgets', {
        categoryBudgets: budgetValues
      });
      toast.success('Budgets updated successfully!', { position: 'top-center' });
      setBudgetDialogOpen(false);
      fetchBudgetsAndUser();
    } catch (err) {
      toast.error('Failed to update budgets. Please try again.', { position: 'top-center' });
    }
  };

  const openBudgetDialog = () => {
    setBudgetValues(budgets);
    setBudgetDialogOpen(true);
  };

  return (
    <Box sx={{ mt: 4, maxWidth: 1100, mx: 'auto' }}>
      <ToastContainer />
      <AppBar position="static" color="default" sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, letterSpacing: 1 }}>
            {userName}
          </Typography>
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Summary Section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>Total Expenses: <span style={{ color: '#1976d2' }}>₹{totalExpenses}</span></Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={openBudgetDialog}
            sx={{ fontWeight: 600 }}
          >
            Update Budgets
          </Button>
        </Box>
        <Typography variant="subtitle1" sx={{ mt: 1, mb: 2, color: 'text.secondary' }}>Category-wise Spending:</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Spent</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Budget</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Alert</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(budgets).map(category => (
                <TableRow key={category}>
                  <TableCell>{category}</TableCell>
                  <TableCell>₹{categorySpending[category] || 0}</TableCell>
                  <TableCell>₹{budgets[category]}</TableCell>
                  <TableCell>
                    <BudgetAlert
                      percent={budgets[category] ? (categorySpending[category] || 0) / budgets[category] : 0}
                      category={category}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Expense and Filter/Search Controls */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 1, background: '#f8fafc' }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={3}>
            <Button variant="contained" color="primary" fullWidth onClick={() => { setEditExpense(null); setOpen(true); }} sx={{ fontWeight: 600, py: 1 }}>
              + Add Expense
            </Button>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <TextField
                select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                label="Category"
                size="small"
                sx={{ minWidth: 120, background: 'white', borderRadius: 1 }}
              >
                <MenuItem value="">All</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                name="paymentMethod"
                value={filters.paymentMethod}
                onChange={handleFilterChange}
                label="Payment"
                size="small"
                sx={{ minWidth: 120, background: 'white', borderRadius: 1 }}
              >
                <MenuItem value="">All</MenuItem>
                {paymentMethods.map(pm => (
                  <MenuItem key={pm} value={pm}>{pm}</MenuItem>
                ))}
              </TextField>
              <TextField
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                onKeyDown={handleSearchKeyDown}
                label="Search"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearchClick} size="small">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ minWidth: 180, background: 'white', borderRadius: 1 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <ExpenseList expenses={Array.isArray(expenses) ? expenses : []} onEdit={handleEdit} onDelete={handleDelete} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <DialogContent>
          <ExpenseForm
            initialValues={editExpense || { amount: '', category: '', date: '', paymentMethod: '', notes: '' }}
            onSubmit={handleAddOrEdit}
            submitLabel={editExpense ? 'Update' : 'Add'}
          />
        </DialogContent>
      </Dialog>

      {/* Budget Update Dialog */}
      <Dialog open={budgetDialogOpen} onClose={() => setBudgetDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Category Budgets</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {categories.map(category => (
                <Grid item xs={12} sm={6} key={category}>
                  <TextField
                    fullWidth
                    label={`${category} Budget`}
                    type="number"
                    value={budgetValues[category] || ''}
                    onChange={(e) => setBudgetValues(prev => ({
                      ...prev,
                      [category]: Number(e.target.value) || 0
                    }))}
                    InputProps={{
                      startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                    }}
                    size="small"
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={() => setBudgetDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBudgetUpdate}>Update Budgets</Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Expenses; 