import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ExpenseList = ({ expenses, onEdit, onDelete }) => (
  <TableContainer component={Paper} sx={{ mt: 2 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Amount (₹)</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Payment Method</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Notes</TableCell>
          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {expenses.map((exp) => (
          <TableRow key={exp._id}>
            <TableCell>{exp.amount}</TableCell>
            <TableCell>{exp.category}</TableCell>
            <TableCell>{exp.date}</TableCell>
            <TableCell>{exp.paymentMethod}</TableCell>
            <TableCell>{exp.notes}</TableCell>
            <TableCell align="right">
              <IconButton onClick={() => onEdit(exp)}><EditIcon /></IconButton>
              <IconButton onClick={() => onDelete(exp._id)} color="error"><DeleteIcon /></IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default ExpenseList; 