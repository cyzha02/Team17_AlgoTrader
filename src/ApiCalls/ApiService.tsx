import { TradingCredentials } from "../types/trading";

const API_URL = import.meta.env.VITE_API_URL || "http://82.29.197.23:8000";

interface AuthResponse {
  message: string;
  user_id: number;
  is_admin: boolean;
}

class ApiService {
  private static credentials: TradingCredentials = {
    user_id: Number(import.meta.env.VITE_user_id),
    password: import.meta.env.VITE_password || "",
  };

  private static isAuthenticated: boolean = false;

  static setCredentials(credentials: TradingCredentials) {
    this.credentials = credentials;
    this.isAuthenticated = false;
  }

  static isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  static async authenticate() {
    try {
      const response = await fetch(`${API_URL}/accounts/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: this.credentials.user_id.toString(),
          password: this.credentials.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data: AuthResponse = await response.json();

      if (data.message === "Authentication successful") {
        this.isAuthenticated = true;
        return true;
      }

      return false;
    } catch (error) {
      console.error("Authentication error:", error);
      this.isAuthenticated = false;
      return false;
    }
  }

  protected static async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.isAuthenticated) {
      const authSuccess = await this.authenticate();
      if (!authSuccess) {
        throw new Error("Failed to authenticate");
      }
    }

    const headers = {
      Authorization: `Basic ${btoa(`${this.credentials.user_id}:${this.credentials.password}`)}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.isAuthenticated = false;
        const authSuccess = await this.authenticate();
        if (!authSuccess) {
          throw new Error("Failed to reauthenticate");
        }
        // Retry the original request
        return this.fetchWithAuth<T>(endpoint, options);
      }
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export default ApiService;
