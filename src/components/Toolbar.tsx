import { Button } from './ui/button';
import { Input } from './ui/input';
import { Save, FolderOpen, FileDown, Share2, FileText, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import { Label } from './ui/label';
import { useState } from 'react';

interface ToolbarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onShare: () => void;
  onBrandSettings: () => void;
}

export function Toolbar({
  projectName,
  onProjectNameChange,
  onSave,
  onLoad,
  onExport,
  onShare,
  onBrandSettings,
}: ToolbarProps) {
  const [isEditingName, setIsEditingName] = useState(false);

  return (
    <div className="h-16 border-b border-border bg-card px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          {isEditingName ? (
            <Input
              value={projectName}
              onChange={(e) => onProjectNameChange(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
              className="h-8 w-64"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="px-2 py-1 rounded hover:bg-accent"
            >
              {projectName}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={onLoad}>
          <FolderOpen className="w-4 h-4 mr-2" />
          Load
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
        <Button variant="outline" size="sm" onClick={onShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" size="sm" onClick={onBrandSettings}>
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
