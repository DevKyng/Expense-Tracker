
const expenseForm = document.querySelector("#expense-form");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const categoryInput = document.querySelector("#category");
const dateInput = document.querySelector("#date");

const totalExpensesElement = document.querySelector("#total-expenses");
const expenseCountElement = document.querySelector("#expense-count");
const listCountElement = document.querySelector("#list-count");
const expenseList = document.querySelector("#expense-list");
const emptyState = document.querySelector("#empty-state");

const STORAGE_KEY = "my-expense-tracker-expenses";

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
});

let expenses = loadExpenses();

dateInput.value = getLocalDate();

renderExpenses();

expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;

  if (
    !description ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !date ||
    !isValidDate(date)
  ) {
    alert("Please enter a valid description, amount, and date.");
    return;
  }

  const expense = {
    id: crypto.randomUUID(),
    description: description,
    amount: amount,
    category: category,
    date: date,
  };

  expenses.unshift(expense);

  saveExpenses();
  renderExpenses();

  expenseForm.reset();
  dateInput.value = getLocalDate();
  descriptionInput.focus();
});


function renderExpenses() {
  expenseList.replaceChildren();

  let total = 0;

  for (const expense of expenses) {
    total += expense.amount;

    const row = document.createElement("tr");

    const descriptionCell = document.createElement("td");
    descriptionCell.className = "description-cell";

    const description = document.createElement("span");
    description.className = "expense-description";
    description.textContent = expense.description;

    descriptionCell.append(description);

    const categoryCell = document.createElement("td");

    const categoryBadge = document.createElement("span");
    categoryBadge.className = "category-badge";
    categoryBadge.textContent = expense.category;

    categoryCell.append(categoryBadge);

    const dateCell = document.createElement("td");
    dateCell.className = "date-cell";
    dateCell.textContent = formatDate(expense.date);

    const amountCell = document.createElement("td");
    amountCell.className = "amount-column expense-amount";
    amountCell.textContent = nairaFormatter.format(expense.amount);

    const actionCell = document.createElement("td");
    actionCell.className = "action-cell";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute(
      "aria-label",
      `Delete expense: ${expense.description}`
    );

    deleteButton.addEventListener("click", function () {
      deleteExpense(expense.id);
    });

    actionCell.append(deleteButton);

    row.append(
      descriptionCell,
      categoryCell,
      dateCell,
      amountCell,
      actionCell
    );

    expenseList.append(row);
  }

  totalExpensesElement.textContent = nairaFormatter.format(total);

  expenseCountElement.textContent =
    `${expenses.length} ${expenses.length === 1 ? "transaction" : "transactions"} recorded`;

  listCountElement.textContent =
    `${expenses.length} ${expenses.length === 1 ? "item" : "items"}`;

  emptyState.hidden = expenses.length > 0;
}


function deleteExpense(id) {
  expenses = expenses.filter(function (expense) {
    return expense.id !== id;
  });

  saveExpenses();
  renderExpenses();
}

function saveExpenses() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error("Could not save expenses:", error);
    alert("Your changes could not be saved in this browser.");
  }
}

function loadExpenses() {
  try {
    const savedExpenses = localStorage.getItem(STORAGE_KEY);

    if (!savedExpenses) {
      return [];
    }

    const parsedExpenses = JSON.parse(savedExpenses);

    if (!Array.isArray(parsedExpenses)) {
      return [];
    }

    return parsedExpenses.filter(function (expense) {
      return (
        expense &&
        typeof expense.id === "string" &&
        typeof expense.description === "string" &&
        expense.description.trim().length > 0 &&
        Number.isFinite(expense.amount) &&
        expense.amount > 0 &&
        typeof expense.category === "string" &&
        isValidDate(expense.date)
      );
    });
  } catch (error) {
    console.error("Could not load saved expenses:", error);
    return [];
  }
}

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);

  return (
    !Number.isNaN(date.getTime()) &&
    getDateString(date) === value
  );
}

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
sssssssssssssssssssssssssssssssssssss