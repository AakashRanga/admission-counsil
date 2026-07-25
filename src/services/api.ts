const API_BASE = 'http://localhost:8000/api';

export interface LoginPayload {
  email: string;
  password: string;
  role?: string;
}

export const apiService = {
  async login(payload: LoginPayload) {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Invalid login credentials');
      }

      return await response.json();
    } catch (error) {
      console.warn('[*] Backend offline or unreached. Using client role state.', error);
      return null;
    }
  },

  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  async getIssues() {
    try {
      const response = await fetch(`${API_BASE}/issues`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.warn('[*] Backend offline or unreached while fetching grievances.', error);
      return null;
    }
  },

  async createSingleIssue(payload: any) {
    try {
      const response = await fetch(`${API_BASE}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create single issue');
      }

      return await response.json();
    } catch (error) {
      console.warn('[*] Backend offline or unreached. Saved to local state.', error);
      return null;
    }
  },

  async createBulkIssues(items: any[]) {
    try {
      const response = await fetch(`${API_BASE}/issues/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Failed to create bulk issues');
      }

      return await response.json();
    } catch (error) {
      console.warn('[*] Backend offline or unreached. Saved to local state.', error);
      return null;
    }
  }
};
