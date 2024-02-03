const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

let expenses = [
  { id: 1, name: 'Expense 1', amount: 100 },
  { id: 2, name: 'Expense 2', amount: 150 },
];

// Endpoint to get all expenses
app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

// Endpoint to add a new expense
app.post('/api/expenses', (req, res) => {
  const { name, amount } = req.body;
  const newExpense = { id: expenses.length + 1, name, amount };
  expenses.push(newExpense);
  res.json(newExpense);
});

// Endpoint to edit an expense
app.put('/api/expenses/:id', (req, res) => {
  const expenseId = parseInt(req.params.id);
  const { name, amount } = req.body;

  const index = expenses.findIndex(expense => expense.id === expenseId);
  if (index !== -1) {
    expenses[index] = { id: expenseId, name, amount };
    res.json(expenses[index]);
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
});

// Endpoint to delete an expense
app.delete('/api/expenses/:id', (req, res) => {
  const expenseId = parseInt(req.params.id);
  expenses = expenses.filter(expense => expense.id !== expenseId);
  res.json({ message: 'Expense deleted successfully' });
});

// Handling the root endpoint
app.get('/', (req, res) => {
  res.json(expenses); // Return the list of expenses as JSON
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
