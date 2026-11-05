// 1. Starting financial information

let balance = 0;
let income = 0;
let expenses = 0;


// 2. Starting transactions

let transactions = [
    {
        id: 1,
        description: "Amazon Shopping",
        category: "Shopping",
        date: "Oct 28, 2026",
        amount: 120,
        type: "expense",
        status: "completed"
    },
    {
        id: 2,
        description: "Monthly Salary",
        category: "Income",
        date: "Oct 27, 2026",
        amount: 3500,
        type: "income",
        status: "completed"
    },
    {
        id: 3,
        description: "Netflix Subscription",
        category: "Entertainment",
        date: "Oct 25, 2026",
        amount: 15.99,
        type: "expense",
        status: "completed"
    },
    {
        id: 4,
        description: "Restaurant",
        category: "Food",
        date: "Oct 23, 2026",
        amount: 45,
        type: "expense",
        status: "completed"
    }
];


// Load previously saved Axos Bank data
const savedData = localStorage.getItem("axosBankData");

if (savedData) {
    const parsedData = JSON.parse(savedData);

    balance = parsedData.balance;
    income = parsedData.income;
    expenses = parsedData.expenses;
    transactions = parsedData.transactions;
}

// Migrate old Finora savings data to AXOS BANK
const oldSavingsData = localStorage.getItem("finoraSavingsGoals");
const axosSavingsData = localStorage.getItem("axosBankSavingsGoals");

if (!axosSavingsData && oldSavingsData) {
    localStorage.setItem("axosBankSavingsGoals", oldSavingsData);
}

// Load AXOS BANK savings goals
let savingsGoals = JSON.parse(
    localStorage.getItem("axosBankSavingsGoals")
) || [];

// Save AXOS BANK savings goals
function saveSavingsGoals() {
    localStorage.setItem(
        "axosBankSavingsGoals",
        JSON.stringify(savingsGoals)
    );
}

    let profileData = JSON.parse(
    localStorage.getItem("finoraProfile")
) || {
    name: "",
    email: "",
    phone: ""
};

async function loadProfile() {

    // Load profile information from Supabase
    const { data, error } = await supabaseClient
        .from("bank_settings")
        .select("profile_name, profile_email, profile_phone")
        .eq("id", 1)
        .single();

    if (error) {
        console.error("Could not load profile:", error);
        alert("Profile information could not be loaded.");
        return;
    }

    // Update profile information
    profileData = {
        name: data.profile_name || "",
        email: data.profile_email || "",
        phone: data.profile_phone || ""
    };

    // Save a local backup
    localStorage.setItem(
        "axosBankProfile",
        JSON.stringify(profileData)
    );

    // Display profile information
    profileNameInput.value = profileData.name;
    profileEmailInput.value = profileData.email;
    profilePhoneInput.value = profileData.phone;

    console.log("Profile loaded successfully from Supabase!");
}

// 3. Select HTML elements
const dashboardTotalSavings = document.getElementById(
    "dashboard-total-savings"
);

const darkModeToggle = document.getElementById("dark-mode-toggle");

// Check the saved theme
let darkMode = localStorage.getItem("finoraDarkMode") === "true";

// Apply the selected theme
function updateDarkMode() {
    document.body.classList.toggle("dark-mode", darkMode);
    darkModeToggle.checked = darkMode;
}

// Save changes when the switch is clicked
darkModeToggle.addEventListener("change", function() {
    darkMode = darkModeToggle.checked;

    localStorage.setItem("finoraDarkMode", darkMode);

    updateDarkMode();
});

// Load the saved theme
updateDarkMode();
// Card management elements

const freezeCardButton = document.getElementById("freeze-card");

const cardStatusDisplay = document.getElementById("card-status");

const balanceDisplay = document.getElementById("total-balance");
const incomeDisplay = document.getElementById("total-income");
const expensesDisplay = document.getElementById("total-expenses");

const transactionForm = document.getElementById("transaction-form");

const transactionList = document.getElementById("transaction-list");

const allTransactionsList = document.getElementById("all-transactions-list");

const searchInput = document.getElementById("search-transaction");

const filterSelect = document.getElementById("filter-transaction");
const statusSelect = document.getElementById("transaction-status");
const statusFilter = document.getElementById("filter-status");
const analyticsIncome = document.getElementById("analytics-income");

const analyticsExpenses = document.getElementById("analytics-expenses");

const analyticsPending = document.getElementById("analytics-pending");

const categoryBreakdown = document.getElementById("category-breakdown");
const savingsForm = document.getElementById("savings-form");
const goalNameInput = document.getElementById("goal-name");
const goalTargetInput = document.getElementById("goal-target");
const savingsGoalsList = document.getElementById("savings-goals-list");
const totalSavedDisplay = document.getElementById("total-saved");
const activeGoalsDisplay = document.getElementById("active-goals");
const dashboardSavingsGoals = document.getElementById("dashboard-savings-goals");

const profileForm = document.getElementById("profile-form");
const profileNameInput = document.getElementById("profile-name");
const profileEmailInput = document.getElementById("profile-email");
const profilePhoneInput = document.getElementById("profile-phone");

// 4. Format money

