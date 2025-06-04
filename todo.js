// Initial tasks array
const initialTasks = [
  "Buy milk",
  "Buy phone",
  "Buy tomatoes",
  "Buy potatoes",
  "Buy yogurt",
];

// Todo list state
let todos = [];
let nextId = 1;

// Get DOM elements
const todoForm = document.querySelector(".todo-form");
const todoInput = document.querySelector(".todo-input");
const todoList = document.querySelector(".todo-list");
const totalTasksSpan = document.querySelector(".total-tasks");
const completedTasksSpan = document.querySelector(".completed-tasks");
const clearCompletedBtn = document.querySelector(".clear-completed");
const clearAllBtn = document.querySelector(".clear-all");

// Initialize app with initial tasks using map
function initApp() {
  // Use map to create todo objects and add them
  initialTasks.map((task) => addTodoItem(task));
  updateStats();
}

// Add new todo item
function addTodoItem(text) {
  const todo = {
    id: nextId++,
    text: text,
    completed: false,
  };
  todos.push(todo);

  // Add new item with animation
  const li = createTodoElement(todo);
  li.classList.add("fade-in");
  todoList.insertBefore(li, todoList.firstChild); // Add to top
  updateStats();
}

// Create todo element (extracted for reusability)
function createTodoElement(todo) {
  const li = document.createElement("li");
  li.className = "todo-item";
  li.dataset.id = todo.id;

  if (todo.completed) {
    li.classList.add("completed");
  }

  li.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${
                  todo.completed ? "checked" : ""
                }>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn">Delete</button>
            `;

  // Add event listeners
  const checkbox = li.querySelector(".todo-checkbox");
  const deleteBtn = li.querySelector(".delete-btn");

  checkbox.addEventListener("change", () => toggleTodoWithAnimation(todo.id));
  deleteBtn.addEventListener("click", () => deleteTodoWithAnimation(todo.id));

  return li;
}

// Update statistics with animations
function updateStats() {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;

  totalTasksSpan.textContent = total;
  completedTasksSpan.textContent = completed;

  // Update progress rings
  updateProgressRing("total-progress", total, Math.max(total, 10));
  updateProgressRing("completed-progress", completed, Math.max(total, 1));
}

// Update circular progress rings
function updateProgressRing(id, current, max) {
  const circle = document.getElementById(id);
  const circumference = 2 * Math.PI * 26; // r = 26
  const progress = max > 0 ? (current / max) * circumference : 0;
  const offset = circumference - progress;

  circle.style.strokeDashoffset = offset;
}

// Render all todos with sorting and animations
function renderAllTodos(animate = false) {
  const sortedTodos = getSortedTodos();
  todoList.innerHTML = "";

  // Use map instead of forEach for functional approach
  sortedTodos.map((todo, index) => {
    const li = createTodoElement(todo);

    if (animate) {
      li.style.animationDelay = `${index * 50}ms`;
      li.classList.add("fade-in");
    }

    todoList.appendChild(li);
    return li; // Return for map functionality
  });

  updateStats();
}

// Sort todos: incomplete first, completed last
function getSortedTodos() {
  return [...todos].sort((a, b) => {
    if (a.completed === b.completed) {
      return a.id - b.id; // Keep original order within same status
    }
    return a.completed ? 1 : -1; // Completed tasks go to bottom
  });
}

// Toggle todo with smooth animation
function toggleTodoWithAnimation(id) {
  const todo = todos.find((t) => t.id === id);
  const todoElement = document.querySelector(`[data-id="${id}"]`);

  if (todo && todoElement) {
    todo.completed = !todo.completed;

    if (todo.completed) {
      // Add dropping animation
      todoElement.classList.add("dropping");
      setTimeout(() => {
        todoElement.classList.remove("dropping");
        renderAllTodos(false); // Re-render to sort
      }, 800);
    } else {
      // Add rising animation
      todoElement.classList.add("rising");
      setTimeout(() => {
        todoElement.classList.remove("rising");
        renderAllTodos(false); // Re-render to sort
      }, 600);
    }

    updateStats();
  }
}

// Delete todo with animation
function deleteTodoWithAnimation(id) {
  const todoElement = document.querySelector(`[data-id="${id}"]`);

  if (todoElement) {
    todoElement.style.animation = "fadeOut 0.3s ease-out forwards";

    setTimeout(() => {
      todos = todos.filter((t) => t.id !== id);
      renderAllTodos(false);
    }, 300);
  }
}

// Clear completed todos with animation
function clearCompleted() {
  const completedElements = document.querySelectorAll(".todo-item.completed");

  // Use map for functional approach
  Array.from(completedElements).map((element, index) => {
    element.style.animation = `fadeOut 0.3s ease-out ${index * 100}ms forwards`;
    return element;
  });

  setTimeout(() => {
    todos = todos.filter((todo) => !todo.completed);
    renderAllTodos(true);
  }, completedElements.length * 100 + 300);
}

// Clear all todos with staggered animation
function clearAll() {
  const allElements = document.querySelectorAll(".todo-item");

  // Use map for staggered animation
  Array.from(allElements).map((element, index) => {
    element.style.animation = `fadeOut 0.3s ease-out ${index * 50}ms forwards`;
    return element;
  });

  setTimeout(() => {
    todos = [];
    renderAllTodos(false);
  }, allElements.length * 50 + 300);
}



// Event listeners
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();

  if (text) {
    addTodoItem(text);
    todoInput.value = "";
    updateStats();
  }
});

clearCompletedBtn.addEventListener("click", clearCompleted);
clearAllBtn.addEventListener("click", clearAll);

// Initialize the app
initApp();
