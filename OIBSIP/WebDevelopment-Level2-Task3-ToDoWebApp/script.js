const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');
const pendingEmpty = document.getElementById('pending-empty');
const completedEmpty = document.getElementById('completed-empty');

let tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];
let editingTaskId = null;

function saveTasks() {
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
}

function getFormattedDate() {
    const now = new Date();
    return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + 
           now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    
    const newTask = {
        id: Date.now().toString(),
        text: text,
        completed: false,
        addedAt: getFormattedDate(),
        completedAt: null
    };
    
    tasks.push(newTask);
    taskInput.value = '';
    saveTasks();
    render();
}

function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            const completed = !task.completed;
            return {
                ...task,
                completed: completed,
                completedAt: completed ? getFormattedDate() : null
            };
        }
        return task;
    });
    saveTasks();
    render();
}

function deleteTask(id) {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    if (taskElement) {
        taskElement.classList.add('fade-out');
        setTimeout(() => {
            tasks = tasks.filter(task => task.id !== id);
            if (editingTaskId === id) editingTaskId = null;
            saveTasks();
            render();
        }, 250);
    } else {
        tasks = tasks.filter(task => task.id !== id);
        if (editingTaskId === id) editingTaskId = null;
        saveTasks();
        render();
    }
}

function startEdit(id) {
    editingTaskId = id;
    render();
    const input = document.querySelector(`[data-id="${id}"] .edit-mode-input`);
    if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    }
}

function saveEdit(id) {
    const input = document.querySelector(`[data-id="${id}"] .edit-mode-input`);
    if (input) {
        const text = input.value.trim();
        if (text) {
            tasks = tasks.map(task => {
                if (task.id === id) {
                    return { ...task, text: text };
                }
                return task;
            });
            saveTasks();
        }
    }
    editingTaskId = null;
    render();
}

function render() {
    pendingList.innerHTML = '';
    completedList.innerHTML = '';
    
    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);
    
    pendingCount.textContent = `${pendingTasks.length} pending`;
    completedCount.textContent = `${completedTasks.length} completed`;
    
    if (pendingTasks.length === 0) {
        pendingEmpty.style.display = 'flex';
    } else {
        pendingEmpty.style.display = 'none';
        pendingTasks.forEach(task => {
            pendingList.appendChild(createTaskDOM(task));
        });
    }
    
    if (completedTasks.length === 0) {
        completedEmpty.style.display = 'flex';
    } else {
        completedEmpty.style.display = 'none';
        completedTasks.forEach(task => {
            completedList.appendChild(createTaskDOM(task));
        });
    }
}

function createTaskDOM(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', task.id);
    
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.className = 'checkbox-wrapper';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleComplete(task.id));
    checkboxWrapper.appendChild(checkbox);
    
    const details = document.createElement('div');
    details.className = 'task-details';
    
    const isEditing = task.id === editingTaskId;
    
    if (isEditing) {
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-mode-input';
        editInput.value = task.text;
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveEdit(task.id);
            } else if (e.key === 'Escape') {
                editingTaskId = null;
                render();
            }
        });
        details.appendChild(editInput);
    } else {
        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;
        details.appendChild(textSpan);
    }
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'task-time';
    if (task.completed && task.completedAt) {
        timeSpan.textContent = `Added: ${task.addedAt} • Completed: ${task.completedAt}`;
    } else {
        timeSpan.textContent = `Added: ${task.addedAt}`;
    }
    details.appendChild(timeSpan);
    
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    
    if (!task.completed) {
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.textContent = isEditing ? 'Save' : 'Edit';
        editBtn.addEventListener('click', () => {
            if (isEditing) {
                saveEdit(task.id);
            } else {
                startEdit(task.id);
            }
        });
        actions.appendChild(editBtn);
    }
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    actions.appendChild(deleteBtn);
    
    li.appendChild(checkboxWrapper);
    li.appendChild(details);
    li.appendChild(actions);
    
    return li;
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
});

render();
