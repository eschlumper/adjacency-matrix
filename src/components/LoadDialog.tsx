import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { ProjectData } from '../types';
import { Trash2, Upload } from 'lucide-react';
import { useState, useRef } from 'react';

interface LoadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: ProjectData[];
  onLoad: (project: ProjectData) => void;
  onDelete: (id: string) => void;
  onImport: (file: File) => void;
}

export function LoadDialog({ open, onOpenChange, projects, onLoad, onDelete, onImport }: LoadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Load Project</DialogTitle>
          <DialogDescription>
            Choose a project to load or import from file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import from JSON File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No saved projects found
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-auto">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50"
                >
                  <div className="flex-1">
                    <div>{project.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {project.spaces.length} spaces • Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        onLoad(project);
                        onOpenChange(false);
                      }}
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(project.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
