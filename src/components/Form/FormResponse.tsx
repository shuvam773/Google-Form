import React, { useState } from 'react';
import { useFormStore } from '../../store/formStore';
import { Form } from '../../types/form';
import { Send } from 'lucide-react';

interface FormResponseProps {
  form: Form;
  onSubmit: () => void;
}

export default function FormResponse({ form, onSubmit }: FormResponseProps) {
  const addResponse = useFormStore((state) => state.addResponse);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addResponse(form.id, answers);
    onSubmit();
  };

  const handleInputChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{form.title}</h1>
        <p className="text-gray-600 mb-4">{form.description}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {form.questions.map((question) => (
          <div key={question.id} className="bg-white shadow-lg rounded-lg p-6 mb-4">
            <h2 className="text-xl mb-4">
              {question.title}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </h2>

            {question.type === 'text' && (
              <input
                type="text"
                required={question.required}
                value={(answers[question.id] as string) || ''}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            )}

            {question.type === 'multipleChoice' && (
              <div className="space-y-2">
                {question.options?.map((option) => (
                  <label key={option.id} className="flex items-center">
                    <input
                      type="radio"
                      name={question.id}
                      required={question.required}
                      checked={(answers[question.id] as string) === option.id}
                      onChange={() => handleInputChange(question.id, option.id)}
                      className="mr-2"
                    />
                    {option.text}
                  </label>
                ))}
              </div>
            )}

            {question.type === 'checkbox' && (
              <div className="space-y-2">
                {question.options?.map((option) => (
                  <label key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(answers[question.id] as string[])?.includes(option.id)}
                      onChange={(e) => {
                        const currentAnswers = (answers[question.id] as string[]) || [];
                        const newAnswers = e.target.checked
                          ? [...currentAnswers, option.id]
                          : currentAnswers.filter((id) => id !== option.id);
                        handleInputChange(question.id, newAnswers);
                      }}
                      className="mr-2"
                    />
                    {option.text}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="fixed bottom-6 right-6 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <Send className="h-5 w-5 mr-2" />
          Submit
        </button>
      </form>
    </div>
  );
}