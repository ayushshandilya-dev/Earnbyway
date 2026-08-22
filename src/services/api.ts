const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class ApiClient {
  private token: string | null = localStorage.getItem('earnbyway_token');

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('earnbyway_token', token);
    } else {
      localStorage.removeItem('earnbyway_token');
    }
  }

  getToken() {
    return this.token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers || {});
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }
    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(credentials: any) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    this.setToken(data.token);
    return data.user;
  }

  async register(registerData: any) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData)
    });
    this.setToken(data.token);
    return data.user;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async getFreelancers() {
    return this.request('/auth/freelancers');
  }

  // Gigs
  async getGigs() {
    return this.request('/gigs');
  }

  async getGigById(id: string) {
    return this.request(`/gigs/${id}`);
  }

  async createGig(gigData: any) {
    return this.request('/gigs', {
      method: 'POST',
      body: JSON.stringify(gigData)
    });
  }

  // Projects & Proposals
  async getProjects() {
    return this.request('/projects');
  }

  async getProjectById(id: string) {
    return this.request(`/projects/${id}`);
  }

  async postProject(projectData: any) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  }

  async submitProposal(projectId: string, proposalData: any) {
    return this.request(`/projects/${projectId}/proposals`, {
      method: 'POST',
      body: JSON.stringify(proposalData)
    });
  }

  async manageProposal(projectId: string, proposalId: string, status: string) {
    return this.request(`/projects/${projectId}/proposals/${proposalId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // Orders & Escrow
  async getOrders() {
    return this.request('/orders');
  }

  async getOrderById(id: string) {
    return this.request(`/orders/${id}`);
  }

  async createOrderFromGig(gigId: string, packageKey: string) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ gigId, packageKey })
    });
  }

  async submitMilestone(orderId: string, milestoneId: string, submission: { note: string; file?: string }) {
    return this.request(`/orders/${orderId}/milestones/${milestoneId}/submit`, {
      method: 'PUT',
      body: JSON.stringify(submission)
    });
  }

  async releaseMilestone(orderId: string, milestoneId: string) {
    return this.request(`/orders/${orderId}/milestones/${milestoneId}/release`, {
      method: 'PUT'
    });
  }

  // Collaborative Workspace
  async addWorkspaceTask(orderId: string, taskData: { title: string; assignedTo?: string }) {
    return this.request(`/orders/${orderId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  }

  async updateWorkspaceTask(orderId: string, taskId: string, updates: { status: string; assignedTo?: string }) {
    return this.request(`/orders/${orderId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async addWorkspaceAsset(orderId: string, assetData: { name: string; url: string; size?: string }) {
    return this.request(`/orders/${orderId}/assets`, {
      method: 'POST',
      body: JSON.stringify(assetData)
    });
  }

  async updateWorkspaceNotes(orderId: string, notes: string) {
    return this.request(`/orders/${orderId}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ notes })
    });
  }

  // Chat
  async getConversations() {
    return this.request('/chat/conversations');
  }

  async getMessages(conversationId: string) {
    return this.request(`/chat/conversations/${conversationId}/messages`);
  }

  async sendMessage(conversationId: string, text: string, attachments?: string[]) {
    return this.request(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text, attachments })
    });
  }

  async createConversation(participantId: string) {
    return this.request('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify({ participantId })
    });
  }
}

export const api = new ApiClient();
