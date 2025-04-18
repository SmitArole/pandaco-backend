class ContractorProfile {
    constructor(apiService) {
        this.apiService = apiService;
        this.currentContractor = null;
        this.portfolioItems = [];
        this.reviews = [];
        this.connections = [];
    }

    async initialize(contractorId) {
        try {
            await this.loadContractorProfile(contractorId);
            await this.loadPortfolioItems(contractorId);
            await this.loadReviews(contractorId);
            await this.loadConnections(contractorId);
            this.render();
        } catch (error) {
            console.error('Error initializing contractor profile:', error);
        }
    }

    async loadContractorProfile(contractorId) {
        this.currentContractor = await this.apiService.get_contractor(contractorId);
    }

    async loadPortfolioItems(contractorId) {
        // This would be a new API endpoint for portfolio items
        try {
            const response = await fetch(`${this.apiService.BASE_URL}/contractors/${contractorId}/portfolio/`, {
                headers: this.apiService.get_headers()
            });
            this.portfolioItems = await response.json();
        } catch (error) {
            console.error('Error loading portfolio items:', error);
        }
    }

    async loadReviews(contractorId) {
        this.reviews = await this.apiService.get_contractor_reviews(contractorId);
    }

    async loadConnections(contractorId) {
        // This would be a new API endpoint for connections
        try {
            const response = await fetch(`${this.apiService.BASE_URL}/contractors/${contractorId}/connections/`, {
                headers: this.apiService.get_headers()
            });
            this.connections = await response.json();
        } catch (error) {
            console.error('Error loading connections:', error);
        }
    }

    render() {
        const container = document.getElementById('contractor-profile');
        if (!container || !this.currentContractor) return;

        container.innerHTML = `
            <div class="contractor-profile-container">
                <div class="profile-header">
                    <div class="profile-image">
                        <img src="${this.currentContractor.user.profile_picture || '/static/core/images/default-profile.png'}" 
                             alt="${this.currentContractor.user.first_name}'s profile">
                    </div>
                    <div class="profile-info">
                        <h1>${this.currentContractor.user.first_name} ${this.currentContractor.user.last_name}</h1>
                        <p class="trade">${this.currentContractor.trade}</p>
                        <div class="rating">
                            <span class="stars">${this.renderStars(this.currentContractor.rating)}</span>
                            <span class="rating-value">${this.currentContractor.rating}/5.0</span>
                        </div>
                        <div class="profile-stats">
                            <div class="stat">
                                <span class="stat-value">${this.currentContractor.total_jobs_completed}</span>
                                <span class="stat-label">Jobs Completed</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">${this.currentContractor.years_of_experience}</span>
                                <span class="stat-label">Years Experience</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">$${this.currentContractor.hourly_rate}/hr</span>
                                <span class="stat-label">Hourly Rate</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="profile-sections">
                    <div class="section about-section">
                        <h2>About Me</h2>
                        <p>${this.currentContractor.bio || 'No bio available'}</p>
                        <div class="skills">
                            <h3>Skills & Expertise</h3>
                            <div class="skills-list">
                                ${this.renderSkills(this.currentContractor.skills)}
                            </div>
                        </div>
                    </div>

                    <div class="section portfolio-section">
                        <h2>Portfolio</h2>
                        <div class="portfolio-grid">
                            ${this.renderPortfolioItems()}
                        </div>
                        <button class="btn btn-primary" onclick="contractorProfile.showAddPortfolioForm()">
                            Add Portfolio Item
                        </button>
                    </div>

                    <div class="section reviews-section">
                        <h2>Reviews</h2>
                        <div class="reviews-list">
                            ${this.renderReviews()}
                        </div>
                    </div>

                    <div class="section connections-section">
                        <h2>Network</h2>
                        <div class="connections-grid">
                            ${this.renderConnections()}
                        </div>
                        <button class="btn btn-primary" onclick="contractorProfile.showConnectionRequests()">
                            Connection Requests
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        return `
            ${'★'.repeat(fullStars)}
            ${halfStar ? '½' : ''}
            ${'☆'.repeat(emptyStars)}
        `;
    }

    renderSkills(skills) {
        if (!skills) return '<p>No skills listed</p>';
        return skills.map(skill => `
            <span class="skill-tag">${skill}</span>
        `).join('');
    }

    renderPortfolioItems() {
        if (this.portfolioItems.length === 0) {
            return '<p>No portfolio items yet</p>';
        }
        return this.portfolioItems.map(item => `
            <div class="portfolio-item">
                <img src="${item.image_url}" alt="${item.title}">
                <div class="portfolio-item-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <div class="portfolio-item-stats">
                        <span>${item.location}</span>
                        <span>${new Date(item.date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderReviews() {
        if (this.reviews.length === 0) {
            return '<p>No reviews yet</p>';
        }
        return this.reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <div class="reviewer-info">
                        <img src="${review.customer.profile_picture || '/static/core/images/default-profile.png'}" 
                             alt="${review.customer.username}'s profile">
                        <span>${review.customer.username}</span>
                    </div>
                    <div class="review-rating">
                        ${this.renderStars(review.rating)}
                    </div>
                </div>
                <p class="review-comment">${review.comment}</p>
                <div class="review-date">
                    ${new Date(review.created_at).toLocaleDateString()}
                </div>
            </div>
        `).join('');
    }

    renderConnections() {
        if (this.connections.length === 0) {
            return '<p>No connections yet</p>';
        }
        return this.connections.map(connection => `
            <div class="connection-card">
                <img src="${connection.profile_picture || '/static/core/images/default-profile.png'}" 
                     alt="${connection.name}'s profile">
                <h3>${connection.name}</h3>
                <p>${connection.trade}</p>
                <button class="btn btn-primary" onclick="contractorProfile.messageConnection(${connection.id})">
                    Message
                </button>
            </div>
        `).join('');
    }

    showAddPortfolioForm() {
        const container = document.getElementById('contractor-profile');
        container.innerHTML = `
            <div class="add-portfolio-form">
                <h2>Add Portfolio Item</h2>
                <form onsubmit="contractorProfile.handleAddPortfolioItem(event)">
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
                        <label>Date</label>
                        <input type="date" name="date" required>
                    </div>
                    <div class="form-group">
                        <label>Image</label>
                        <input type="file" name="image" accept="image/*" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Item</button>
                </form>
            </div>
        `;
    }

    async handleAddPortfolioItem(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        try {
            const response = await fetch(`${this.apiService.BASE_URL}/contractors/${this.currentContractor.id}/portfolio/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiService.token}`
                },
                body: formData
            });
            
            if (response.ok) {
                await this.loadPortfolioItems(this.currentContractor.id);
                this.render();
            }
        } catch (error) {
            console.error('Error adding portfolio item:', error);
        }
    }

    showConnectionRequests() {
        // Implement connection requests view
    }

    async messageConnection(connectionId) {
        // Implement messaging functionality
    }
}

// Initialize the contractor profile
const contractorProfile = new ContractorProfile(api_service); 