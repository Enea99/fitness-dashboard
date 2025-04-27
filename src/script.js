// Display user name
const currentUser = localStorage.getItem("currentUser");
document.getElementById("user-display").textContent = currentUser || "User";

// Logout function with confirmation
function logout() {
  if (confirm("Are you sure you want to log out?")) {
    // Remove login and profile data from localStorage
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("profile"); // Remove profile data too
    window.location.href = "index.html"; // Redirect to login page
  }
}

// Save profile (stores data under specific user key)
function saveProfile() {
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const weight = document.getElementById("weight").value;
  const height = document.getElementById("height").value;

  if (!name || !age || !weight || !height) {
    alert("Please fill in all the fields.");
    return;
  }

  if (age <= 0 || age > 120) {
    alert("Please enter a valid age.");
    return;
  }
  
  if (weight <= 0 || weight > 500) {
    alert("Please enter a valid weight.");
    return;
  }

  if (height <= 0 || height > 300) {
    alert("Please enter a valid height.");
    return;
  }

  const profile = { name, age, weight, height };
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    // Save profile data under the user's username in localStorage
    localStorage.setItem(currentUser + "_profile", JSON.stringify(profile));
    alert("Profile saved!");
  } else {
    alert("User is not logged in.");
  }
}

// Function to display saved profile
function loadProfile() {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    const profile = JSON.parse(localStorage.getItem(currentUser + "_profile"));
    if (profile) {
      document.getElementById("name").value = profile.name || "";
      document.getElementById("age").value = profile.age || "";
      document.getElementById("weight").value = profile.weight || "";
      document.getElementById("height").value = profile.height || "";
    }
  }
}

// Load profile when the page loads
loadProfile();

// Chart setup
const ctx = document.getElementById("caloriesChart").getContext("2d");
const caloriesChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // Days of the week starting from Sunday
    datasets: [{
      label: "Calories Burned",
      data: [0, 0, 0, 0, 0, 0, 0], // Initialize all days with 0
      backgroundColor: "rgba(59, 91, 255, 0.1)",
      borderColor: "#3b5bff",
      fill: true,
      tension: 0.4
    },
    {
      label: "Calories Intake",
      data: [0, 0, 0, 0, 0, 0, 0], // Initialize all days with 0
      backgroundColor: "rgba(255, 165, 0, 0.1)",
      borderColor: "#FFA500",
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  }
});

// Workout handling
const workoutForm = document.getElementById("workout-form");
const workoutsList = document.getElementById("workouts");

let workouts = JSON.parse(localStorage.getItem("workouts")) || [];
let caloriesBurnedToday = 0;

// Nutrition handling
const mealForm = document.getElementById("meal-form");
const mealsList = document.getElementById("meals");

let meals = JSON.parse(localStorage.getItem("meals")) || [];
let caloriesIntakeToday = 0;

// Functions to update overview cards
function updateWorkoutCalories() {
  const workoutCaloriesElement = document.getElementById("workout-calories");
  workoutCaloriesElement.textContent = `${caloriesBurnedToday} kcal`; // Update burned calories card
}

function updateNutritionCalories() {
  const nutritionCaloriesElement = document.getElementById("nutrition-calories");
  nutritionCaloriesElement.textContent = `${caloriesIntakeToday} kcal`; // Update calories intake card
}

// Render workouts
function renderWorkouts() {
  const currentUser = localStorage.getItem("currentUser");
  const workoutsList = document.getElementById("workouts");

  if (currentUser) {
    const workouts = JSON.parse(localStorage.getItem(currentUser + "_workouts")) || [];
    caloriesBurnedToday = workouts.filter(workout => workout.date === getCurrentDay()).reduce((sum, workout) => sum + workout.calories, 0);
    updateWorkoutCalories(); // Update the burned calories in the overview card

    workoutsList.innerHTML = "";
    workouts.forEach((workout) => {
      const li = document.createElement("li");
      li.textContent = `${workout.name} - ${workout.calories} cal (Date: ${workout.date})`; // Add date to the list
      workoutsList.appendChild(li);
    });

    // Update chart with new burned calories for today
    updateChartData(caloriesBurnedToday, 'burned');
  }
}

// Render meals
function renderMeals() {
  const currentUser = localStorage.getItem("currentUser");
  const mealsList = document.getElementById("meals");

  if (currentUser) {
    const meals = JSON.parse(localStorage.getItem(currentUser + "_meals")) || [];
    caloriesIntakeToday = meals.filter(meal => meal.date === getCurrentDay()).reduce((sum, meal) => sum + meal.calories, 0); // Calories today
    updateNutritionCalories(); // Update the calories intake in the overview card

    mealsList.innerHTML = "";
    meals.forEach((meal) => {
      const li = document.createElement("li");
      li.textContent = `${meal.food} - ${meal.calories} cal (Date: ${meal.date})`; // Add date to the list
      mealsList.appendChild(li);
    });

    // Update chart with new calories intake for today
    updateChartData(caloriesIntakeToday, 'intake');
  }
}

// Initial renders
renderWorkouts();
renderMeals();

// Add workout
workoutForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("workout-name").value;
  const cal = parseInt(document.getElementById("calories-burned").value);
  if (!name || isNaN(cal) || cal <= 0) {
    alert("Please enter valid workout details.");
    return;
  }

  const newWorkout = { name, calories: cal, date: getCurrentDay() }; // Store the current day for the workout
  const currentUser = localStorage.getItem("currentUser");

  if (currentUser) {
    let workouts = JSON.parse(localStorage.getItem(currentUser + "_workouts")) || [];
    workouts.push(newWorkout);
    localStorage.setItem(currentUser + "_workouts", JSON.stringify(workouts));
    renderWorkouts();

    // Update the chart with new calories burned for today
    updateChartData(cal, 'burned');  // Add burned calories to the chart
  }

  workoutForm.reset();
});

// Add meal
mealForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const food = document.getElementById("food-item").value;
  const cal = parseInt(document.getElementById("calories-intake").value);
  if (!food || isNaN(cal) || cal <= 0) {
    alert("Please enter valid meal details.");
    return;
  }

  const newMeal = { food, calories: cal, date: getCurrentDay() }; // Store the current day for the meal
  const currentUser = localStorage.getItem("currentUser");

  if (currentUser) {
    let meals = JSON.parse(localStorage.getItem(currentUser + "_meals")) || [];
    meals.push(newMeal);
    localStorage.setItem(currentUser + "_meals", JSON.stringify(meals));
    renderMeals();
  }

  mealForm.reset();
});

// Update chart data with new calories burned or intake value
function updateChartData(calories, type) {
  const currentDayIndex = getCurrentDayIndex();
  if (type === 'burned') {
    caloriesChart.data.datasets[0].data[currentDayIndex] = calories; // Update burned calories 
  } else {
    caloriesChart.data.datasets[1].data[currentDayIndex] = calories; // Update calories intake
  }

  caloriesChart.update(); // Rerender the chart
}

// Get the current day name
function getCurrentDay() {
  const today = new Date();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return daysOfWeek[today.getDay()];
}

// Get the index for the current day in the chart's dataset
function getCurrentDayIndex() {
  const today = new Date();
  return today.getDay(); // return index (0 for Sunday, 1 for Monday, and so on.)
}
