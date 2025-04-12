import { TradingCredentials } from '../types/trading';

const BASE_URL = process.env.API_BASE_URL;

interface AuthResponse {
    message: string;
    user_id: number;
    token: string;
}

class ApiService {
    private static credentials: TradingCredentials = {
        user_id: Number(process.env.user_id),
        password: process.env.password || ''
    };

    private static isAuthenticated: boolean = false; 

    static async authenticate() {
        try {
            const response = await fetch(`${BASE_URL}/accounts/authenticate`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: this.credentials.user_id.toString(),
                    password: this.credentials.password
                })
            });

            if (!response.ok) {
                throw new Error('Authentication failed');
            }

            const data: AuthResponse = await response.json();

            if (data.token) {
                this.isAuthenticated = true;
                return true;
            }

            return false; 
        } catch (error) {
            console.error('Authentication error:', error);
            this.isAuthenticated = false;
            return false;
        }
    }

    protected static async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
        // if not authenticated, try to authenticate
        if (!this.isAuthenticated) {
            const authSuccess = await this.authenticate();
            if (!authSuccess) {
                throw new Error('Failed to authenticate');
            }   
        }
        
        const headers = {
            'Authorization': 'Basic ' + btoa(`${this.credentials.user_id}:${this.credentials.password}`),
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        if (!response.ok) {
            // if 401, try to reauthenticate
            if (response.status === 401) {
                const authSuccess = await this.authenticate();
                if (!authSuccess) {
                    throw new Error('Failed to reauthenticate');
                }
            }
            throw new Error(`API call failed: ${response.statusText}`);
        }
        
        return response.json();
    }
}

export default ApiService;