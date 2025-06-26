import axios from 'axios';

interface AuthCheckResult {
  isAuthenticated: boolean;
  user?: {
    uid: string;
    email: string;
    name?: string;
    org?: string;
  };
  error?: string;
  success?: boolean;
}

interface AuthResponse {
  success: boolean;
  user?: {
    uid: string;
    email: string;
    name?: string;
    org?: string;
  };
  error?: string;
}

export class SubdomainAuthChecker {
  private authBaseUrl: string;
  private apiBaseUrl: string;

  constructor(config?: {
    authBaseUrl?: string;
  }) {
    this.authBaseUrl = config?.authBaseUrl || 'https://auth.tryloop.ai';
    this.apiBaseUrl = 'https://functions.tryloop.ai/auth';
  }

  /**
   * Check if the user is authenticated by verifying the session cookie
   */
  async checkAuth(): Promise<AuthCheckResult> {
    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/status`,
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const data = response.data as AuthResponse;

      if (data.success) {
        return {
          isAuthenticated: true,
          success: true,
          user: data.user
        };
      }

      return {
        isAuthenticated: false,
        success: false,
        error: 'No valid session found'
      };
    } catch (error: any) {
      console.error('Auth check failed:', error);

      // If 401, user is not authenticated
      if (error.response?.status === 401) {
        return {
          isAuthenticated: false,
          success: false,
          error: 'Not authenticated'
        };
      }

      // Other errors
      return {
        isAuthenticated: false,
        success: false,
        error: error.message || 'Authentication check failed'
      };
    }
  }

  /**
   * Redirect to login page with optional redirect back
   */
  redirectToLogin(redirectUrl?: string) {
    const currentUrl = redirectUrl || window.location.href;
    const loginUrl = new URL(`${this.authBaseUrl}/login`);
    loginUrl.searchParams.set('redirect_uri', currentUrl);
    window.location.href = loginUrl.toString();
  }

  /**
   * Sign out the user by calling the logout endpoint
   */
  async signOut(): Promise<void> {
    try {
      await axios.post(
        `${this.apiBaseUrl}/signout`,
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      // Clear any local storage or session storage
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to login
      this.redirectToLogin();
    } catch (error) {
      console.error('Sign out failed:', error);
      // Even if signout fails, redirect to login
      this.redirectToLogin();
    }
  }
}

// Export a singleton instance for convenience
export const authChecker = new SubdomainAuthChecker();