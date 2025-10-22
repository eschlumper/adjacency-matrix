import { useState, useEffect } from 'react';
import { ProjectData, Space, AdjacencyStrength, CustomColumn } from './types';
import { Toolbar } from './components/Toolbar';
import { AdjacencyMatrix } from './components/AdjacencyMatrix';
import { CriteriaTable } from './components/CriteriaTable';
import { ExportDialog, ExportSettings } from './components/ExportDialog';
import { BrandSettingsDialog, BrandSettings } from './components/BrandSettingsDialog';
import { LoadDialog } from './components/LoadDialog';
import { ShareDialog } from './components/ShareDialog';
import { saveProjectToLocal, getAllProjects, loadProjectById, getCurrentProjectId, deleteProject, importProjectFromJSON } from './utils/storage';
import { exportToPDF } from './utils/export';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

const DEFAULT_VISIBLE_COLUMNS = ['daylight', 'plumbing', 'privacy', 'equipment', 'notes'];

function createNewProject(): ProjectData {
  return {
    id: crypto.randomUUID(),
    name: 'Untitled Project',
    spaces: [],
    adjacencies: {},
    customColumns: [],
    visibleDefaultColumns: DEFAULT_VISIBLE_COLUMNS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function createNewSpace(name: string = 'New Space'): Space {
  return {
    id: crypto.randomUUID(),
    name,
    plannedArea: null,
    daylight: false,
    plumbing: false,
    privacy: 'medium',
    equipment: '',
    notes: '',
  };
}

export default function App() {
  const [project, setProject] = useState<ProjectData>(() => {
    const currentId = getCurrentProjectId();
    if (currentId) {
      const loaded = loadProjectById(currentId);
      if (loaded) {
        // Ensure visibleDefaultColumns exists for backwards compatibility
        if (!loaded.visibleDefaultColumns) {
          loaded.visibleDefaultColumns = DEFAULT_VISIBLE_COLUMNS;
        }
        return loaded;
      }
    }
    return createNewProject();
  });

  const [brandSettings, setBrandSettings] = useState<BrandSettings>(() => {
    const saved = localStorage.getItem('brand-settings');
    return saved ? JSON.parse(saved) : {
      companyName: '',
      logo: null,
      primaryColor: '#030213',
      accentColor: '#2563eb',
    };
  });

  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const updateProject = (updates: Partial<ProjectData>) => {
    setProject(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSave = () => {
    saveProjectToLocal(project);
    toast.success('Project saved successfully');
  };

  const handleLoad = (loadedProject: ProjectData) => {
    setProject(loadedProject);
    toast.success(`Loaded project: ${loadedProject.name}`);
  };

  const handleImport = async (file: File) => {
    try {
      const imported = await importProjectFromJSON(file);
      setProject(imported);
      saveProjectToLocal(imported);
      setLoadDialogOpen(false);
      toast.success(`Imported project: ${imported.name}`);
    } catch (error) {
      toast.error('Failed to import project. Please check the file format.');
    }
  };

  const handleExport = (settings: ExportSettings) => {
    exportToPDF(project, settings, brandSettings);
    toast.success('Opening print dialog...');
  };

  const handleSpaceAdd = () => {
    const newSpace = createNewSpace(`Space ${project.spaces.length + 1}`);
    updateProject({
      spaces: [...project.spaces, newSpace],
    });
  };

  const handleSpaceUpdate = (spaceId: string, updates: Partial<Space>) => {
    updateProject({
      spaces: project.spaces.map(space =>
        space.id === spaceId ? { ...space, ...updates } : space
      ),
    });
  };

  const handleSpaceDelete = (spaceId: string) => {
    // Remove adjacencies involving this space
    const newAdjacencies = { ...project.adjacencies };
    Object.keys(newAdjacencies).forEach(key => {
      if (key.includes(spaceId)) {
        delete newAdjacencies[key];
      }
    });

    updateProject({
      spaces: project.spaces.filter(space => space.id !== spaceId),
      adjacencies: newAdjacencies,
    });
  };

  const handleAdjacencyChange = (spaceId1: string, spaceId2: string, strength: AdjacencyStrength) => {
    const key = [spaceId1, spaceId2].sort().join('-');
    const newAdjacencies = { ...project.adjacencies };
    
    if (strength === null) {
      delete newAdjacencies[key];
    } else {
      newAdjacencies[key] = strength;
    }

    updateProject({ adjacencies: newAdjacencies });
  };

  const handleBrandSettingsSave = (settings: BrandSettings) => {
    setBrandSettings(settings);
    localStorage.setItem('brand-settings', JSON.stringify(settings));
    toast.success('Brand settings saved');
  };

  const handleCustomColumnAdd = (column: Omit<CustomColumn, 'id'>) => {
    const newColumn: CustomColumn = {
      ...column,
      id: crypto.randomUUID(),
    };
    updateProject({
      customColumns: [...(project.customColumns || []), newColumn],
    });
    toast.success(`Column "${column.name}" added`);
  };

  const handleCustomColumnDelete = (columnId: string) => {
    const columnName = project.customColumns?.find(c => c.id === columnId)?.name;
    
    // Remove column from customColumns
    updateProject({
      customColumns: project.customColumns?.filter(c => c.id !== columnId),
      // Also remove the data from all spaces
      spaces: project.spaces.map(space => {
        if (space.customFields && space.customFields[columnId] !== undefined) {
          const { [columnId]: _, ...remainingFields } = space.customFields;
          return { ...space, customFields: remainingFields };
        }
        return space;
      }),
    });
    
    if (columnName) {
      toast.success(`Column "${columnName}" removed`);
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (project.spaces.length > 0) {
        saveProjectToLocal(project);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [project]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Toolbar
        projectName={project.name}
        onProjectNameChange={(name) => updateProject({ name })}
        onSave={handleSave}
        onLoad={() => setLoadDialogOpen(true)}
        onExport={() => setExportDialogOpen(true)}
        onShare={() => setShareDialogOpen(true)}
        onBrandSettings={() => setBrandDialogOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Adjacency Matrix */}
        <div className="flex-1 overflow-hidden">
          <AdjacencyMatrix
            spaces={project.spaces}
            adjacencies={project.adjacencies}
            onAdjacencyChange={handleAdjacencyChange}
          />
        </div>

        {/* Right Panel - Criteria Table */}
        <div className="w-[800px] overflow-hidden">
          <CriteriaTable
            spaces={project.spaces}
            customColumns={project.customColumns || []}
            visibleDefaultColumns={project.visibleDefaultColumns || DEFAULT_VISIBLE_COLUMNS}
            onSpaceUpdate={handleSpaceUpdate}
            onSpaceDelete={handleSpaceDelete}
            onSpaceAdd={handleSpaceAdd}
            onCustomColumnAdd={handleCustomColumnAdd}
            onCustomColumnDelete={handleCustomColumnDelete}
            onDefaultColumnsChange={(visibleColumns) => updateProject({ visibleDefaultColumns: visibleColumns })}
          />
        </div>
      </div>

      {/* Footer Attribution */}
      <div className="border-t border-[#1e3a5f]/10 bg-white/40 backdrop-blur-sm px-6 py-3">
        <div className="text-center text-[10px] text-[#475569] tracking-[0.05em] uppercase font-medium">
          Made with <span className="text-[#dc2626]">♡</span> by Erica Schlumper at Airi Studio
        </div>
      </div>

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        onExport={handleExport}
        projectName={project.name}
      />

      <BrandSettingsDialog
        open={brandDialogOpen}
        onOpenChange={setBrandDialogOpen}
        settings={brandSettings}
        onSave={handleBrandSettingsSave}
      />

      <LoadDialog
        open={loadDialogOpen}
        onOpenChange={setLoadDialogOpen}
        projects={getAllProjects()}
        onLoad={handleLoad}
        onDelete={(id) => {
          deleteProject(id);
          toast.success('Project deleted');
          setLoadDialogOpen(false);
          setLoadDialogOpen(true); // Reopen to refresh list
        }}
        onImport={handleImport}
      />

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        project={project}
      />

      <Toaster />
    </div>
  );
}