function formatMoney(amount) {
    return "$" + amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


// Save Axos Bank data in the browser
function saveData() {
    const axosBankData = {
        balance: balance,
        income: income,
        expenses: expenses,
        transactions: transactions
    };

    localStorage.setItem("axosBankData", JSON.stringify(axosBankData));
}


// 5. Update financial displays

function updateBalance() {

    balanceDisplay.textContent = formatMoney(balance);

    incomeDisplay.textContent = formatMoney(income);

    expensesDisplay.textContent = formatMoney(expenses);

    // Apply fade-in animation
    balanceDisplay.classList.remove("financial-loaded");
    incomeDisplay.classList.remove("financial-loaded");
    expensesDisplay.classList.remove("financial-loaded");

    void balanceDisplay.offsetWidth;
    void incomeDisplay.offsetWidth;
    void expensesDisplay.offsetWidth;

    balanceDisplay.classList.add("financial-loaded");
    incomeDisplay.classList.add("financial-loaded");
    expensesDisplay.classList.add("financial-loaded");

}


// 6. Display transactions
// UPDATE TRANSACTION SUMMARY CARDS

function updateTransactionSummary() {

    const totalCount = transactions.length;

    const totalIncome = transactions
        .filter(function(transaction) {
            return transaction.type === "income";
        })
        .reduce(function(total, transaction) {
            return total + Number(transaction.amount);
        }, 0);

    const totalExpenses = transactions
        .filter(function(transaction) {
            return transaction.type === "expense";
        })
        .reduce(function(total, transaction) {
            return total + Number(transaction.amount);
        }, 0);

    const pendingCount = transactions
        .filter(function(transaction) {
            return transaction.status === "pending";
        }).length;

    document.getElementById("total-transactions-count").textContent =
        totalCount;

    document.getElementById("transaction-income-total").textContent =
        formatMoney(totalIncome);

    document.getElementById("transaction-expenses-total").textContent =
        formatMoney(totalExpenses);

    document.getElementById("pending-transactions-count").textContent =
        pendingCount;
}
function updateCardSpending() {

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlySpending = transactions
        .filter(function(transaction) {

            const transactionDate = new Date(transaction.date);

            return (
                transaction.type === "expense" &&
                transaction.status === "completed" &&
                transactionDate.getMonth() === currentMonth &&
                transactionDate.getFullYear() === currentYear
            );

        })
        .reduce(function(total, transaction) {
            return total + Number(transaction.amount);
        }, 0);

    document.getElementById("card-monthly-spending").textContent =
        formatMoney(monthlySpending);
}

function displayTransactions() {

    const search = searchInput.value.toLowerCase();

    const filter = filterSelect.value;
    const selectedStatus = statusFilter.value;

    allTransactionsList.innerHTML = "";

    const filteredTransactions = transactions.filter(function(transaction) {

        const matchesSearch = transaction.description
            .toLowerCase()
            .includes(search);

        const matchesFilter =
    filter === "all" || transaction.type === filter;

const matchesStatus =
    selectedStatus === "all" || transaction.status === selectedStatus;

return matchesSearch && matchesFilter && matchesStatus;

    });


    filteredTransactions.forEach(function(transaction) {

        const row = document.createElement("tr");

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = transaction.description;

        const categoryCell = document.createElement("td");
        categoryCell.textContent = transaction.category;

        const dateCell = document.createElement("td");
        dateCell.textContent = transaction.date;

        const amountCell = document.createElement("td");

        amountCell.textContent =
            (transaction.type === "income" ? "+" : "-") +
            formatMoney(transaction.amount);

        amountCell.className = transaction.type;

        const statusCell = document.createElement("td");

const statusBadge = document.createElement("span");

statusBadge.textContent =
    transaction.status === "pending" ? "Pending" : "Completed";

statusBadge.className = transaction.status === "pending"
    ? "status-badge pending"
    : "status-badge completed";

statusCell.appendChild(statusBadge);

        const actionCell = document.createElement("td");
        if (isAdmin()) {
        if (transaction.status === "pending") {

    const completeButton = document.createElement("button");

    completeButton.textContent = "Complete";

    completeButton.className = "complete-button";

    completeButton.addEventListener("click", function() {
        completeTransaction(transaction.id);
    });

    actionCell.appendChild(completeButton);
}
// Edit transaction button
const editButton = document.createElement("button");

editButton.textContent = "Edit";

editButton.className = "edit-button";

editButton.addEventListener("click", function() {
    editTransaction(transaction.id);
});

actionCell.appendChild(editButton);
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function() {

            deleteTransaction(transaction.id);

        });

        actionCell.appendChild(deleteButton);
    }

        row.appendChild(descriptionCell);
        row.appendChild(categoryCell);
        row.appendChild(dateCell);
        row.appendChild(amountCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        allTransactionsList.appendChild(row);

});

updateTransactionSummary();
updateCardSpending();
updateCardSpendingBreakdown();
}

function updateCardSpendingBreakdown() {

    const categoryTotals = {};

    transactions.forEach(function(transaction) {

        if (
            transaction.type === "expense" &&
            transaction.status === "completed"
        ) {
            const category = transaction.category || "Other";

            categoryTotals[category] =
                (categoryTotals[category] || 0) +
                Number(transaction.amount);
        }

    });

    const breakdownContainer =
        document.getElementById("card-spending-breakdown");

    breakdownContainer.innerHTML = "";

    const categories = Object.entries(categoryTotals);

    const totalSpending = categories.reduce(function(total, item) {
        return total + item[1];
    }, 0);

    if (categories.length === 0) {
        breakdownContainer.textContent = "No completed expenses yet.";
        return;
    }

    categories.forEach(function(item) {

        const category = item[0];
        const amount = item[1];

        const percentage = totalSpending > 0
            ? (amount / totalSpending) * 100
            : 0;

        const categoryElement = document.createElement("div");
        categoryElement.className = "spending-category";

        categoryElement.innerHTML = `
            <div class="spending-category-info">
                <span>${category}</span>
                <strong>${formatMoney(amount)}</strong>
            </div>

            <div class="spending-progress">
                <div class="spending-progress-fill"
                     style="width: ${percentage}%">
                </div>
            </div>
        `;

        breakdownContainer.appendChild(categoryElement);

    });
}

// Complete a pending transaction
// Complete a pending transaction
async function completeTransaction(id) {
    if (!isAdmin()) {
        alert("You are not authorized to complete transactions.");
        return;
    }

    const transaction = transactions.find(function(item) {
        return Number(item.id) === Number(id);
    });

    if (!transaction || transaction.status !== "pending") {
        return;
    }

    // Update transaction status in Supabase
    const { error } = await supabaseClient
        .from("transactions")
        .update({
            status: "completed"
        })
        .eq("id", id);

    if (error) {
        console.error("Could not complete transaction:", error);
        alert("Transaction could not be completed. Please try again.");
        return;
    }

    // Update financial balance
    if (transaction.type === "income") {
        balance += transaction.amount;
    } else {
        balance -= transaction.amount;
    }

    transaction.status = "completed";

    // Create notification
    await createNotification(
    "Transaction Completed",
    transaction.description + " has been completed successfully."
);
    displayNotifications();
    saveData();

    await saveBankSettingsToSupabase();

    updateBalance();
    displayTransactions();
    displayDashboardTransactions();
    updateAnalytics();

    alert("Transaction completed successfully!");
}

// 7. Add transactions

transactionForm.addEventListener("submit", async function(event) {

    event.preventDefault();
    if (!isAdmin()) {
        alert("You are not authorized to create transactions.");
        return;
    }

    const description = document.getElementById("description").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("transaction-type").value;
    const status = statusSelect.value;

    if (!description || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid description and amount.");
        return;
    }

    // Insert transaction into Supabase
    const { data, error } = await supabaseClient
        .from("transactions")
        .insert([{
            description: description,
            category: type === "income" ? "Income" : "Expense",
            transaction_date: new Date().toISOString().split("T")[0],
            amount: amount,
            type: type,
            status: status
        }])
        .select()
        .single();

    if (error) {
        console.error("Could not create transaction:", error);
        alert("Transaction could not be saved. Please try again.");
        return;
    }

    // Create transaction using Supabase-generated ID
    const newTransaction = {
        id: data.id,
        description: data.description,
        category: data.category,
        date: new Date(data.transaction_date + "T00:00:00").toLocaleDateString(),
        amount: Number(data.amount),
        type: data.type,
        status: data.status
    };

    // Update financial totals
    if (type === "income") {
        income += amount;

        if (status === "completed") {
            balance += amount;
        }

    } else {
        expenses += amount;

        if (status === "completed") {
            balance -= amount;
        }
    }

    transactions.unshift(newTransaction);

    // Create transaction notification
    notifications.unshift({
        title: "New Transaction Added",
        message: description + " — " + type + " of $" + amount.toLocaleString()
    });

    displayNotifications();

    saveData();

    await saveBankSettingsToSupabase();

    updateBalance();
    displayTransactions();
    displayDashboardTransactions();
    updateAnalytics();

    transactionForm.reset();

    alert("Transaction added successfully!");

});

// Edit an existing transaction
let editingTransactionId = null;

function editTransaction(id) {

    if (!isAdmin()) {
        alert("You are not authorized to edit transactions.");
        return;
    }

    const transaction = transactions.find(function(item) {
        return Number(item.id) === Number(id);
    });

    if (!transaction) return;

    editingTransactionId = id;

    document.getElementById("edit-description").value =
        transaction.description;

    document.getElementById("edit-amount").value =
        transaction.amount;

    document.getElementById("edit-category").value =
        transaction.category;

    document.getElementById("edit-type").value =
        transaction.type;

    document.getElementById("edit-status").value =
        transaction.status;

    document.getElementById("edit-transaction-modal").hidden = false;
}

// Save edited transaction
document.getElementById("edit-transaction-form")
.addEventListener("submit", async function(event) {

    event.preventDefault();

    if (!isAdmin() || editingTransactionId === null) {
        return;
    }

    const transaction = transactions.find(function(item) {
        return Number(item.id) === Number(editingTransactionId);
    });

    if (!transaction) return;

    const newDescription =
        document.getElementById("edit-description").value.trim();

    const newAmount =
        Number(document.getElementById("edit-amount").value);

    const newCategory =
        document.getElementById("edit-category").value.trim();

    const newType =
        document.getElementById("edit-type").value;

    const newStatus =
        document.getElementById("edit-status").value;

    if (!newDescription || !newCategory ||
        !Number.isFinite(newAmount) || newAmount <= 0) {

        alert("Please enter valid transaction details.");
        return;
    }

    // Remember previous financial values
    const oldAmount = transaction.amount;
    const oldType = transaction.type;
    const oldStatus = transaction.status;

    // Calculate previous financial contributions
    const oldIncome = oldType === "income" ? oldAmount : 0;
    const oldExpenses = oldType === "expense" ? oldAmount : 0;

    const oldBalance = oldStatus === "completed"
        ? (oldType === "income" ? oldAmount : -oldAmount)
        : 0;

    // Calculate new financial contributions
    const newIncome = newType === "income" ? newAmount : 0;
    const newExpenses = newType === "expense" ? newAmount : 0;

    const newBalance = newStatus === "completed"
        ? (newType === "income" ? newAmount : -newAmount)
        : 0;

    // Update Supabase
    const { error } = await supabaseClient
        .from("transactions")
        .update({
            description: newDescription,
            amount: newAmount,
            category: newCategory,
            type: newType,
            status: newStatus
        })
        .eq("id", editingTransactionId);

    if (error) {
        console.error("Transaction update failed:", error);
        alert("Could not update transaction. Please try again.");
        return;
    }

    // Update local transaction
    transaction.description = newDescription;
    transaction.amount = newAmount;
    transaction.category = newCategory;
    transaction.type = newType;
    transaction.status = newStatus;

    // Update financial totals
    income += newIncome - oldIncome;
    expenses += newExpenses - oldExpenses;
    balance += newBalance - oldBalance;

    saveData();

    await saveBankSettingsToSupabase();

    updateBalance();
    displayTransactions();
    displayDashboardTransactions();
    updateAnalytics();

    document.getElementById("edit-transaction-modal").hidden = true;

    editingTransactionId = null;

    alert("Transaction updated successfully!");

});

// Close edit transaction modal
function closeEditTransactionModal() {

    document.getElementById("edit-transaction-modal").hidden = true;

    editingTransactionId = null;

}

// Cancel button
document.getElementById("cancel-edit")
.addEventListener("click", closeEditTransactionModal);

// Close icon button
document.getElementById("close-edit-modal")
.addEventListener("click", closeEditTransactionModal);

// 8. Delete transactions

async function deleteTransaction(id) {
    if (!isAdmin()) {
        alert("You are not authorized to delete transactions.");
        return;
    }

    const transaction = transactions.find(function(item) {
        return Number(item.id) === Number(id);
    });

    if (!transaction) return;

    const confirmed = confirm("Are you sure you want to delete this transaction?");

    if (!confirmed) return;

    // Delete transaction from Supabase
    const { error } = await supabaseClient
        .from("transactions")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Could not delete transaction:", error);
        alert("Transaction could not be deleted. Please try again.");
        return;
    }

    // Create deletion notification
    await createNotification(
    "Transaction Deleted",
    transaction.description + " was successfully deleted."
);

    displayNotifications();

    // Reverse the transaction's financial effect
    if (transaction.type === "income") {
        income -= transaction.amount;

        if (transaction.status === "completed") {
            balance -= transaction.amount;
        }

    } else {
        expenses -= transaction.amount;

        if (transaction.status === "completed") {
            balance += transaction.amount;
        }
    }

    // Remove transaction locally
    transactions = transactions.filter(function(item) {
        return Number(item.id) !== Number(id);
    });

    saveData();

    await saveBankSettingsToSupabase();

    updateBalance();
    displayTransactions();
    displayDashboardTransactions();
    updateAnalytics();

    alert("Transaction deleted successfully!");
}


