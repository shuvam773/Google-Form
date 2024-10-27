import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import Dashboard from './pages/Dashboard';
import FormBuilder from './components/Form/FormBuilder';
import FormResponse from './components/Form/FormResponse';
import { useFormStore } from './store/formStore';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function FormEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const form = useFormStore((state) => state.getForm(id!));

  if (!form) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <FormBuilder
      form={form}
      onSave={() => navigate('/dashboard')}
    />
  );
}

function FormView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const form = useFormStore((state) => state.getForm(id!));

  if (!form) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <FormResponse
      form={form}
      onSubmit={() => navigate('/dashboard')}
    />
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/form/:id/edit"
          element={
            <PrivateRoute>
              <FormEdit />
            </PrivateRoute>
          }
        />
        <Route path="/form/:id" element={<FormView />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}