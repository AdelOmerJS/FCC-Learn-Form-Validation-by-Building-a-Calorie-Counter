import "../style.css";

const calorieCounter = document.getElementById("calorie-counter");
const budgetNumberInput = document.getElementById("budget");
const entryDropdown = document.getElementById("entry-dropdown");
const addEntryButton = document.getElementById("add-entry");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");
let isError = false;

function cleanInputString(str) {
  // const strArray = str.split("");
  // const cleanStrArray = [];
  // for (let i = 0; i < strArray.length; i++) {
  //   if (!["+", "-", " "].includes(strArray[i])) {
  //     cleanStrArray.push(strArray[i]);
  //   }
  // }
  const regex = /[+-\s]/g;
  return str.replace(regex, "");
}

function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

// allow users to add entries to the calorie counter
function addEntry() {
  const targetInputContainer = document.querySelector(
    `#${entryDropdown.value} .input-container`
  );

  const entryNumber =
    targetInputContainer.querySelectorAll('input[type="text"]').length + 1;

  let HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" placeholder="Name" id="${entryDropdown.value}-${entryNumber}-name"/>
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input type="number" min="0" placeholder="Calories" id="${entryDropdown.value}-${entryNumber}-calories"/>
  `;
  // targetInputContainer.innerHTML += HTMLString;
  targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}

// get the calorie counts from the user's entries
function getCaloriesFromInputs(list) {
  let calories = 0;
  for (const item of list) {
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);

    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    calories += Number(currVal);
  }
  return calories;
}

function calculateCalories(e) {
  e.preventDefault();
  isError = false;

  let breakfastNumberInputs = document.querySelectorAll(
    "#breakfast input[type=number]"
  );
  let lunchNumberInputs = document.querySelectorAll(
    "#lunch input[type=number]"
  );
  let dinnerNumberInputs = document.querySelectorAll(
    "#dinner input[type=number]"
  );
  let snacksNumberInputs = document.querySelectorAll(
    "#snacks input[type=number]"
  );
  let exerciseNumberInputs = document.querySelectorAll(
    "#exercise input[type=number]"
  );

  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);

  let budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) {
    return;
  }
  let consumedCalories =
    breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories =
    budgetCalories - consumedCalories + exerciseCalories;

  const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";
  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(
    remainingCalories
  )} Calorie ${surplusOrDeficit}</span>
  <hr />
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;
  output.classList.remove("hide");
}
function clearForm() {
  const inputContainers = Array.from(
    document.querySelectorAll(".input-container")
  );
  for (const container of inputContainers) {
    container.innerHTML = "";
  }
  budgetNumberInput.value = "";
  output.innerText = "";
  output.classList.add("hide");
}
calorieCounter.addEventListener("submit", calculateCalories);
addEntryButton.addEventListener("click", addEntry);
clearButton.addEventListener("click", clearForm);