// Display recent transactions on the dashboards

   // Display recent transactions on the dashboard
function displayDashboardTransactions() {

    transactionList.innerHTML = "";

    transactions.slice(0, 5).forEach(function(transaction) {

        const row = document.createElement("tr");

        // Description and category icon
        const descriptionCell = document.createElement("td");

        const transactionInfo = document.createElement("div");
        transactionInfo.className = "transaction-description";

        const icon = document.createElement("span");
        icon.className = "transaction-icon";

        const category = (transaction.category || "").toLowerCase();

        if (category.includes("food")) {
            icon.textContent = "🍽️";
        } else if (category.includes("shopping")) {
            icon.textContent = "🛍️";
        } else if (category.includes("transport")) {
            icon.textContent = "🚗";
        } else if (category.includes("entertainment")) {
            icon.textContent = "🎬";
        } else if (transaction.type === "income") {
            icon.textContent = "💰";
        } else {
            icon.textContent = "💳";
        }

        const description = document.createElement("strong");
        description.textContent = transaction.description;

        transactionInfo.appendChild(icon);
        transactionInfo.appendChild(description);
        descriptionCell.appendChild(transactionInfo);

        // Category
        const categoryCell = document.createElement("td");
        categoryCell.textContent = transaction.category;

        // Date
        const dateCell = document.createElement("td");
        dateCell.textContent = transaction.date;

        // Amount
        const amountCell = document.createElement("td");

        amountCell.textContent =
            (transaction.type === "income" ? "+" : "-") +
            formatMoney(transaction.amount);

        amountCell.className = transaction.type;

        // Status
        const statusCell = document.createElement("td");

        const statusBadge = document.createElement("span");
        statusBadge.className = "transaction-status " +
            (transaction.status === "pending" ? "pending" : "completed");

        statusBadge.textContent =
            transaction.status === "pending" ? "Pending" : "Completed";

        statusCell.appendChild(statusBadge);

        row.appendChild(descriptionCell);
        row.appendChild(categoryCell);
        row.appendChild(dateCell);
        row.appendChild(amountCell);
        row.appendChild(statusCell);

        transactionList.appendChild(row);

    });
}

