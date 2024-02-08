const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

let expenses = [
  { id: 1, name: 'Expense 1', amount: 100 },
  { id: 2, name: 'Expense 2', amount: 150 },
];

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Endpoint to get all expenses
app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

// Endpoint to add a new expense
app.post('/api/expenses', (req, res) => {
  const newExpense = req.body;
  newExpense.id = expenses.length + 1;
  expenses.push(newExpense);
  res.json(newExpense);
});

// Endpoint to update an expense
app.put('/api/expenses/:id', (req, res) => {
  const expenseId = parseInt(req.params.id);
  const updatedExpense = req.body;

  expenses = expenses.map(expense =>
    expense.id === expenseId ? { ...expense, ...updatedExpense } : expense
  );

  const updatedExpenseDetails = expenses.find(expense => expense.id === expenseId);
  res.json(updatedExpenseDetails);
});

// Endpoint to delete an expense
app.delete('/api/expenses/:id', (req, res) => {
  const expenseId = parseInt(req.params.id);
  expenses = expenses.filter(expense => expense.id !== expenseId);
  res.json({ message: 'Expense deleted successfully' });
});

// Handling the root endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
