import React from 'react';
import { Alert } from '@mui/material';

const BudgetAlert = ({ percent, category }) => {
  if (percent < 0.8) return null;
  let severity = percent >= 1 ? 'error' : 'warning';
  let message = percent >= 1
    ? `You have exceeded your budget for ${category}!`
    : `You have used ${Math.round(percent * 100)}% of your budget for ${category}.`;
  return <Alert severity={severity}>{message}</Alert>;
};

export default BudgetAlert; 