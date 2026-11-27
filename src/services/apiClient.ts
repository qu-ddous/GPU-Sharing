import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string = 'http://192.168.99.1:8000';
  private apiToken: string = '';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });

    this.client.interceptors.request.use((config) => {
      if (this.apiToken) {
        config.headers['X-API-Token'] = this.apiToken;
      }
      return config;
    });
  }

  public setBaseURL(url: string) {
    this.baseURL = url.replace(/\/+$/, '');
    this.client.defaults.baseURL = this.baseURL;
  }

  public getBaseURL(): string {
    return this.baseURL;
  }

  public setToken(token: string) {
    this.apiToken = token;
  }

  public async ping(): Promise<{ pong: boolean; latency: number }> {
    const start = performance.now();
    try {
      const res = await this.client.get('/api/v1/ping', { timeout: 3000 });
      const latency = Math.round((performance.now() - start) * 10) / 10;
      return { pong: res.data?.pong === true, latency };
    } catch {
      // Return simulated latency when offline or testing
      return { pong: false, latency: 999 };
    }
  }

  public async getHealth() {
    const res = await this.client.get('/api/v1/health');
    return res.data;
  }

  public async submitJob(formData: FormData) {
    const res = await this.client.post('/api/v1/jobs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000
    });
    return res.data;
  }

  public async cancelJob(jobId: string) {
    const res = await this.client.post(`/api/v1/jobs/${jobId}/cancel`);
    return res.data;
  }

  public async getJob(jobId: string) {
    const res = await this.client.get(`/api/v1/jobs/${jobId}`);
    return res.data;
  }

  public async getAIStatus() {
    const res = await this.client.get('/api/v1/ai/status');
    return res.data;
  }

  public async uploadAIDataset(formData: FormData) {
    const res = await this.client.post('/api/v1/ai/upload-dataset', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    });
    return res.data;
  }

  public async startAITraining(params: Record<string, any>) {
    const res = await this.client.post('/api/v1/ai/train', params);
    return res.data;
  }

  public async pauseAITraining() {
    const res = await this.client.post('/api/v1/ai/pause');
    return res.data;
  }

  public async resumeAITraining() {
    const res = await this.client.post('/api/v1/ai/resume');
    return res.data;
  }

  public async cancelAITraining() {
    const res = await this.client.post('/api/v1/ai/cancel');
    return res.data;
  }

  public async getAIProgress() {
    const res = await this.client.get('/api/v1/ai/progress');
    return res.data;
  }

  public getAIModelDownloadUrl(): string {
    return `${this.baseURL}/api/v1/ai/download-model`;
  }

  public getAIReportDownloadUrl(): string {
    return `${this.baseURL}/api/v1/ai/download-report`;
  }

  public async predictImage(formData: FormData) {
    const res = await this.client.post('/api/v1/ai/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  public async runAIBenchmark() {
    const res = await this.client.post('/api/v1/ai/benchmark');
    return res.data;
  }
}

export const apiClient = new ApiClient();
