// let priceInput = 19.5;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

// define currency values
let currencyValues = {
  PENNY: 0.01,
  NICKEL: 0.05,
  DIME: 0.1,
  QUARTER: 0.25,
  ONE: 1,
  FIVE: 5,
  TEN: 10,
  TWENTY: 20,
  "ONE HUNERED": 100,
};

// access dom nodes
const changeDueDiv = document.querySelector(".change-due");
const modalChangeDueDiv = document.querySelector(".modal-change-due");
const priceInput = document.getElementById("price-input");
const cash = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const priceSpan = document.querySelector(".price");
const paidSpan = document.querySelector(".paid");
const cashInDrawerList = document.getElementById("cash-in-drawer");
const confirmModal = document.querySelector(".modal");
const confirmBtn = document.getElementById("confirm-btn");
const cancelBtn = document.getElementById("cancel-btn");
const modalBg = document.getElementById("modal-display");

// declare variables
let price = 0;
let changeDueArray = [];

// render change in drawer
const updateCashDrawer = () => {
  // deduct the returned change from thee cash drawer
  for (let i = cid.length - 1; i >= 0; i--) {
    for (let j = changeDueArray.length - 1; j >= 0; j--) {
      if (changeDueArray[j][0] === cid[i][0]) {
        cid[i][1] -= changeDueArray[j][1];
      }
    }
  }

  cashInDrawerList.innerHTML = cid
    .map((category) => {
      return `<li><strong>${category[0]}</strong> : $ ${category[1]}</li>`;
    })
    .join("");
};

const purchase = (cash) => {
  if (cash === price) {
    changeDueDiv.textContent = "No change due - customer paid with exact cash";
    return;
  }

  let changeDue = Number((cash - price).toFixed(2));
  let totalCID = Number(
    cid.reduce((sum, denom) => sum + denom[1], 0).toFixed(2)
  );

  if (totalCID < changeDue) {
    changeDueDiv.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  if (totalCID === changeDue) {
    changeDueDiv.textContent = "Status: CLOSED";
    changeDueArray = cid.filter((cash) => cash[1] !== 0); // return all cash in drawer

    changeDueDiv.innerHTML = `<p>Status: CLOSED</p>`;
    modalChangeDueDiv.innerHTML = `<p>Status: OPEN</p>`;
    changeDueArray.forEach(([denom, amount]) => {
      changeDueDiv.innerHTML += `<p>${denom}: $${amount}</p>`;
      modalChangeDueDiv.innerHTML += `<p>${denom}: $${amount}</p>`;
    });
  } else {
    // when cash is more than price and change due is less than totalCID
    for (let i = cid.length - 1; i >= 0; i--) {
      let [denom, amount] = cid[i]; // extract cash denomnation info
      let unitValue = currencyValues[denom]; // get unit value of the currency
      let needed = Math.floor(changeDue / unitValue); // number of coins/bills needed
      let available = amount / unitValue; // number of bills/coins in drawer
      let used = Math.min(needed, available); // use only what's needed or only what's available

      if (used > 0) {
        let returnAmount = used * unitValue;
        changeDue = Number((changeDue - returnAmount).toFixed(2));
        changeDueArray.push([denom, returnAmount]);
      }
    }

    if (changeDue > 0) {
      changeDueDiv.textContent = "Status: INSUFFICIENT_FUNDS";
      return;
    }

    changeDueDiv.innerHTML = `<p>Status: OPEN</p>`;
    modalChangeDueDiv.innerHTML = `<p>Status: OPEN</p>`;
    changeDueArray.forEach(([denom, amount]) => {
      changeDueDiv.innerHTML += `<p>${denom}: $${amount}</p>`;
      modalChangeDueDiv.innerHTML += `<p>${denom}: $${amount}</p>`;
    });
  }
};

const resetFields = () => {
  priceInput.value = ``;
  cash.value = ``;
  changeDueArray = [];
  changeDueDiv.textContent = ``;
};

document.addEventListener("DOMContentLoaded", () => {
  resetFields();
  updateCashDrawer();
});

purchaseBtn.addEventListener("click", () => {
  // get price input
  price = Number(Number(priceInput.value).toFixed(2));

  // store input cash
  const cashInput = parseFloat(cash.value);

  // update price span and paid span
  priceSpan.textContent = `$ ${price}`;
  paidSpan.textContent = `$ ${cashInput}`;

  if (cashInput < price) {
    window.alert("Customer does not have enough money to purchase the item");
    return;
  }

  if (priceInput.value === "" || cash.value === "") {
    window.alert("Please enter price and cash from customer.");
  } else {
    purchase(cashInput);
    confirmModal.style.display = "flex";
    modalBg.style.display = "flex";
  }
});

confirmBtn.addEventListener("click", () => {
  updateCashDrawer();
  resetFields();
  confirmModal.style.display = "none";
  modalBg.style.display = "none";
});

cancelBtn.addEventListener("click", () => {
  resetFields();
  confirmModal.style.display = "none";
  modalBg.style.display = "none";
});
