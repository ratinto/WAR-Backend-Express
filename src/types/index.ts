// TypeScript type definitions

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface StudentData {
  bagNo: string;
  name: string;
  email: string;
  enrollmentNo: string;
  phoneNo: string;
  residencyNo: string;
  password: string;
}

export interface WashermanData {
  username: string;
  password: string;
}

export interface OrderData {
  bagNo: string;
  numberOfClothes: number;
  status?: 'PENDING' | 'INPROGRESS' | 'COMPLETE';
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}
