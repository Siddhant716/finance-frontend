import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import LogoutIcon from '@mui/icons-material/Logout';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CategoryIcon from '@mui/icons-material/Category';
import PaymentIcon from '@mui/icons-material/Payment';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  console.log('AdminDashboard rendered with user:', user);

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      console.log('Non-admin user trying to access admin dashboard, redirecting...');
      navigate('/dashboard');
      return;
    }
    
    if (user && user.role === 'admin') {
      console.log('Admin user detected, fetching data...');
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin data...');
      const response = await api.get('/users/all-with-expenses');
      console.log('Admin data response:', response.data);
      setData(response.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Calculate analytics
  const calculateAnalytics = () => {
    console.log('Calculating analytics with data:', data);
    if (!data?.users) {
      console.log('No users data found');
      return {};
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let totalSpentThisMonth = 0;
    let totalSpentAllTime = 0;
    const categorySpending = {};
    const paymentMethodCount = {};
    const monthlySpending = {};

    data.users.forEach(userData => {
      console.log('Processing user:', userData.user?.name, 'with expenses:', userData.expenses?.length);
      if (userData.expenses && Array.isArray(userData.expenses)) {
        userData.expenses.forEach(expense => {
          console.log('Processing expense:', expense);
          if (!expense.date || !expense.amount) {
            console.log('Skipping expense - missing date or amount');
            return;
          }
          
          const expenseDate = new Date(expense.date);
          if (isNaN(expenseDate.getTime())) {
            console.log('Skipping expense - invalid date:', expense.date);
            return;
          }
          
          console.log('Expense date:', expenseDate, 'Current month:', currentMonth, 'Current year:', currentYear);
          
          // Total spent in current month
          if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
            totalSpentThisMonth += Number(expense.amount) || 0;
            console.log('Added to current month total:', expense.amount);
          }

          // Total spent all time
          totalSpentAllTime += Number(expense.amount) || 0;

          // Category spending
          const category = expense.category || 'Other';
          categorySpending[category] = (categorySpending[category] || 0) + (Number(expense.amount) || 0);

          // Payment method count
          const paymentMethod = expense.paymentMethod || 'Other';
          paymentMethodCount[paymentMethod] = (paymentMethodCount[paymentMethod] || 0) + 1;

          // Monthly spending for line chart
          const monthKey = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
          monthlySpending[monthKey] = (monthlySpending[monthKey] || 0) + (Number(expense.amount) || 0);
        });
      }
    });

    console.log('Analytics calculated:', {
      totalSpentThisMonth,
      categorySpending,
      paymentMethodCount,
      monthlySpending
    });

    // Find top category
    const topCategory = Object.keys(categorySpending).length > 0 
      ? Object.entries(categorySpending).reduce((a, b) => 
          categorySpending[a[0]] > categorySpending[b[0]] ? a : b
        )
      : ['No Data', 0];

    // Top 3 payment methods
    const topPaymentMethods = Object.entries(paymentMethodCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([method, count]) => ({ method, count }));

    // Prepare pie chart data
    const pieChartData = Object.entries(categorySpending).map(([category, amount]) => ({
      name: category,
      value: amount
    }));

    // Prepare line chart data
    const lineChartData = Object.entries(monthlySpending)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({
        month: month,
        amount: amount
      }));

    return {
      totalSpentThisMonth,
      totalSpentAllTime,
      topCategory: { category: topCategory[0], amount: topCategory[1] },
      topPaymentMethods,
      pieChartData,
      lineChartData
    };
  };

  const analytics = calculateAnalytics();

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Check if user is admin
  if (user.role !== 'admin') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error">
          Access Denied. Admin privileges required.
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Check if there's no data
  console.log('Checking hasData with:', data);
  const hasData = data?.users && data.users.length > 0 && data.users.some(userData => 
    userData.expenses && userData.expenses.length > 0
  );
  console.log('hasData result:', hasData);

  if (!hasData) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Admin Dashboard
            </Typography>
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
            Admin Dashboard
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', bgcolor: '#e3f2fd' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon sx={{ color: '#1976d2', mr: 1 }} />
                    <Typography variant="h6" color="primary">
                      Total Users
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {data?.users?.length || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', bgcolor: '#f3e5f5' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CategoryIcon sx={{ color: '#9c27b0', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#9c27b0' }}>
                      Total Expenses
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                    0
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', bgcolor: '#e8f5e8' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PaymentIcon sx={{ color: '#2e7d32', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#2e7d32' }}>
                      Status
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    No Data
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '40vh',
            p: 3,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 1
          }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#666', fontWeight: 500 }}>
              No Expense Data Available
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', textAlign: 'center', maxWidth: 500 }}>
              There are currently {data?.users?.length || 0} users registered, but no expense data has been added yet. 
              Analytics and charts will appear here once users start adding expenses.
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Admin Dashboard
          </Typography>
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
          Expense Analytics Overview
        </Typography>

        {/* Key Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ color: '#1976d2', mr: 1 }} />
                  <Typography variant="h6" color="primary">
                    Total Spent All Time
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  ₹{analytics.totalSpentAllTime?.toLocaleString() || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: '#f3e5f5' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CategoryIcon sx={{ color: '#9c27b0', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#9c27b0' }}>
                    Top Spending Category
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                  {analytics.topCategory?.category || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ₹{analytics.topCategory?.amount?.toLocaleString() || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: '#e8f5e8' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PaymentIcon sx={{ color: '#2e7d32', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#2e7d32' }}>
                    Top Payment Method
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  {analytics.topPaymentMethods?.[0]?.method || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {analytics.topPaymentMethods?.[0]?.count || 0} transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>
          {/* Pie Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Category-wise Spending Distribution
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Line Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Monthly Spending Trend
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `${month}/${year.slice(2)}`;
                    }}
                  />
                  <YAxis />
                  <RechartsTooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#1976d2" 
                    strokeWidth={2}
                    name="Total Spending"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Top Payment Methods */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Top 3 Payment Methods
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.topPaymentMethods}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 