// Update the Analytics page
function updateAnalytics() {

    analyticsIncome.textContent = formatMoney(income);

    analyticsExpenses.textContent = formatMoney(expenses);

    const pendingCount = transactions.filter(function(transaction) {
        return transaction.status === "pending";
    }).length;

    analyticsPending.textContent = pendingCount;

    categoryBreakdown.innerHTML = "";

    const spending = {};

    transactions.forEach(function(transaction) {

        if (transaction.type === "expense") {

            spending[transaction.category] =
                (spending[transaction.category] || 0) + transaction.amount;

        }

    });

    Object.keys(spending).forEach(function(category) {

        const amount = spending[category];

        const percentage = expenses > 0
            ? Math.min((amount / expenses) * 100, 100)
            : 0;

        const item = document.createElement("div");

        item.className = "category-item";

        item.innerHTML = `
            <div class="category-heading">
                <span>${category}</span>
                <strong>${formatMoney(amount)}</strong>
            </div>

            <div class="category-bar">
                <div class="category-progress"
                     style="width: ${percentage}%"></div>
            </div>
        `;

        categoryBreakdown.appendChild(item);

    });
    displayIncomeExpenseChart();
    displaySpendingBreakdownChart();
    displayMonthlyTrendChart();
    updateFinancialInsights();
}

// AXOS BANK - Income vs Expenses Chart

let incomeExpenseChart = null;

function displayIncomeExpenseChart() {

    const chartCanvas = document.getElementById("incomeExpenseChart");

    if (!chartCanvas) return;

    const monthlyIncome = {};
    const monthlyExpenses = {};

    transactions.forEach(function(transaction) {

        if (transaction.status !== "completed") return;

        const transactionDate = new Date(transaction.date);

        if (isNaN(transactionDate.getTime())) return;

        const month = transactionDate.toLocaleString("en-US", {
            month: "short",
            year: "numeric"
        });

        if (transaction.type === "income") {

            monthlyIncome[month] =
                (monthlyIncome[month] || 0) + Number(transaction.amount);

        } else if (transaction.type === "expense") {

            monthlyExpenses[month] =
                (monthlyExpenses[month] || 0) + Number(transaction.amount);

        }

    });

    const months = [...new Set([
        ...Object.keys(monthlyIncome),
        ...Object.keys(monthlyExpenses)
    ])];

    if (incomeExpenseChart) {
        incomeExpenseChart.destroy();
    }

    incomeExpenseChart = new Chart(chartCanvas, {

        type: "bar",

        data: {
            labels: months,

            datasets: [
                {
                    label: "Income",
                    data: months.map(month => monthlyIncome[month] || 0),
                    backgroundColor: "#2878D0",
                    borderRadius: 7
                },

                {
                    label: "Expenses",
                    data: months.map(month => monthlyExpenses[month] || 0),
                    backgroundColor: "#F87171",
                    borderRadius: 7
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "top"
                }
            },

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return "$" + value.toLocaleString("en-US");
                        }
                    }
                }
            }
        }

    });

}


// AXOS BANK - Spending Breakdown Chart

let spendingBreakdownChart = null;

