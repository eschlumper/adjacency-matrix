import { ProjectData } from '../types';

const STORAGE_KEY = 'adjacency-matrix-projects';
const CURRENT_PROJECT_KEY = 'adjacency-matrix-current';

export function saveProjectToLocal(project: ProjectData): void {
  try {
    const projects = getAllProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    localStorage.setItem(CURRENT_PROJECT_KEY, project.id);
  } catch (error) {
    console.error('Failed to save project:', error);
    alert('Failed to save project to local storage');
  }
}

export function getAllProjects(): ProjectData[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load projects:', error);
    return [];
  }
}

export function getCurrentProjectId(): string | null {
  return localStorage.getItem(CURRENT_PROJECT_KEY);
}

export function loadProjectById(id: string): ProjectData | null {
  const projects = getAllProjects();
  return projects.find(p => p.id === id) || null;
}

export function deleteProject(id: string): void {
  const projects = getAllProjects();
  const filtered = projects.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  
  if (getCurrentProjectId() === id) {
    localStorage.removeItem(CURRENT_PROJECT_KEY);
  }
}

export function exportProjectAsJSON(project: ProjectData): void {
  const dataStr = JSON.stringify(project, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${project.name.replace(/\s+/g, '-')}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}

export function importProjectFromJSON(file: File): Promise<ProjectData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // Validate basic structure
        if (!data.id || !data.spaces || !data.adjacencies) {
          throw new Error('Invalid project file format');
        }
        resolve(data as ProjectData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
