class ApiService {
    constructor() {
        this.BASE_URL = 'http://localhost:8000/api';
        this.token = localStorage.getItem('token');
    }

    get_headers() {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async get_contractor(contractorId) {
        try {
            const response = await fetch(`${this.BASE_URL}/contractors/${contractorId}/`, {
                headers: this.get_headers()
            });
            if (!response.ok) throw new Error('Failed to fetch contractor');
            return await response.json();
        } catch (error) {
            console.error('Error fetching contractor:', error);
            throw error;
        }
    }

    async get_portfolio_items(contractorId) {
        try {
            const response = await fetch(`${this.BASE_URL}/contractors/${contractorId}/portfolio/`, {
                headers: this.get_headers()
            });
            if (!response.ok) throw new Error('Failed to fetch portfolio items');
            return await response.json();
        } catch (error) {
            console.error('Error fetching portfolio items:', error);
            throw error;
        }
    }

    async get_reviews(contractorId) {
        try {
            const response = await fetch(`${this.BASE_URL}/contractors/${contractorId}/reviews/`, {
                headers: this.get_headers()
            });
            if (!response.ok) throw new Error('Failed to fetch reviews');
            return await response.json();
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    }

    async get_connections(contractorId) {
        try {
            const response = await fetch(`${this.BASE_URL}/contractors/${contractorId}/connections/`, {
                headers: this.get_headers()
            });
            if (!response.ok) throw new Error('Failed to fetch connections');
            return await response.json();
        } catch (error) {
            console.error('Error fetching connections:', error);
            throw error;
        }
    }

    async add_portfolio_item(contractorId, data) {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });

            const response = await fetch(`${this.BASE_URL}/portfolio/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: formData
            });
            if (!response.ok) throw new Error('Failed to add portfolio item');
            return await response.json();
        } catch (error) {
            console.error('Error adding portfolio item:', error);
            throw error;
        }
    }

    async add_review(contractorId, data) {
        try {
            const response = await fetch(`${this.BASE_URL}/reviews/`, {
                method: 'POST',
                headers: this.get_headers(),
                body: JSON.stringify({ ...data, contractor: contractorId })
            });
            if (!response.ok) throw new Error('Failed to add review');
            return await response.json();
        } catch (error) {
            console.error('Error adding review:', error);
            throw error;
        }
    }

    async send_connection_request(contractorId, connectedContractorId) {
        try {
            const response = await fetch(`${this.BASE_URL}/connections/`, {
                method: 'POST',
                headers: this.get_headers(),
                body: JSON.stringify({
                    contractor: contractorId,
                    connected_contractor: connectedContractorId,
                    status: 'pending'
                })
            });
            if (!response.ok) throw new Error('Failed to send connection request');
            return await response.json();
        } catch (error) {
            console.error('Error sending connection request:', error);
            throw error;
        }
    }
}

// Initialize the API service
const api_service = new ApiService();

// Export for use in Lovable
window.api_service = api_service; 