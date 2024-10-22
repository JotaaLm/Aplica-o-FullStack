document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const tasksList = document.getElementById('tasksList');
    const taskCategory = document.getElementById('taskCategory');

    
    fetch('/categories')
        .then(res => res.json())
        .then(categories => {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category._id;
                option.textContent = category.name;
                taskCategory.appendChild(option);
            });
        });

    
    function loadTasks() {
        tasksList.innerHTML = '';
        fetch('/tasks')
            .then(res => res.json())
            .then(tasks => {
                tasks.forEach(task => {
                    const taskItem = document.createElement('div');
                    taskItem.classList.add('task-item');
                    taskItem.innerHTML = `
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                        <p>Category: ${task.category ? task.category.name : 'No Category'}</p>
                        <button data-id="${task._id}" class="delete-btn">Delete</button>
                    `;
                    tasksList.appendChild(taskItem);
                });
            });
    }

    loadTasks();

   
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const category = document.getElementById('taskCategory').value;

        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, category })
        })
            .then(() => {
                loadTasks();
                taskForm.reset();
            });
    });

   
    tasksList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            fetch(`/tasks/${id}`, {
                method: 'DELETE'
            })
                .then(() => loadTasks());
        }
    });
});
