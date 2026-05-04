let tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
let currentFilter = 'all';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const stats = document.getElementById('stats');
const toast = document.getElementById('notification');

renderTasks();

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (text === '') {
    showNotification('Please enter a task!');
    return;
  }

  const newTask = {
    id: Date.now(),
    text,
    completed: false
  };

  tasks.unshift(newTask);
  saveTasks();
  taskInput.value = '';
  renderTasks();
  showNotification('Task added successfully!');
}


function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
    showNotification(task.completed ? 'Task completed!' : 'Task marked as pending');
  }
}


function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this task?')) return;
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
  showNotification('Task deleted!');
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    renderTasks();
  });
});

function renderTasks() {
  let filteredTasks = tasks;

  if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<div class="empty">No tasks yet. Add one above!</div>';
  } else {
    taskList.innerHTML = filteredTasks.map(task => `
      <li class="task ${task.completed ? 'completed' : ''}">
        <input type="checkbox" class="checkbox"
               ${task.completed ? 'checked' : ''}
               onchange="toggleTask(${task.id})">
        <span class="task-text">${escapeHtml(task.text)}</span>
        <button class="del-btn" onclick="deleteTask(${task.id})">Delete</button>
      </li>
    `).join('');
  }

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  stats.textContent = `${total} Total • ${pending} Pending • ${completed} Completed`;
}

function saveTasks() {
  localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

function showNotification(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

const toggleBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    toggleBtn.textContent = "☀️";
}

toggleBtn.onclick = () => {
    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        localStorage.setItem("theme", "light");
        toggleBtn.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "dark");
        toggleBtn.textContent = "🌙";
    }
};