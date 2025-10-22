import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useState } from 'react';

export interface BrandSettings {
  companyName: string;
  logo: string | null;
  primaryColor: string;
  accentColor: string;
}

interface BrandSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: BrandSettings;
  onSave: (settings: BrandSettings) => void;
}

export function BrandSettingsDialog({ open, onOpenChange, settings, onSave }: BrandSettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<BrandSettings>(settings);

  const handleSave = () => {
    onSave(localSettings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Brand Settings</DialogTitle>
          <DialogDescription>
            Customize the appearance of your exported documents
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={localSettings.companyName}
              onChange={(e) => setLocalSettings({ ...localSettings, companyName: e.target.value })}
              placeholder="Your Company Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primaryColor"
                type="color"
                value={localSettings.primaryColor}
                onChange={(e) => setLocalSettings({ ...localSettings, primaryColor: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                value={localSettings.primaryColor}
                onChange={(e) => setLocalSettings({ ...localSettings, primaryColor: e.target.value })}
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <div className="flex gap-2">
              <Input
                id="accentColor"
                type="color"
                value={localSettings.accentColor}
                onChange={(e) => setLocalSettings({ ...localSettings, accentColor: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                value={localSettings.accentColor}
                onChange={(e) => setLocalSettings({ ...localSettings, accentColor: e.target.value })}
                placeholder="#2563eb"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL (optional)</Label>
            <Input
              id="logo"
              value={localSettings.logo || ''}
              onChange={(e) => setLocalSettings({ ...localSettings, logo: e.target.value || null })}
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
