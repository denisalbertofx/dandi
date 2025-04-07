'use client';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, keyName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/90 rounded-lg p-6 w-full max-w-md border border-gray-800/30">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">
          Confirmar Eliminación
        </h2>
        <p className="text-gray-400 mb-6">
          ¿Estás seguro de que deseas eliminar la API Key "{keyName}"? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300 
                     transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm 
                     font-medium border border-red-500/30 transition-all duration-200 
                     hover:bg-red-600/30 hover:text-red-300 transform hover:scale-105"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
} 