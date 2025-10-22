export type AdjacencyStrength = 'required' | 'preferred' | 'neutral' | 'avoid' | null;

export type CustomColumnType = 'text' | 'number' | 'checkbox' | 'select';

export interface CustomColumn {
  id: string;
  name: string;
  type: CustomColumnType;
  options?: string[]; // For select type
}

export interface Space {
  id: string;
  name: string;
  plannedArea: number | null;
  daylight: boolean;
  plumbing: boolean;
  privacy: 'high' | 'medium' | 'low';
  equipment: string;
  notes: string;
  customFields?: Record<string, any>; // Custom column values
}

export interface ProjectData {
  id: string;
  name: string;
  spaces: Space[];
  adjacencies: Record<string, AdjacencyStrength>; // key format: "spaceId1-spaceId2"
  customColumns?: CustomColumn[]; // Custom columns definition
  visibleDefaultColumns?: string[]; // Which default columns to show (defaults to all if not specified)
  createdAt: string;
  updatedAt: string;
}

export const ADJACENCY_SYMBOLS: Record<AdjacencyStrength, { symbol: string; label: string; color: string; type: 'filled' | 'outlined' | 'none' | 'dash' }> = {
  required: { symbol: '●', label: 'Primary Adjacency', color: '#1e3a5f', type: 'filled' },
  preferred: { symbol: '○', label: 'Secondary Adjacency', color: '#1e3a5f', type: 'outlined' },
  neutral: { symbol: '—', label: 'No Direct Connection', color: '#64748b', type: 'dash' },
  avoid: { symbol: '', label: 'None', color: 'transparent', type: 'none' },
  null: { symbol: '', label: 'None', color: 'transparent', type: 'none' },
};
