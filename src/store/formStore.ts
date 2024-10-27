import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { Form, FormResponse, Question } from '../types/form';

interface FormState {
  forms: Form[];
  responses: FormResponse[];
  createForm: (title: string, description: string) => string;
  updateForm: (form: Form) => void;
  deleteForm: (id: string) => void;
  addResponse: (formId: string, answers: Record<string, string | string[]>) => void;
  getForm: (id: string) => Form | undefined;
  getResponses: (formId: string) => FormResponse[];
}

export const useFormStore = create<FormState>((set, get) => ({
  forms: JSON.parse(localStorage.getItem('forms') || '[]'),
  responses: JSON.parse(localStorage.getItem('responses') || '[]'),

  createForm: (title: string, description: string) => {
    const newForm: Form = {
      id: nanoid(),
      title,
      description,
      questions: [],
      createdAt: Date.now(),
    };
    set((state) => {
      const updatedForms = [...state.forms, newForm];
      localStorage.setItem('forms', JSON.stringify(updatedForms));
      return { forms: updatedForms };
    });
    return newForm.id;
  },

  updateForm: (form: Form) => {
    set((state) => {
      const updatedForms = state.forms.map((f) => (f.id === form.id ? form : f));
      localStorage.setItem('forms', JSON.stringify(updatedForms));
      return { forms: updatedForms };
    });
  },

  deleteForm: (id: string) => {
    set((state) => {
      const updatedForms = state.forms.filter((f) => f.id !== id);
      localStorage.setItem('forms', JSON.stringify(updatedForms));
      return { forms: updatedForms };
    });
  },

  addResponse: (formId: string, answers: Record<string, string | string[]>) => {
    const response: FormResponse = {
      id: nanoid(),
      formId,
      answers,
      submittedAt: Date.now(),
    };
    set((state) => {
      const updatedResponses = [...state.responses, response];
      localStorage.setItem('responses', JSON.stringify(updatedResponses));
      return { responses: updatedResponses };
    });
  },

  getForm: (id: string) => {
    return get().forms.find((f) => f.id === id);
  },

  getResponses: (formId: string) => {
    return get().responses.filter((r) => r.formId === formId);
  },
}));