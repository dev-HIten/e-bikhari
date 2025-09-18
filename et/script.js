let budget = 0;
let expenses = [];
let totalExpenses = 0;

// Load saved data on startup
window.onload = function () {
  const savedBudget = localStorage.getItem("budget");
  const savedExpenses = localStorage.getItem("expenses");

  if (savedBudget) {
    budget = parseInt(savedBudget);
    document.getElementById("total-budget").textContent = budget;
  }

  if (savedExpenses) {
    expenses = JSON.parse(savedExpenses);
    totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    updateExpenseList();
  }

  updateSummary();
};

function setBudget() {
  const budgetInput = document.getElementById("budget").value;
  if (budgetInput > 0) {
    budget = parseInt(budgetInput);
    localStorage.setItem("budget", budget); // save in cache
    document.getElementById("total-budget").textContent = budget;
    updateSummary();
  }
}

function addExpense() {
  const name = document.getElementById("expense-name").value;
  const amount = parseInt(document.getElementById("expense-amount").value);

  if (name && amount > 0) {
    const expense = { name, amount };
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses)); // save in cache
    totalExpenses += amount;

    updateExpenseList();
    updateSummary();

    document.getElementById("expense-name").value = "";
    document.getElementById("expense-amount").value = "";
  }
}

function updateExpenseList() {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  expenses.forEach((expense, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${expense.name} - ₹${expense.amount} 
    <button onclick="deleteExpense(${index})">❌</button>`;
    list.appendChild(li);
  });
}

function deleteExpense(index) {
  totalExpenses -= expenses[index].amount;
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses)); // update cache
  updateExpenseList();
  updateSummary();
}

function updateSummary() {
  document.getElementById("total-expenses").textContent = totalExpenses;
  document.getElementById("balance").textContent = budget - totalExpenses;
}