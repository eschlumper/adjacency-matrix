import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Copy, Download } from 'lucide-react';
import { exportProjectAsJSON } from '../utils/storage';
import { ProjectData } from '../types';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectData;
}

export function ShareDialog({ open, onOpenChange, project }: ShareDialogProps) {
  const handleCopyLink = () => {
    // This will be implemented when Supabase is connected
    alert('Cloud sharing will be available when connected to Supabase. For now, use "Download JSON" to share the file.');
  };

  const handleDownloadJSON = () => {
    exportProjectAsJSON(project);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
          <DialogDescription>
            Share your adjacency matrix with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm">Cloud Sharing (Requires Supabase)</label>
            <div className="flex gap-2">
              <Input
                value="Connect to Supabase to enable cloud sharing"
                disabled
                className="flex-1"
              />
              <Button onClick={handleCopyLink} disabled>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Cloud sharing allows you to create a public read-only link that anyone can view
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <label className="text-sm">Download & Share File</label>
            <p className="text-xs text-muted-foreground mb-2">
              Download the project as a JSON file to share with colleagues
            </p>
            <Button onClick={handleDownloadJSON} variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download JSON File
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
