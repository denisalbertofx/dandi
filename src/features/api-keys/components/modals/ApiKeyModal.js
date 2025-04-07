'use client';

import { useState } from 'react';

export default function ApiKeyModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/90 rounded-lg p-6 w-full max-w-md border border-gray-800/30">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">
          {initialData ? 'Editar API Key' : 'Crear Nueva API Key'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/30 rounded-lg 
                         text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                         focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                Descripción
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/30 rounded-lg 
                         text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                         focus:border-transparent"
                rows="3"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300 
                       transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg text-sm 
                       font-medium border border-indigo-500/30 transition-all duration-200 
                       hover:bg-indigo-600/30 hover:text-indigo-300 transform hover:scale-105"
            >
              {initialData ? 'Guardar Cambios' : 'Crear API Key'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 