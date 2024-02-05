document.addEventListener('DOMContentLoaded', function () {
  const expenseList = document.getElementById('expense-list');
  const expenseForm = document.getElementById('expense-form');

  // Function to create an expense list item
  function createExpenseListItem(expense) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span id="expense-${expense.id}-details">${expense.name}: $${expense.amount}</span>
      <button onclick="editExpense(${expense.id})">Edit</button>
      <button onclick="deleteExpense(${expense.id})">Delete</button>
    `;
    return listItem;
  }

  // Function to edit an expense
  window.editExpense = async function (expenseId) {
    const expenseDetails = document.getElementById(`expense-${expenseId}-details`);
    const newName = prompt('Enter new name:', expenseDetails.innerText.split(':')[0].trim());
    const newAmount = prompt('Enter new amount:', expenseDetails.innerText.split(':')[1].trim());

    if (newName !== null && newAmount !== null) {
      try {
        // Make a PUT request to update the expense
        const response = await fetch(`http://localhost:3000/api/expenses/${expenseId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newName,
            amount: parseFloat(newAmount),
          }),
        });

        // Ensure the response status indicates success (2xx range)
        if (response.ok) {
          // Update the UI after successful edit
          const editedExpense = await response.json();
          expenseDetails.innerText = `${editedExpense.name}: $${editedExpense.amount}`;
        } else {
          console.error('Failed to edit expense. Server response:', response);
        }
      } catch (error) {
        console.error('Error editing expense:', error);
      }
    }
  };

  // Function to delete an expense
  window.deleteExpense = async function (expenseId) {
    try {
      // Make a DELETE request to remove the expense
      const response = await fetch(`http://localhost:3000/api/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      // Update the UI after successful delete
      const expenseItem = document.getElementById(`expense-${expenseId}-details`);
      if (expenseItem) {
        expenseList.removeChild(expenseItem.parentElement); // Remove the entire <li> element
        updateSummaryAndCharts();
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  // Function to add a new expense
  async function addExpense() {
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = document.getElementById('expense-amount').value;

    if (expenseName && expenseAmount) {
      try {
        // Make a POST request to add the expense
        const response = await fetch('http://localhost:3000/api/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: expenseName,
            amount: parseFloat(expenseAmount),
          }),
        });

        // Ensure the response status indicates success (2xx range)
        if (response.ok) {
          // Update the UI after successful add
          const newExpense = await response.json();
          const listItem = createExpenseListItem(newExpense);
          expenseList.appendChild(listItem);
          expenseForm.reset();
          updateSummaryAndCharts();  // Add this line
        } else {
          console.error('Failed to add expense. Server response:', response);
        }
      } catch (error) {
        console.error('Error adding expense:', error);
      }
    }
  }

  // Add event listener for the expense form
  expenseForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addExpense();
  });

// Function to update summary and charts

function updateSummaryAndCharts() {
    // Fetch expenses from the API on page load
    fetch('http://localhost:3000/api/expenses')
      .then(response => response.json())
      .then(expenses => {
        // Update chart data and labels
        window.myChart.data.labels = expenses.map(expense => expense.name);
        window.myChart.data.datasets[0].data = expenses.map(expense => expense.amount);
        window.myChart.update();
        
        // Update summary
        updateSummary(expenses);
      })
      .catch(error => {
        console.error('Error fetching expenses:', error);
      });
  }

  // Function to update summary
  function updateSummary(expenses) {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Update summary element
    const summaryElement = document.getElementById('summary');
    summaryElement.innerHTML = `Total Expenses: $${totalExpenses.toFixed(2)}`;
  }

  // Fetch expenses from the API on page load
  fetch('http://localhost:3000/api/expenses')
    .then(response => response.json())
    .then(expenses => {
      // Populate the UI with default expenses
      expenses.forEach(expense => {
        const listItem = createExpenseListItem(expense);
        expenseList.appendChild(listItem);
      });

      // Create a new chart and store it in a global variable
      const chartCanvas = document.getElementById('expense-chart');
      const ctx = chartCanvas.getContext('2d');

      const chartData = {
        labels: expenses.map(expense => expense.name),
        datasets: [
          {
            label: 'Expense Amount',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            data: expenses.map(expense => expense.amount),
          },
        ],
      };

      const chartOptions = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };

      window.myChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions,
      });
      
      // Update summary after fetching expenses
      updateSummary(expenses);
    })
    .catch(error => {
      console.error('Error fetching expenses:', error);
    });
});