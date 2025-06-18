const API_BASE_URL = (import.meta as any).env.VITE_API_URL

interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
  noRedirect?: boolean; // Disable auto-redirect
}

// Custom error class for validation errors
export class ValidationError extends Error {
  public readonly errors: string[];
  
  constructor(errors: string[]) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export const apiRequest = async (
  endpoint: string, 
  options: ApiRequestOptions = {}
): Promise<Response> => {
  const { noRedirect, ...restOptions } = options;
  
  const config: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...restOptions.headers,
    },
    ...restOptions,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  // Handle unauthorized - redirect to login (unless noRedirect is true)
  if (response.status === 401 && !noRedirect) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  
  return response;
};

// Helper function to handle errors
const handleError = async (response: Response) => {
  const errorData = await response.json().catch(() => ({}));
  
  // Handle validation errors (NestJS returns array in message field)
  if (response.status === 400 && Array.isArray(errorData.message)) {
    throw new ValidationError(errorData.message);
  }
  
  // Handle other errors
  const message = errorData.message || `Request failed with status ${response.status}`;
  throw new Error(message);
};

// Typed API methods
export const api = {
  get: async <T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> => {
    const response = await apiRequest(endpoint, options);
    if (!response.ok) {
      await handleError(response);
    }
    return response.json();
  },

  post: async <T = any>(endpoint: string, data?: any, options: ApiRequestOptions = {}): Promise<T> => {
    const response = await apiRequest(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    if (!response.ok) {
      await handleError(response);
    }
    return response.json();
  },

  put: async <T = any>(endpoint: string, data?: any, options: ApiRequestOptions = {}): Promise<T> => {
    const response = await apiRequest(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    if (!response.ok) {
      await handleError(response);
    }
    return response.json();
  },

  delete: async <T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> => {
    const response = await apiRequest(endpoint, {
      method: 'DELETE',
      ...options,
    });
    if (!response.ok) {
      await handleError(response);
    }
    
    const text = await response.text();
    return text ? JSON.parse(text) : {} as T;
  },
};