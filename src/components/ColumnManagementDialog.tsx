import { useState } from 'react';
import { CustomColumn, CustomColumnType } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ColumnManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customColumns: CustomColumn[];
  visibleDefaultColumns: string[];
  onCustomColumnAdd: (column: Omit<CustomColumn, 'id'>) => void;
  onCustomColumnDelete: (columnId: string) => void;
  onDefaultColumnsChange: (visibleColumns: string[]) => void;
}

const DEFAULT_COLUMNS = [
  { id: 'daylight', name: 'Daylight', description: 'Natural light requirement' },
  { id: 'plumbing', name: 'Plumbing', description: 'Plumbing requirement' },
  { id: 'privacy', name: 'Privacy', description: 'Privacy level (low/medium/high)' },
  { id: 'equipment', name: 'Equipment', description: 'Equipment and fixtures' },
  { id: 'notes', name: 'Notes', description: 'General notes and comments' },
];

export function ColumnManagementDialog({
  open,
  onOpenChange,
  customColumns,
  visibleDefaultColumns,
  onCustomColumnAdd,
  onCustomColumnDelete,
  onDefaultColumnsChange,
}: ColumnManagementDialogProps) {
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<CustomColumnType>('text');
  const [newColumnOptions, setNewColumnOptions] = useState('');

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;

    onCustomColumnAdd({
      name: newColumnName.trim(),
      type: newColumnType,
      options: newColumnType === 'select' ? newColumnOptions.split(',').map(o => o.trim()).filter(Boolean) : undefined,
    });

    // Reset form
    setNewColumnName('');
    setNewColumnType('text');
    setNewColumnOptions('');
  };

  const toggleDefaultColumn = (columnId: string) => {
    if (visibleDefaultColumns.includes(columnId)) {
      onDefaultColumnsChange(visibleDefaultColumns.filter(id => id !== columnId));
    } else {
      onDefaultColumnsChange([...visibleDefaultColumns, columnId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#e8e6e1] border-[#1e3a5f]/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#1e3a5f] uppercase tracking-[0.1em] text-sm">
            Manage Columns
          </DialogTitle>
          <DialogDescription className="text-[11px] text-[#475569]">
            Show or hide default columns, and add custom columns for your project needs.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="default" className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-white/60">
            <TabsTrigger value="default" className="text-[11px] uppercase tracking-[0.02em]">
              Default Columns
            </TabsTrigger>
            <TabsTrigger value="custom" className="text-[11px] uppercase tracking-[0.02em]">
              Custom Columns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="default" className="space-y-3 mt-4">
            <p className="text-[10px] text-[#475569] tracking-[0.02em] uppercase mb-3">
              Select which default columns to display. Name and Area (SF) are always shown.
            </p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {DEFAULT_COLUMNS.map((column) => (
                <div
                  key={column.id}
                  className="flex items-center gap-3 p-3 rounded-md bg-white/60 hover:bg-white/80 transition-colors"
                >
                  <Checkbox
                    checked={visibleDefaultColumns.includes(column.id)}
                    onCheckedChange={() => toggleDefaultColumn(column.id)}
                    className="border-[#1e3a5f]/30 data-[state=checked]:bg-[#1e3a5f] data-[state=checked]:border-[#1e3a5f]"
                  />
                  <div className="flex-1">
                    <div className="text-[11px] text-[#1e3a5f] tracking-[0.02em] uppercase font-medium">
                      {column.name}
                    </div>
                    <div className="text-[10px] text-[#475569]">
                      {column.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 mt-4">
            {/* Add Custom Column Form */}
            <form onSubmit={handleAddColumn} className="space-y-4 p-4 rounded-md bg-white/40 border border-[#1e3a5f]/10">
              <div>
                <Label className="text-[11px] text-[#475569] uppercase tracking-[0.05em]">
                  Column Name
                </Label>
                <Input
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="e.g., ADA Compliance"
                  className="mt-1.5 bg-white/60 border-[#1e3a5f]/20"
                />
              </div>

              <div>
                <Label className="text-[11px] text-[#475569] uppercase tracking-[0.05em]">
                  Column Type
                </Label>
                <select
                  value={newColumnType}
                  onChange={(e) => setNewColumnType(e.target.value as CustomColumnType)}
                  className="mt-1.5 w-full h-10 px-3 text-sm rounded-md border border-[#1e3a5f]/20 bg-white/60 focus:border-[#1e3a5f]/40 focus:bg-white focus:outline-none"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="select">Dropdown</option>
                </select>
              </div>

              {newColumnType === 'select' && (
                <div>
                  <Label className="text-[11px] text-[#475569] uppercase tracking-[0.05em]">
                    Options (comma-separated)
                  </Label>
                  <Input
                    value={newColumnOptions}
                    onChange={(e) => setNewColumnOptions(e.target.value)}
                    placeholder="e.g., Yes, No, Partial"
                    className="mt-1.5 bg-white/60 border-[#1e3a5f]/20"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-[11px] uppercase tracking-[0.02em]"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Custom Column
              </Button>
            </form>

            {/* Custom Columns List */}
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {customColumns.length === 0 ? (
                <div className="text-center py-8 text-[11px] text-[#475569] tracking-[0.02em] uppercase">
                  No custom columns yet
                </div>
              ) : (
                customColumns.map((column) => (
                  <div
                    key={column.id}
                    className="flex items-center justify-between p-3 rounded-md bg-white/60 hover:bg-white/80 transition-colors"
                  >
                    <div>
                      <div className="text-[11px] text-[#1e3a5f] tracking-[0.02em] uppercase font-medium">
                        {column.name}
                      </div>
                      <div className="text-[10px] text-[#475569] capitalize">
                        {column.type}
                        {column.type === 'select' && column.options && ` • ${column.options.join(', ')}`}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCustomColumnDelete(column.id)}
                      className="h-8 w-8 p-0 hover:bg-[#dc2626]/10 hover:text-[#dc2626] text-[#475569]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t border-[#1e3a5f]/10">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-[11px] uppercase tracking-[0.02em]"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