function displaySpendingBreakdownChart() {

    const chartCanvas = document.getElementById("spendingBreakdownChart");

    if (!chartCanvas) return;

    const categorySpending = {};

    transactions.forEach(function(transaction) {

        if (
            transaction.type !== "expense" ||
            transaction.status !== "completed"
        ) {
            return;
        }

        const category = transaction.category;

        categorySpending[category] =
            (categorySpending[category] || 0) +
            Number(transaction.amount);

    });

    const categories = Object.keys(categorySpending);
    const amounts = Object.values(categorySpending);

    if (spendingBreakdownChart) {
        spendingBreakdownChart.destroy();
    }

    spendingBreakdownChart = new Chart(chartCanvas, {

        type: "doughnut",

        data: {
            labels: categories,

            datasets: [{
                data: amounts,

                backgroundColor: [
                    "#2878D0",
                    "#F87171",
                    "#34D399",
                    "#FBBF24",
                    "#A78BFA",
                    "#38BDF8",
                    "#FB923C"
                ],

                borderWidth: 3,
                borderColor: "#FFFFFF",
                hoverOffset: 8
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }

    });

}

// AXOS BANK - Monthly Financial Trends Chart

let monthlyTrendChart = null;

function displayMonthlyTrendChart() {

    const chartCanvas = document.getElementById("monthlyTrendChart");

    if (!chartCanvas) return;

    const monthlyIncome = {};
    const monthlyExpenses = {};

    transactions.forEach(function(transaction) {

        if (transaction.status !== "completed") return;

        const transactionDate = new Date(transaction.date);

        if (isNaN(transactionDate.getTime())) return;

        const monthKey =
            transactionDate.getFullYear() + "-" +
            String(transactionDate.getMonth() + 1).padStart(2, "0");

        const monthLabel = transactionDate.toLocaleString("en-US", {
            month: "short",
            year: "numeric"
        });

        if (transaction.type === "income") {

            monthlyIncome[monthKey] = {
                label: monthLabel,
                amount: (monthlyIncome[monthKey]?.amount || 0) +
                    Number(transaction.amount)
            };

        } else if (transaction.type === "expense") {

            monthlyExpenses[monthKey] = {
                label: monthLabel,
                amount: (monthlyExpenses[monthKey]?.amount || 0) +
                    Number(transaction.amount)
            };

        }

    });

    const months = [...new Set([
        ...Object.keys(monthlyIncome),
        ...Object.keys(monthlyExpenses)
    ])].sort();

    const labels = months.map(function(month) {
        return monthlyIncome[month]?.label ||
            monthlyExpenses[month]?.label;
    });

    const incomeData = months.map(function(month) {
        return monthlyIncome[month]?.amount || 0;
    });

    const expenseData = months.map(function(month) {
        return monthlyExpenses[month]?.amount || 0;
    });

    if (monthlyTrendChart) {
        monthlyTrendChart.destroy();
    }

    monthlyTrendChart = new Chart(chartCanvas, {

        type: "line",

        data: {
            labels: labels,

            datasets: [
                {
                    label: "Income",
                    data: incomeData,
                    borderColor: "#2878D0",
                    backgroundColor: "rgba(40, 120, 208, 0.12)",
                    fill: true,
                    tension: 0.4
                },

                {
                    label: "Expenses",
                    data: expenseData,
                    borderColor: "#F87171",
                    backgroundColor: "rgba(248, 113, 113, 0.10)",
                    fill: true,
                    tension: 0.4
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "top"
                }
            },

            scales: {
                y: {
                    beginAtZero: true,

                    ticks: {
                        callback: function(value) {
                            return "$" + value.toLocaleString("en-US");
                        }
                    }
                }
            }
        }

    });

}

// 9. Search transactions

searchInput.addEventListener("input", function() {

    displayTransactions();

});


// 10. Filter transactions

filterSelect.addEventListener("change", function() {

    displayTransactions();

});

statusFilter.addEventListener("change", function() {
    displayTransactions();
});


// 11. Website navigation

const navigationLinks = document.querySelectorAll(".nav-link");

const pageSections = document.querySelectorAll(".page-section");

navigationLinks.forEach(function(link) {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        const selectedPage = link.dataset.page;

        pageSections.forEach(function(section) {

            section.hidden = true;

        });

        document.getElementById(selectedPage).hidden = false;

        navigationLinks.forEach(function(navLink) {

            navLink.classList.remove("active");

        });

        link.classList.add("active");

    });

});

// Card management

let cardFrozen = localStorage.getItem("finoraCardFrozen") === "true";


function updateCardStatus() {

    if (cardFrozen) {

        cardStatusDisplay.textContent = "Frozen";

        cardStatusDisplay.style.color = "#e5485d";

        freezeCardButton.textContent = "Unfreeze Card";

    } else {

        cardStatusDisplay.textContent = "Active";

        cardStatusDisplay.style.color = "#16a34a";

        freezeCardButton.textContent = "Freeze Card";

    }

}


// Freeze and unfreeze card

freezeCardButton.addEventListener("click", function() {

    cardFrozen = !cardFrozen;

    localStorage.setItem("finoraCardFrozen", cardFrozen);

    updateCardStatus();

});

function displaySavingsGoals() {
    savingsGoalsList.innerHTML = "";

    let totalSaved = 0;

    savingsGoals.forEach(function(goal) {
        totalSaved += Number(goal.saved) || 0;
        let percentage = Math.min(
            (goal.saved / goal.target) * 100,
            100
        );

        const goalCard = document.createElement("div");
        goalCard.className = "savings-goal-card";

        const heading = document.createElement("div");
        heading.className = "savings-goal-header";

        const name = document.createElement("h3");
        name.textContent = goal.name;

        const progressText = document.createElement("span");
        progressText.textContent = Math.round(percentage) + "%";

        heading.appendChild(name);
        heading.appendChild(progressText);

        const amounts = document.createElement("div");
        amounts.className = "savings-goal-details";
        amounts.textContent =
            formatMoney(goal.saved) + " saved of " +
            formatMoney(goal.target);

        const progressBar = document.createElement("div");
        progressBar.className = "savings-progress-bar";

        const progress = document.createElement("div");
        progress.className = "savings-progress";
        progress.style.width = percentage + "%";

        progressBar.appendChild(progress);

        if (isAdmin()) {

    if (isAdmin()) {

    const actions = document.createElement("div");
    actions.className = "savings-goal-actions";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Money";
    addButton.className = "add-savings";
    addButton.dataset.id = goal.id;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-savings";
    editButton.dataset.id = goal.id;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-savings";
    deleteButton.dataset.id = goal.id;

    actions.appendChild(addButton);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    goalCard.appendChild(actions);
}
        }
        goalCard.appendChild(heading);
        goalCard.appendChild(amounts);
        goalCard.appendChild(progressBar);

        savingsGoalsList.appendChild(goalCard);
    });

    totalSavedDisplay.textContent = formatMoney(totalSaved);

activeGoalsDisplay.textContent = savingsGoals.length;

displayDashboardSavingsGoals();

    let dashboardTotalSaved = savingsGoals.reduce(function(total, goal) {
    return total + (Number(goal.saved) || 0);
}, 0);

dashboardTotalSavings.textContent = formatMoney(dashboardTotalSaved);
}

savingsForm.addEventListener("submit", async function(event) {
    if (!isAdmin()) {
        alert("You are not authorized to create savings goals.");
        return;
    }

    event.preventDefault();

    const goalName = goalNameInput.value.trim();
    const goalTarget = Number(goalTargetInput.value);

    if (!goalName || goalTarget <= 0 || !Number.isFinite(goalTarget)) {
        alert("Please enter a valid goal name and target amount.");
        return;
    }

    const newGoal = {
        name: goalName,
        target: goalTarget,
        saved: 0
    };

    const { data, error } = await supabaseClient
        .from("savings_goals")
        .insert([{
            name: newGoal.name,
            target: newGoal.target,
            saved: newGoal.saved
        }])
        .select()
        .single();

    if (error) {
        console.error("Could not create savings goal:", error);
        alert("Could not save your goal. Please try again.");
        return;
    }

    savingsGoals.push({
        id: data.id,
        name: data.name,
        target: Number(data.target),
        saved: Number(data.saved)
    });

    saveSavingsGoals();
    displaySavingsGoals();
    displayDashboardSavingsGoals();

    savingsForm.reset();

    alert("Savings goal created successfully!");
});

