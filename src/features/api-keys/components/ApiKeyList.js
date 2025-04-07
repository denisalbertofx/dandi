'use client';

import { useState } from 'react';
import { formatDate } from '@/shared/utils/api-helpers';
import { useNotification } from '@/shared/hooks/useNotification';
import { EyeIcon, EyeSlashIcon, ClipboardDocumentIcon, PencilSquareIcon, ArrowPathIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function ApiKeyList({ apiKeys, isLoading, onEdit, onDelete, onRegenerate }) {
  const { showNotification } = useNotification();
  const [visibleKeys, setVisibleKeys] = useState({});
  const [selectedKey, setSelectedKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const maskApiKey = (key) => {
    return `${key.slice(0, 4)}${'•'.repeat(20)}${key.slice(-4)}`;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification({
        message: 'API Key copiada al portapapeles',
        type: 'success'
      });
    } catch (err) {
      showNotification({
        message: 'Error al copiar la API Key',
        type: 'error'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-900/40 backdrop-blur-xl border border-gray-800/20 rounded-2xl shadow-2xl"></div>
        ))}
      </div>
    );
  }

  if (!apiKeys?.length) {
    return (
      <div className="text-center py-16 bg-gray-900/40 backdrop-blur-xl border border-gray-800/20 rounded-2xl shadow-2xl">
        <p className="text-gray-400">No hay API keys disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {apiKeys.map((key) => (
        <div
          key={key.id}
          className="group relative overflow-hidden 
                   bg-gradient-to-br from-gray-900/80 via-gray-800/90 to-gray-900/80
                   backdrop-blur-xl border border-gray-700/20 rounded-2xl p-8
                   shadow-[0_8px_32px_rgba(0,0,0,0.3)] 
                   hover:shadow-[0_16px_48px_rgba(79,70,229,0.15)]
                   hover:border-indigo-500/30 transition-all duration-500"
        >
          {/* Efecto de brillo en hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 
                        opacity-0 group-hover:opacity-100 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-50" />

          <div className="relative flex items-center justify-between flex-wrap gap-6">
            <div className="flex-1 min-w-[300px]">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-white via-indigo-200 to-indigo-300 
                             bg-clip-text text-transparent tracking-tight">
                {key.name}
              </h3>
              {key.description && (
                <p className="mt-1 text-sm text-gray-400">
                  {key.description}
                </p>
              )}
              <div className="mt-4">
                <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-xl rounded-xl 
                             px-4 py-3.5 border border-gray-700/30 
                             shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <span className="text-sm font-medium text-gray-300/90">API Key:</span>
                  <code className="text-sm font-mono text-indigo-300 tracking-wider">
                    {visibleKeys[key.id] ? key.key : maskApiKey(key.key)}
                  </code>
                  <div className="flex items-center gap-2 ml-4 border-l border-gray-700/50 pl-4">
                    <button
                      onClick={() => toggleKeyVisibility(key.id)}
                      className="text-gray-400 hover:text-indigo-300 transition-colors duration-200 
                               p-2 rounded-lg hover:bg-indigo-500/10 hover:shadow-lg
                               hover:shadow-indigo-500/10 active:scale-95"
                    >
                      {visibleKeys[key.id] ? 
                        <EyeSlashIcon className="w-4 h-4" /> : 
                        <EyeIcon className="w-4 h-4" />
                      }
                    </button>
                    <button
                      onClick={() => copyToClipboard(key.key)}
                      className="text-gray-400 hover:text-indigo-400 transition-all duration-200 
                               p-2 rounded-lg hover:bg-indigo-500/10 hover:shadow-lg"
                    >
                      <ClipboardDocumentIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onEdit(key)}
                className="inline-flex items-center gap-2 px-5 py-2.5 
                         bg-gradient-to-r from-indigo-500/10 via-indigo-400/10 to-indigo-500/10
                         hover:from-indigo-500/20 hover:via-indigo-400/20 hover:to-indigo-500/20
                         text-indigo-300 rounded-xl text-sm font-medium
                         border border-indigo-500/20 hover:border-indigo-500/40
                         shadow-[0_4px_12px_rgba(79,70,229,0.1)]
                         hover:shadow-[0_8px_24px_rgba(79,70,229,0.2)]
                         transition-all duration-300 ease-out"
              >
                <PencilSquareIcon className="w-4 h-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => onRegenerate(key.id)}
                className="relative overflow-hidden group/btn bg-purple-500/10 text-purple-300 
                         px-5 py-2.5 rounded-xl border border-purple-500/20 
                         transition-all duration-300 hover:bg-purple-500/20 
                         hover:border-purple-500/40 hover:shadow-lg 
                         hover:shadow-purple-500/20 flex items-center gap-2.5 
                         text-sm font-medium"
              >
                <ArrowPathIcon className="w-4 h-4" />
                <span>Regenerar</span>
              </button>
              <button
                onClick={() => onDelete(key)}
                className="relative overflow-hidden group/btn bg-red-500/10 text-red-300 
                         px-5 py-2.5 rounded-xl border border-red-500/20 
                         transition-all duration-300 hover:bg-red-500/20 
                         hover:border-red-500/40 hover:shadow-lg 
                         hover:shadow-red-500/20 flex items-center gap-2.5 
                         text-sm font-medium"
              >
                <TrashIcon className="w-4 h-4" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
          <div className="mt-6 flex items-center space-x-4 text-sm text-gray-400/90">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                key.is_active 
                  ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.4)] ring-2 ring-emerald-400/20' 
                  : 'bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.4)] ring-2 ring-red-400/20'
              }`} />
              <span className={`${
                key.is_active ? 'text-emerald-300' : 'text-red-300'
              }`}>
                {key.is_active ? 'Activa' : 'Inactiva'}
              </span>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-700" />
            <span>Creada: {formatDate(key.created_at)}</span>
            <span className="w-1 h-1 rounded-full bg-gray-700" />
            <span>Última actualización: {formatDate(key.updated_at)}</span>
          </div>
        </div>
      ))}
    </div>
  );
} 