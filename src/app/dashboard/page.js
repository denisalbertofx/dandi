'use client';

import { useState, useEffect } from 'react';
import { useApiKeys } from '@/features/api-keys/hooks/useApiKeys';
import ApiKeyList from '@/features/api-keys/components/ApiKeyList';
import ApiKeyModal from '@/features/api-keys/components/modals/ApiKeyModal';
import DeleteConfirmModal from '@/features/api-keys/components/modals/DeleteConfirmModal';
import { formatDate } from '@/shared/utils/api-helpers';
import { useNotification } from '@/shared/hooks/useNotification';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const {
    apiKeys,
    isLoading,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    regenerateApiKey
  } = useApiKeys();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const handleEdit = (key) => {
    setSelectedKey(key);
    setIsModalOpen(true);
  };

  const handleDelete = (key) => {
    setSelectedKey(key);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="relative">
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-indigo-300 to-purple-400 bg-clip-text text-transparent mb-6">
            API Key Management
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Gestiona tus API keys de forma segura y eficiente
          </p>
        </div>

        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              Tus API Keys
            </h2>
            <p className="text-gray-400 text-sm">Administra y monitorea tus claves de API</p>
          </div>
          <button
            onClick={() => {
              setSelectedKey(null);
              setIsModalOpen(true);
            }}
            className="relative overflow-hidden group bg-gradient-to-r from-indigo-500 to-purple-500 
                     text-white px-6 py-3 rounded-xl shadow-xl
                     hover:shadow-indigo-500/25 transition-all duration-300
                     border border-white/10 backdrop-blur-xl
                     flex items-center gap-3 text-sm font-medium"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <PlusIcon className="w-5 h-5" />
            <span>Crear API Key</span>
          </button>
        </div>

        <ApiKeyList
          apiKeys={apiKeys}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRegenerate={regenerateApiKey}
        />
      </div>

      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          if (selectedKey) {
            updateApiKey(selectedKey.id, data);
          } else {
            createApiKey(data);
          }
          setIsModalOpen(false);
        }}
        initialData={selectedKey}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteApiKey(selectedKey?.id);
          setIsDeleteModalOpen(false);
        }}
        keyName={selectedKey?.name}
      />
    </div>
  );
} 