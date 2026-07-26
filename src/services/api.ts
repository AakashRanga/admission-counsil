const API_BASE = 'http://localhost:8000/api';

export interface LoginPayload {
  email: string;
  password: string;
  role?: string;
}

export const apiService = {
  async login(payload: LoginPayload) {
    let response: Response;
    try {
      response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err: any) {
      throw new Error('Backend server is offline or unreachable (http://localhost:8000). Please make sure backend is running.');
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Authentication failed. Invalid email or password.');
    }

    return await response.json();
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
  },

  async assignStaff(issueId: string, payload: { assigned_staff_name: string; assigned_staff_mobile: string; special_instructions?: string }) {
    try {
      const response = await fetch(`${API_BASE}/issues/${issueId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save staff assignment on server');
      }

      return await response.json();
    } catch (error) {
      console.warn('[*] Backend offline or unreached while assigning staff.', error);
      return null;
    }
  },

  async updateStatus(issueId: string, status: string, remarks?: string) {
    try {
      const response = await fetch(`${API_BASE}/issues/${issueId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remarks }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status on server');
      }

      return await response.json();
    } catch (error) {
      console.warn('[*] Backend offline or unreached while updating status.', error);
      return null;
    }
  }
};


