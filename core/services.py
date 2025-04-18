import requests
from django.conf import settings

class APIService:
    BASE_URL = 'https://pandaco.onrender.com/api'  # Change to your Render URL
    
    def __init__(self):
        self.token = None
    
    def set_token(self, token):
        self.token = token
    
    def get_headers(self):
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        return headers
    
    # Authentication
    def login(self, username, password):
        response = requests.post(
            f'{self.BASE_URL}/token/',
            json={'username': username, 'password': password}
        )
        if response.status_code == 200:
            self.set_token(response.json()['access'])
        return response.json()
    
    def register(self, user_data):
        return requests.post(
            f'{self.BASE_URL}/users/register/',
            json=user_data,
            headers=self.get_headers()
        ).json()
    
    # Contractor operations
    def get_contractors(self, params=None):
        return requests.get(
            f'{self.BASE_URL}/contractors/',
            params=params,
            headers=self.get_headers()
        ).json()
    
    def get_contractor(self, contractor_id):
        return requests.get(
            f'{self.BASE_URL}/contractors/{contractor_id}/',
            headers=self.get_headers()
        ).json()
    
    def update_contractor(self, contractor_id, data):
        return requests.patch(
            f'{self.BASE_URL}/contractors/{contractor_id}/',
            json=data,
            headers=self.get_headers()
        ).json()
    
    # Task operations
    def create_task(self, task_data):
        return requests.post(
            f'{self.BASE_URL}/tasks/',
            json=task_data,
            headers=self.get_headers()
        ).json()
    
    def get_tasks(self, params=None):
        return requests.get(
            f'{self.BASE_URL}/tasks/',
            params=params,
            headers=self.get_headers()
        ).json()
    
    def update_task_status(self, task_id, status):
        return requests.patch(
            f'{self.BASE_URL}/tasks/{task_id}/',
            json={'status': status},
            headers=self.get_headers()
        ).json()
    
    def assign_task(self, task_id, contractor_id):
        return requests.post(
            f'{self.BASE_URL}/tasks/{task_id}/assign/',
            json={'contractor_id': contractor_id},
            headers=self.get_headers()
        ).json()
    
    # Review operations
    def create_review(self, review_data):
        return requests.post(
            f'{self.BASE_URL}/reviews/',
            json=review_data,
            headers=self.get_headers()
        ).json()
    
    def get_contractor_reviews(self, contractor_id):
        return requests.get(
            f'{self.BASE_URL}/reviews/',
            params={'contractor': contractor_id},
            headers=self.get_headers()
        ).json()
    
    # Ticket operations
    def create_ticket(self, ticket_data):
        return requests.post(
            f'{self.BASE_URL}/tickets/',
            json=ticket_data,
            headers=self.get_headers()
        ).json()
    
    def get_tickets(self, params=None):
        return requests.get(
            f'{self.BASE_URL}/tickets/',
            params=params,
            headers=self.get_headers()
        ).json()
    
    def update_ticket_status(self, ticket_id, status):
        return requests.patch(
            f'{self.BASE_URL}/tickets/{ticket_id}/',
            json={'status': status},
            headers=self.get_headers()
        ).json()

# Create a singleton instance
api_service = APIService() 