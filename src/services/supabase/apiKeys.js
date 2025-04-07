import { supabase } from '@/lib/supabase';

export const apiKeysService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(keyData) {
    const { data, error } = await supabase
      .from('api_keys')
      .insert([keyData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, keyData) {
    const { data, error } = await supabase
      .from('api_keys')
      .update({
        ...keyData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async regenerateKey(id, newKey) {
    const { data, error } = await supabase
      .from('api_keys')
      .update({ 
        key: newKey,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async validateKey(apiKey) {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .eq('is_active', true)
      .single();

    if (error) {
      return { isValid: false, error: error.message };
    }

    return { isValid: true, data };
  }
}; 