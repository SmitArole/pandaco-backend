class TaskList {
    constructor(apiService) {
        this.apiService = apiService;
        this.tasks = [];
        this.currentUser = null;
    }

    async initialize() {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            this.apiService.set_token(token);
            await this.loadCurrentUser();
            await this.loadTasks();
            this.render();
        } else {
            this.showLoginForm();
        }
    }

    async loadCurrentUser() {
        try {
            const response = await fetch(`${this.apiService.BASE_URL}/users/me/`, {
                headers: this.apiService.get_headers()
            });
            this.currentUser = await response.json();
        } catch (error) {
            console.error('Error loading user:', error);
        }
    }

    async loadTasks() {
        try {
            const params = this.currentUser.is_contractor ? 
                { contractor: this.currentUser.id } : 
                { customer: this.currentUser.id };
            
            this.tasks = await this.apiService.get_tasks(params);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    async createTask(taskData) {
        try {
            const newTask = await this.apiService.create_task(taskData);
            this.tasks.push(newTask);
            this.render();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    }

    async updateTaskStatus(taskId, status) {
        try {
            await this.apiService.update_task_status(taskId, status);
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                task.status = status;
            }
            this.render();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    render() {
        const container = document.getElementById('task-list');
        if (!container) return;

        container.innerHTML = `
            <div class="task-list-header">
                <h2>${this.currentUser.is_contractor ? 'My Tasks' : 'My Home Maintenance Tasks'}</h2>
                ${!this.currentUser.is_contractor ? `
                    <button onclick="taskList.showCreateTaskForm()" class="btn btn-primary">
                        Create New Task
                    </button>
                ` : ''}
            </div>
            <div class="task-list-content">
                ${this.tasks.map(task => this.renderTask(task)).join('')}
            </div>
        `;
    }

    renderTask(task) {
        return `
            <div class="task-card" data-task-id="${task.id}">
                <div class="task-header">
                    <h3>${task.title}</h3>
                    <span class="status-badge ${task.status}">${task.status}</span>
                </div>
                <div class="task-body">
                    <p>${task.description}</p>
                    <div class="task-details">
                        <p><strong>Location:</strong> ${task.location}</p>
                        <p><strong>Scheduled:</strong> ${new Date(task.scheduled_date).toLocaleDateString()}</p>
                        <p><strong>Budget:</strong> $${task.budget}</p>
                    </div>
                </div>
                <div class="task-actions">
                    ${this.renderTaskActions(task)}
                </div>
            </div>
        `;
    }

    renderTaskActions(task) {
        if (this.currentUser.is_contractor) {
            return `
                <button onclick="taskList.updateTaskStatus(${task.id}, 'in_progress')" 
                        class="btn btn-primary" ${task.status !== 'assigned' ? 'disabled' : ''}>
                    Start Task
                </button>
                <button onclick="taskList.updateTaskStatus(${task.id}, 'completed')" 
                        class="btn btn-success" ${task.status !== 'in_progress' ? 'disabled' : ''}>
                    Mark Complete
                </button>
            `;
        } else {
            return `
                <button onclick="taskList.showContractorList(${task.id})" 
                        class="btn btn-primary" ${task.status !== 'pending' ? 'disabled' : ''}>
                    Assign Contractor
                </button>
                <button onclick="taskList.createTicket(${task.id})" 
                        class="btn btn-warning">
                    Create Support Ticket
                </button>
            `;
        }
    }

    showCreateTaskForm() {
        const container = document.getElementById('task-list');
        container.innerHTML = `
            <div class="create-task-form">
                <h2>Create New Task</h2>
                <form onsubmit="taskList.handleCreateTask(event)">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" name="location" required>
                    </div>
                    <div class="form-group">
                        <label>Scheduled Date</label>
                        <input type="datetime-local" name="scheduled_date" required>
                    </div>
                    <div class="form-group">
                        <label>Budget</label>
                        <input type="number" name="budget" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Create Task</button>
                </form>
            </div>
        `;
    }

    async handleCreateTask(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const taskData = {
            title: formData.get('title'),
            description: formData.get('description'),
            location: formData.get('location'),
            scheduled_date: formData.get('scheduled_date'),
            budget: formData.get('budget'),
            customer: this.currentUser.id,
            status: 'pending'
        };

        await this.createTask(taskData);
        this.render();
    }

    async showContractorList(taskId) {
        try {
            const contractors = await this.apiService.get_contractors();
            const container = document.getElementById('task-list');
            container.innerHTML = `
                <div class="contractor-list">
                    <h2>Available Contractors</h2>
                    <div class="contractor-grid">
                        ${contractors.map(contractor => this.renderContractorCard(contractor, taskId)).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading contractors:', error);
        }
    }

    renderContractorCard(contractor, taskId) {
        return `
            <div class="contractor-card">
                <h3>${contractor.user.first_name} ${contractor.user.last_name}</h3>
                <p><strong>Trade:</strong> ${contractor.trade}</p>
                <p><strong>Rating:</strong> ${contractor.rating}/5.0</p>
                <p><strong>Hourly Rate:</strong> $${contractor.hourly_rate}</p>
                <button onclick="taskList.assignTask(${taskId}, ${contractor.id})" 
                        class="btn btn-primary">
                    Assign
                </button>
            </div>
        `;
    }

    async assignTask(taskId, contractorId) {
        try {
            await this.apiService.assign_task(taskId, contractorId);
            await this.loadTasks();
            this.render();
        } catch (error) {
            console.error('Error assigning task:', error);
        }
    }

    async createTicket(taskId) {
        const container = document.getElementById('task-list');
        container.innerHTML = `
            <div class="create-ticket-form">
                <h2>Create Support Ticket</h2>
                <form onsubmit="taskList.handleCreateTicket(event, ${taskId})">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Create Ticket</button>
                </form>
            </div>
        `;
    }

    async handleCreateTicket(event, taskId) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const ticketData = {
            task: taskId,
            title: formData.get('title'),
            description: formData.get('description'),
            created_by: this.currentUser.id,
            status: 'open'
        };

        try {
            await this.apiService.create_ticket(ticketData);
            await this.loadTasks();
            this.render();
        } catch (error) {
            console.error('Error creating ticket:', error);
        }
    }
}

// Initialize the task list
const taskList = new TaskList(api_service);
document.addEventListener('DOMContentLoaded', () => taskList.initialize()); 