import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useState } from 'react';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (settings: ExportSettings) => void;
  projectName: string;
}

export interface ExportSettings {
  includeMatrix: boolean;
  includeCriteria: boolean;
  orientation: 'portrait' | 'landscape';
  paperSize: 'letter' | 'tabloid' | 'A4' | 'A3';
}

export function ExportDialog({ open, onOpenChange, onExport, projectName }: ExportDialogProps) {
  const [settings, setSettings] = useState<ExportSettings>({
    includeMatrix: true,
    includeCriteria: true,
    orientation: 'landscape',
    paperSize: 'tabloid',
  });

  const handleExport = () => {
    onExport(settings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export to PDF</DialogTitle>
          <DialogDescription>
            Configure your export settings for {projectName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Include Sections</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.includeMatrix}
                  onChange={(e) => setSettings({ ...settings, includeMatrix: e.target.checked })}
                  className="rounded border-input"
                />
                <span>Adjacency Matrix</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.includeCriteria}
                  onChange={(e) => setSettings({ ...settings, includeCriteria: e.target.checked })}
                  className="rounded border-input"
                />
                <span>Criteria Table</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Paper Size</Label>
            <select
              value={settings.paperSize}
              onChange={(e) => setSettings({ ...settings, paperSize: e.target.value as ExportSettings['paperSize'] })}
              className="w-full h-9 px-3 rounded-md border border-input bg-background"
            >
              <option value="letter">Letter (8.5" × 11")</option>
              <option value="tabloid">Tabloid (11" × 17")</option>
              <option value="A4">A4 (210mm × 297mm)</option>
              <option value="A3">A3 (297mm × 420mm)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Orientation</Label>
            <select
              value={settings.orientation}
              onChange={(e) => setSettings({ ...settings, orientation: e.target.value as ExportSettings['orientation'] })}
              className="w-full h-9 px-3 rounded-md border border-input bg-background"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            Export PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
