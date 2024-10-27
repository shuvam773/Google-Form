export type QuestionType = 'text' | 'multipleChoice' | 'checkbox' | 'email';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
  options?: Option[];
}

export interface Form {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: number;
}

export interface FormResponse {
  id: string;
  formId: string;
  answers: Record<string, string | string[]>;
  submittedAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}