export interface Student {
  _id: string;
  studentId?: string;
  name?: string;
  email?: string;
  phone?: string;
  courseId?: string;
  courseName?: string;
  batchId?: string;
  batchName?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface Course {
  _id: string;
  courseName: string;
  courseCode?: string;
  description?: string;
  duration?: string;
  fees?: number;
  [key: string]: any;
}

export interface Batch {
  _id: string;
  batchName: string;
  courseId?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'student';
  token?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}