savingsGoalsList.addEventListener("click", async function(event) {

    const goalId = Number(event.target.dataset.id);

    const goal = savingsGoals.find(function(item) {
        return item.id === goalId;
    });

    if (!goal) return;


    // ADD MONEY
    if (event.target.classList.contains("add-savings")) {

        if (!isAdmin()) {
            alert("You are not authorized to update savings.");
            return;
        }

        const amountInput = prompt("How much would you like to add?");

        if (amountInput === null) return;

        const amount = Number(amountInput);

        if (!Number.isFinite(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        const newSavedAmount = Math.min(
            Number(goal.saved || 0) + amount,
            Number(goal.target)
        );

        const { error } = await supabaseClient
            .from("savings_goals")
            .update({
                saved: newSavedAmount
            })
            .eq("id", goalId);

        if (error) {
            console.error("Could not update savings:", error);
            alert("Your savings could not be updated. Please try again.");
            return;
        }

        goal.saved = newSavedAmount;

        saveSavingsGoals();
        displaySavingsGoals();

        alert("Your savings have been updated!");
    }


    // EDIT SAVINGS GOAL
    else if (event.target.classList.contains("edit-savings")) {

        if (!isAdmin()) {
            alert("You are not authorized to edit savings goals.");
            return;
        }

        const nameInput = prompt("Enter the new goal name:", goal.name);

        if (nameInput === null) return;

        const newName = nameInput.trim();

        if (!newName) {
            alert("Please enter a valid goal name.");
            return;
        }

        const targetInput = prompt(
            "Enter the new target amount:",
            goal.target
        );

        if (targetInput === null) return;

        const newTarget = Number(targetInput);

        if (!Number.isFinite(newTarget) || newTarget <= 0) {
            alert("Please enter a valid target amount.");
            return;
        }

        if (newTarget < Number(goal.saved || 0)) {
            alert("The target cannot be less than the amount already saved.");
            return;
        }

        const { error } = await supabaseClient
            .from("savings_goals")
            .update({
                name: newName,
                target: newTarget
            })
            .eq("id", goalId);

        if (error) {
            console.error("Could not edit savings goal:", error);
            alert("The savings goal could not be edited. Please try again.");
            return;
        }

        goal.name = newName;
        goal.target = newTarget;

        saveSavingsGoals();
        displaySavingsGoals();

        alert("Savings goal updated successfully!");
    }


    // DELETE SAVINGS GOAL
    else if (event.target.classList.contains("delete-savings")) {

        if (!isAdmin()) {
            alert("You are not authorized to delete savings goals.");
            return;
        }

        const confirmed = confirm(
            "Are you sure you want to delete this savings goal?"
        );

        if (!confirmed) return;

        const { error } = await supabaseClient
            .from("savings_goals")
            .delete()
            .eq("id", goalId);

        if (error) {
            console.error("Could not delete savings goal:", error);
            alert("The savings goal could not be deleted. Please try again.");
            return;
        }

        savingsGoals = savingsGoals.filter(function(item) {
            return item.id !== goalId;
        });

        saveSavingsGoals();
        displaySavingsGoals();

        alert("Savings goal deleted successfully!");
    }

});

function displayDashboardSavingsGoals() {
    dashboardSavingsGoals.innerHTML = "";

    savingsGoals.forEach(function(goal) {
        const percentage = Math.min(
            (goal.saved / goal.target) * 100,
            100
        );

        const goalItem = document.createElement("div");
        goalItem.className = "goal-item";

        const goalHeader = document.createElement("div");
        goalHeader.className = "goal-header";

        const goalTitle = document.createElement("div");
        goalTitle.className = "goal-title";

        const icon = document.createElement("span");
        icon.className = "goal-icon";
        icon.textContent = "🎯";

        const name = document.createElement("strong");
        name.textContent = goal.name;

        goalTitle.appendChild(icon);
        goalTitle.appendChild(name);

        const percentageLabel = document.createElement("span");
        percentageLabel.className = "goal-percentage";
        percentageLabel.textContent = Math.round(percentage) + "%";

        goalHeader.appendChild(goalTitle);
        goalHeader.appendChild(percentageLabel);

        const amount = document.createElement("div");
        amount.className = "goal-amount";
        amount.textContent =
            formatMoney(goal.saved) + " of " +
            formatMoney(goal.target);

        const goalBar = document.createElement("div");
        goalBar.className = "goal-bar";

        const progress = document.createElement("div");
        progress.className = "goal-progress";
        progress.style.width = percentage + "%";

        goalBar.appendChild(progress);

        const completed = document.createElement("small");
        completed.className = "goal-completed";
        completed.textContent = "Goal progress";

        goalItem.appendChild(goalHeader);
        goalItem.appendChild(amount);
        goalItem.appendChild(goalBar);
        goalItem.appendChild(completed);

        dashboardSavingsGoals.appendChild(goalItem);
    });
}

profileForm.addEventListener("submit", async function(event) {
    if (!isAdmin()) {
        alert("You are not authorized to update bank settings.");
        return;
    }

    event.preventDefault();

    profileData = {
        name: profileNameInput.value.trim(),
        email: profileEmailInput.value.trim(),
        phone: profilePhoneInput.value.trim()
    };

    const { error } = await supabaseClient
        .from("bank_settings")
        .update({
            profile_name: profileData.name,
            profile_email: profileData.email,
            profile_phone: profileData.phone || null
        })
        .eq("id", 1);

    if (error) {
        console.error("Could not update profile:", error);
        alert("Profile could not be saved. Please try again.");
        return;
    }

    localStorage.setItem(
        "axosBankProfile",
        JSON.stringify(profileData)
    );

    alert("Profile information saved successfully!");
});

// Axos Bank NOTIFICATIONS

const notificationButton = document.getElementById("notification-button");
const notificationCount = document.getElementById("notification-count");
const notificationPanel = document.getElementById("notification-panel");
const clearNotificationsButton = document.getElementById("clear-notifications");

let notifications = [];
function displayNotifications() {

    const notificationList = document.getElementById("notification-list");

    notificationCount.textContent = notifications.length;

    if (notifications.length === 0) {
        notificationList.innerHTML = `
            <p class="empty-notifications">You're all caught up!</p>
        `;
        return;
    }

    notificationList.innerHTML = notifications.map(function(notification) {
        return `
            <div class="notification-item">
                <strong>${notification.title}</strong>
                <p>${notification.message}</p>
            </div>
        `;
    }).join("");

}

async function loadNotificationsFromSupabase() {

    const { data, error } = await supabaseClient
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Could not load notifications:", error);
        alert("Notifications could not be loaded.");
        return;
    }

    notifications = data.map(function(item) {
        return {
            id: item.id,
            title: item.title,
            message: item.message
        };
    });

    displayNotifications();

    console.log("Notifications loaded successfully from Supabase!");

}

async function createNotification(title, message) {

    const { data, error } = await supabaseClient
        .from("notifications")
        .insert([{
            title: title,
            message: message
        }])
        .select()
        .single();

    if (error) {
        console.error("Could not save notification:", error);
        return false;
    }

    notifications.unshift({
        id: data.id,
        title: data.title,
        message: data.message
    });

    displayNotifications();

    return true;
}

notificationButton.addEventListener("click", function() {
    notificationPanel.classList.toggle("show");
});

clearNotificationsButton.addEventListener("click", async function() {
if (!isAdmin()) {
        alert("You are not authorized to clear notifications.");
        return;
    }

    const confirmed = confirm("Are you sure you want to clear all notifications?");

    if (!confirmed) return;

    const { error } = await supabaseClient
        .from("notifications")
        .delete()
        .not("id", "is", null);

    if (error) {
        console.error("Could not clear notifications:", error);
        alert("Notifications could not be cleared. Please try again.");
        return;
    }

    notifications = [];

    displayNotifications();

    alert("All notifications cleared successfully!");

});


// AXOS BANK LOGOUT SYSTEM

const logoutButton = document.getElementById("logout-button");

function logoutUser() {
    localStorage.removeItem("finoraLoggedIn");
    window.location.href = "login.html";
}

logoutButton.addEventListener("click", function() {
    logoutUser();
});


// AUTOMATIC LOGOUT AFTER 10 MINUTES OF INACTIVITY

let inactivityTimer;

const inactivityLimit = 10 * 60 * 1000;

function resetInactivityTimer() {

    clearTimeout(inactivityTimer);

    inactivityTimer = setTimeout(function() {
        alert("You have been logged out due to inactivity.");
        logoutUser();
    }, inactivityLimit);
}

const activityEvents = [
    "mousemove",
    "mousedown",
    "keydown",
    "scroll",
    "touchstart",
    "click"
];

activityEvents.forEach(function(event) {
    document.addEventListener(event, resetInactivityTimer);
});

resetInactivityTimer();

// Axos Bank DASHBOARD PROFILE

function displayDashboardProfile() {
    const savedProfile = JSON.parse(
        localStorage.getItem("finoraProfile")
    );

    if (!savedProfile) {
        return;
    }

    const nameElement = document.getElementById("dashboard-profile-name");
    const initialsElement = document.getElementById("profile-initials");

    if (nameElement) {
        nameElement.textContent = savedProfile.name;
    }

    if (initialsElement) {
        const initials = savedProfile.name
            .trim()
            .split(/\s+/)
            .map(part => part.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase();

        initialsElement.textContent = initials;
    }
}

// AXOS BANK - Financial Insights

function updateFinancialInsights() {

    const completedTransactions = transactions.filter(function(transaction) {
        return transaction.status === "completed";
    });

    let totalIncome = 0;
    let totalExpenses = 0;

    const categorySpending = {};

    completedTransactions.forEach(function(transaction) {

        const amount = Number(transaction.amount) || 0;

        if (transaction.type === "income") {

            totalIncome += amount;

        } else if (transaction.type === "expense") {

            totalExpenses += amount;

            categorySpending[transaction.category] =
                (categorySpending[transaction.category] || 0) + amount;

        }

    });

    // Calculate savings rate

    const savingsRate = totalIncome > 0
        ? ((totalIncome - totalExpenses) / totalIncome) * 100
        : 0;

    // Find top spending category

    let topCategory = "N/A";
    let highestSpending = 0;

    Object.keys(categorySpending).forEach(function(category) {

        if (categorySpending[category] > highestSpending) {

            highestSpending = categorySpending[category];
            topCategory = category;

        }

    });

    // Calculate net cash flow

    const netCashFlow = totalIncome - totalExpenses;

    // Update the dashboard elements

    document.getElementById("insight-savings-rate").textContent =
        savingsRate.toFixed(1) + "%";

    document.getElementById("insight-top-category").textContent =
        topCategory;

    document.getElementById("insight-cash-flow").textContent =
        formatMoney(netCashFlow);

    document.getElementById("insight-completed-count").textContent =
        completedTransactions.length;

}

async function migrateTransactionsToSupabase() {

    const savedData = JSON.parse(
        localStorage.getItem("axosBankData")
    );

    if (!savedData || !savedData.transactions) {
        console.error("No saved transactions found.");
        return;
    }

    const transactionData = savedData.transactions.map(function(item) {
        return {
            description: item.description,
            category: item.category,
            date: item.date,
            amount: item.amount,
            type: item.type,
            status: item.status
        };
    });

    const { data, error } = await supabaseClient
        .from("transactions")
        .insert(transactionData)
        .select();

    if (error) {
        console.error("Migration failed:", error);
        return;
    }

    console.log("Transactions migrated successfully:", data);
}

async function migrateTransactionsToSupabase() {

    const savedData = JSON.parse(
        localStorage.getItem("axosBankData")
    );

    if (!savedData || !savedData.transactions) {
        console.error("No saved transactions found.");
        return;
    }

    const transactionData = savedData.transactions.map(function(item) {
        return {
            description: item.description,
            category: item.category,
            transaction_date: item.date,
            amount: item.amount,
            type: item.type,
            status: item.status
        };
    });

    const { data, error } = await supabaseClient
        .from("transactions")
        .insert(transactionData)
        .select();

    if (error) {
        console.error("Migration failed:", error);
        return;
    }

    console.log("Transactions migrated successfully:", data);
}

async function migrateSavingsGoalsToSupabase() {

    const savingsGoals = JSON.parse(
        localStorage.getItem("finoraSavingsGoals")
    ) || [];

    if (savingsGoals.length === 0) {
        console.error("No savings goals found.");
        return;
    }

    const goalsData = savingsGoals.map(function(goal) {
        return {
            name: goal.name,
            target: goal.target,
            saved: goal.saved
        };
    });

    const { data, error } = await supabaseClient
        .from("savings_goals")
        .insert(goalsData)
        .select();

    if (error) {
        console.error("Savings goals migration failed:", error);
        return;
    }

    console.log("Savings goals migrated successfully:", data);
}

async function migrateBankSettingsToSupabase() {
    const bankData = JSON.parse(
        localStorage.getItem("axosBankData")
    );

    const profile = JSON.parse(
        localStorage.getItem("finoraProfile")
    );

    if (!bankData || !profile) {
        console.error("Bank or profile data not found.");
        return;
    }

    const settingsData = {
        balance: bankData.balance,
        income: bankData.income,
        expenses: bankData.expenses,
        profile_name: profile.name,
        profile_email: profile.email,
        profile_phone: profile.phone || null
    };

    const { data, error } = await supabaseClient
        .from("bank_settings")
        .insert([settingsData])
        .select();

    if (error) {
        console.error("Bank settings migration failed:", error);
        return;
    }

    console.log("Bank settings migrated successfully:", data);
}

async function migrateNotificationsToSupabase() {
    if (!Array.isArray(notifications) || notifications.length === 0) {
        console.error("No notifications found.");
        return;
    }

    const notificationsData = notifications.map(function(item) {
        return {
            title: item.title,
            message: item.message
        };
    });

    const { data, error } = await supabaseClient
        .from("notifications")
        .insert(notificationsData)
        .select();

    if (error) {
        console.error("Notifications migration failed:", error);
        return;
    }

    console.log(
        "Notifications migrated successfully:",
        data.length
    );
}

async function loadSavingsGoalsFromSupabase() {
    const { data, error } = await supabaseClient
        .from("savings_goals")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error("Could not load savings goals:", error);
        return;
    }

    savingsGoals = data.map(function(goal) {
        return {
            id: goal.id,
            name: goal.name,
            target: Number(goal.target),
            saved: Number(goal.saved)
        };
    });

    saveSavingsGoals();
    displaySavingsGoals();
    displayDashboardSavingsGoals();

    totalSavedDisplay.textContent = formatMoney(
        savingsGoals.reduce(function(total, goal) {
            return total + goal.saved;
        }, 0)
    );

    activeGoalsDisplay.textContent = savingsGoals.length;

    console.log("Savings goals loaded successfully!");
}

async function saveBankSettingsToSupabase() {
    const { error } = await supabaseClient
        .from("bank_settings")
        .update({
            balance: balance,
            income: income,
            expenses: expenses
        })
        .eq("id", 1);

    if (error) {
        console.error("Could not save bank settings:", error);
        return false;
    }

    console.log("Bank settings saved successfully!");
    return true;
}

async function loadBankSettingsFromSupabase() {

    const { data, error } = await supabaseClient
        .from("bank_settings")
        .select("balance, income, expenses")
        .eq("id", 1)
        .single();

    if (error) {
        console.error("Could not load bank settings:", error);
        alert("Bank settings could not be loaded.");
        return false;
    }

    // Load financial figures from Supabase
    balance = Number(data.balance);
    income = Number(data.income);
    expenses = Number(data.expenses);

    // Update local backup
    saveData();

    // Display updated financial figures
    updateBalance();

    console.log("Bank settings loaded successfully from Supabase!");

    return true;
}

// Load transactions directly from Supabase

async function loadTransactionsFromSupabase() {

    const { data, error } = await supabaseClient
        .from("transactions")
        .select("*");

    if (error) {
        console.error("Could not load transactions:", error);
        alert("Transactions could not be loaded. Please refresh the page.");
        return;
    }

    // Convert different date formats into comparable timestamps
    function getTransactionTimestamp(dateValue) {

        if (!dateValue) return 0;

        const dateText = String(dateValue);
        let parsedDate;

        if (/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {

            parsedDate = new Date(dateText + "T00:00:00");

        } else if (dateText.includes("/")) {

            const parts = dateText.split("/");

            parsedDate = new Date(
                Number(parts[2]),
                Number(parts[0]) - 1,
                Number(parts[1])
            );

        } else {

            parsedDate = new Date(dateText);

        }

        const timestamp = parsedDate.getTime();

        return Number.isFinite(timestamp) ? timestamp : 0;
    }

    // Sort database records before formatting their dates
    data.sort(function(a, b) {

    const dateDifference =
        getTransactionTimestamp(b.transaction_date) -
        getTransactionTimestamp(a.transaction_date);

    if (dateDifference !== 0) {
        return dateDifference;
    }

    return new Date(b.created_at).getTime() -
           new Date(a.created_at).getTime();

});

    // Convert database records into website transactions
    transactions = data.map(function(item) {

        return {
            id: item.id,
            description: item.description,
            category: item.category,
            date: new Date(item.transaction_date).toLocaleDateString("en-US"),
            amount: Number(item.amount),
            type: item.type,
            status: item.status
        };

    });

    saveData();

    displayTransactions();
    displayDashboardTransactions();
    updateAnalytics();

    console.log("Transactions loaded successfully from Supabase!");
}
displayDashboardProfile();
displayNotifications();

// Initialize card

updateCardStatus();

function applyRoleBasedAccess() {

    const adminOnlyElements = document.querySelectorAll("[data-admin-only]");

    adminOnlyElements.forEach(function(element) {

        element.hidden = !isAdmin();

    });

}

// 12. Initialize website

async function initializeWebsite() {

    await loadTransactionsFromSupabase();

    await loadSavingsGoalsFromSupabase();

    await loadBankSettingsFromSupabase();

    await loadProfile();
    await loadNotificationsFromSupabase();
    applyRoleBasedAccess();

    updateBalance();

    displayTransactions();

    displayDashboardTransactions();

    updateAnalytics();

}
// =================================
// MOBILE SIDEBAR MENU
// =================================

const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileSidebar = document.querySelector(".sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");

function closeMobileMenu() {
    mobileSidebar.classList.remove("open");
    sidebarOverlay.classList.remove("active");
}

mobileMenuButton.addEventListener("click", function() {
    mobileSidebar.classList.toggle("open");
    sidebarOverlay.classList.toggle("active");
});

sidebarOverlay.addEventListener("click", closeMobileMenu);

// Close menu after selecting a navigation link
document.querySelectorAll(".navigation .nav-link").forEach(function(link) {
    link.addEventListener("click", closeMobileMenu);
});

// Close menu when Escape is pressed
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeMobileMenu();
    }
});

initializeWebsite();