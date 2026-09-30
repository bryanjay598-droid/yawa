
let balance = 2500;
let transactions = [];

const balanceDisplay = document.getElementById("balance");
const transactionList = document.getElementById("transactionList");

const addPanel = document.getElementById("addPanel");
const sendPanel = document.getElementById("sendPanel");

function updateBalance() {
  balanceDisplay.textContent = balance.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP"
  });
}

document.getElementById("showAdd").addEventListener("click", () => {
  addPanel.hidden = !addPanel.hidden;
  sendPanel.hidden = true;
});

document.getElementById("showSend").addEventListener("click", () => {
  sendPanel.hidden = !sendPanel.hidden;
  addPanel.hidden = true;
});

function addTransaction(type, title, amount, details) {
  transactions.unshift({
    type,
    title,
    amount,
    details,
    date: new Date().toLocaleString()
  });

  renderTransactions();
}

document.getElementById("addForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const amount = Number(document.getElementById("addAmount").value);
  const source = document.getElementById("addSource").value;

  if (!Number.isFinite(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  balance += amount;

  addTransaction(
    "in",
    "Money Added",
    amount,
    source
  );

  updateBalance();
  event.target.reset();
  addPanel.hidden = true;

  alert("Money added successfully! (Demo only)");
});

document.getElementById("sendForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const recipient = document.getElementById("recipient").value.trim();
  const walletId = document.getElementById("walletId").value.trim();
  const amount = Number(document.getElementById("sendAmount").value);
  const note = document.getElementById("note").value.trim();

  if (!recipient || !walletId || !Number.isFinite(amount) || amount <= 0) {
    alert("Please complete the form with valid details.");
    return;
  }

  if (amount > balance) {
    alert("Insufficient balance!");
    return;
  }

  balance -= amount;

  const details = note
    ? "To: " + recipient + " · " + note
    : "To: " + recipient;

  addTransaction(
    "out",
    "Money Sent",
    amount,
    details
  );

  updateBalance();
  event.target.reset();
  sendPanel.hidden = true;

  alert("Money sent successfully! (Demo only)");
});

function renderTransactions() {
  transactionList.innerHTML = "";

  if (transactions.length === 0) {
    transactionList.innerHTML =
      '<p class="empty">No transactions yet.</p>';
    return;
  }

  transactions.forEach((transaction) => {
    const item = document.createElement("div");
    item.className = "transaction";

    const icon = document.createElement("div");
    icon.className = "transaction-icon " + transaction.type;
    icon.textContent = transaction.type === "in" ? "↓" : "↑";

    const info = document.createElement("div");
    info.className = "transaction-info";

    const title = document.createElement("strong");
    title.textContent = transaction.title;

    const details = document.createElement("small");
    details.textContent =
      transaction.details + " · " + transaction.date;

    const amount = document.createElement("div");
    amount.className = "transaction-amount " + transaction.type;

    const sign = transaction.type === "in" ? "+" : "−";
    amount.textContent = sign + transaction.amount.toLocaleString(
      "en-PH",
      { style: "currency", currency: "PHP" }
    );

    info.appendChild(title);
    info.appendChild(details);

    item.appendChild(icon);
    item.appendChild(info);
    item.appendChild(amount);

    transactionList.appendChild(item);
  });
}

document.getElementById("clearHistory").addEventListener("click", () => {
  if (transactions.length === 0) {
    alert("No transactions to clear.");
    return;
  }

  const confirmClear = confirm("Clear all transaction history?");

  if (confirmClear) {
    transactions = [];
    renderTransactions();
  }
});

updateBalance();
renderTransactions();