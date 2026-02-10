import { supabase } from '@/lib/supabase';
import type { ChurnStage, ChurnMetric, ChurnMetricWithStage } from '@/types/churn';

export async function fetchChurnStages(): Promise<ChurnStage[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('churn_stages')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchChurnMetrics(): Promise<ChurnMetricWithStage[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('churn_metrics')
    .select('*, churn_stage:churn_stages(*)')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []).map((m: any) => ({
    ...m,
    churn_stage: m.churn_stage ?? undefined,
  }));
}

export async function createChurnMetric(
  metric: Omit<ChurnMetric, 'id' | 'created_at' | 'updated_at'>
): Promise<ChurnMetric> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('churn_metrics')
    .insert(metric)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Failed to create metric');
  return data;
}

export async function updateChurnMetric(
  id: string,
  updates: Partial<ChurnMetric>
): Promise<ChurnMetric> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('churn_metrics')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Failed to update metric');
  return data;
}

export async function toggleChurnMetric(id: string, is_active: boolean): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('churn_metrics')
    .update({ is_active, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteChurnMetric(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('churn_metrics')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
