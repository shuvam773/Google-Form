import React, { useState } from 'react';
import { useFormStore } from '../../store/formStore';
import { Form, Question, QuestionType } from '../../types/form';
import { PlusCircle, Save, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';

interface FormBuilderProps {
  form: Form;
  onSave: () => void;
}

export default function FormBuilder({ form, onSave }: FormBuilderProps) {
  const updateForm = useFormStore((state) => state.updateForm);
  const [title, setTitle] = useState(form.title);
  const [description, setDescription] = useState(form.description);
  const [questions, setQuestions] = useState<Question[]>(form.questions);

  const handleSave = () => {
    const updatedForm = {
      ...form,
      title,
      description,
      questions,
    };
    updateForm(updatedForm);
    onSave();
  };

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: nanoid(),
      type,
      title: '',
      required: false,
      options: type === 'multipleChoice' || type === 'checkbox' ? [] : undefined,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], ...updates };
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOption = (questionIndex: number) => {
    const question = questions[questionIndex];
    if (question.options) {
      const newOption = { id: nanoid(), text: '' };
      updateQuestion(questionIndex, {
        options: [...question.options, newOption],
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-bold mb-4 p-2 border-b-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
          placeholder="Form Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full text-gray-600 mb-4 p-2 border-b-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
          placeholder="Form Description"
          rows={2}
        />
      </div>

      {questions.map((question, index) => (
        <div key={question.id} className="bg-white shadow-lg rounded-lg p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <input
              type="text"
              value={question.title}
              onChange={(e) => updateQuestion(index, { title: e.target.value })}
              className="flex-1 text-xl p-2 border-b-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
              placeholder="Question"
            />
            <button
              onClick={() => removeQuestion(index)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {(question.type === 'multipleChoice' || question.type === 'checkbox') && (
            <div className="ml-4 space-y-2">
              {question.options?.map((option, optionIndex) => (
                <div key={option.id} className="flex items-center">
                  <input
                    type={question.type === 'multipleChoice' ? 'radio' : 'checkbox'}
                    disabled
                    className="mr-2"
                  />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => {
                      const newOptions = [...(question.options || [])];
                      newOptions[optionIndex].text = e.target.value;
                      updateQuestion(index, { options: newOptions });
                    }}
                    className="flex-1 p-2 border-b border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="Option"
                  />
                </div>
              ))}
              <button
                onClick={() => addOption(index)}
                className="text-indigo-600 hover:text-indigo-800 flex items-center mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Option
              </button>
            </div>
          )}

          <div className="mt-4 flex items-center">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={question.required}
                onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                className="mr-2"
              />
              Required
            </label>
          </div>
        </div>
      ))}

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => addQuestion('text')}
          className="flex-1 bg-white text-gray-700 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          Add Text Question
        </button>
        <button
          onClick={() => addQuestion('multipleChoice')}
          className="flex-1 bg-white text-gray-700 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          Add Multiple Choice
        </button>
        <button
          onClick={() => addQuestion('checkbox')}
          className="flex-1 bg-white text-gray-700 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          Add Checkbox
        </button>
      </div>

      <button
        onClick={handleSave}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 flex items-center"
      >
        <Save className="h-5 w-5 mr-2" />
        Save Form
      </button>
    </div>
  );
}