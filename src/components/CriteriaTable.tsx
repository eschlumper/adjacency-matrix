import { Space, CustomColumn } from '../types';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Trash2, Plus, Settings2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ColumnManagementDialog } from './ColumnManagementDialog';

interface CriteriaTableProps {
  spaces: Space[];
  customColumns: CustomColumn[];
  visibleDefaultColumns: string[];
  onSpaceUpdate: (spaceId: string, updates: Partial<Space>) => void;
  onSpaceDelete: (spaceId: string) => void;
  onSpaceAdd: () => void;
  onCustomColumnAdd: (column: Omit<CustomColumn, 'id'>) => void;
  onCustomColumnDelete: (columnId: string) => void;
  onDefaultColumnsChange: (visibleColumns: string[]) => void;
}

export function CriteriaTable({ 
  spaces, 
  customColumns,
  visibleDefaultColumns,
  onSpaceUpdate, 
  onSpaceDelete, 
  onSpaceAdd,
  onCustomColumnAdd,
  onCustomColumnDelete,
  onDefaultColumnsChange,
}: CriteriaTableProps) {
  const [columnDialogOpen, setColumnDialogOpen] = useState(false);

  const totalSquareFootage = useMemo(() => {
    return spaces.reduce((sum, space) => {
      return sum + (space.plannedArea || 0);
    }, 0);
  }, [spaces]);

  const handleCustomFieldUpdate = (spaceId: string, columnId: string, value: any) => {
    const space = spaces.find(s => s.id === spaceId);
    const customFields = { ...space?.customFields, [columnId]: value };
    onSpaceUpdate(spaceId, { customFields });
  };

  const renderCustomField = (space: Space, column: CustomColumn) => {
    const value = space.customFields?.[column.id];

    switch (column.type) {
      case 'checkbox':
        return (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={value || false}
              onCheckedChange={(checked) => handleCustomFieldUpdate(space.id, column.id, checked)}
              className="border-[#1e3a5f]/30 data-[state=checked]:bg-[#1e3a5f] data-[state=checked]:border-[#1e3a5f]"
            />
          </div>
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleCustomFieldUpdate(space.id, column.id, e.target.value ? Number(e.target.value) : null)}
            className="h-8 text-[11px] tracking-[0.02em] bg-white/60 border-[#1e3a5f]/20 focus:border-[#1e3a5f]/40 focus:bg-white"
          />
        );
      
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleCustomFieldUpdate(space.id, column.id, e.target.value)}
            className="w-full h-8 px-2 text-[11px] tracking-[0.02em] rounded-md border border-[#1e3a5f]/20 bg-white/60 focus:border-[#1e3a5f]/40 focus:bg-white focus:outline-none"
          >
            <option value="">—</option>
            {column.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'text':
      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleCustomFieldUpdate(space.id, column.id, e.target.value)}
            className="h-8 text-[11px] tracking-[0.02em] bg-white/60 border-[#1e3a5f]/20 focus:border-[#1e3a5f]/40 focus:bg-white"
          />
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#e8e6e1]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-[#1e3a5f]/10 bg-white/40">
        <div className="flex items-center justify-between">
          <h2 className="text-[#475569] uppercase tracking-[0.15em] text-xs font-medium">Program Criteria</h2>
          <div className="flex gap-2">
            <Button 
              onClick={() => setColumnDialogOpen(true)}
              size="sm"
              variant="outline"
              className="h-8 text-[11px] tracking-[0.02em] uppercase border-[#1e3a5f]/30 hover:bg-[#1e3a5f]/5"
            >
              <Settings2 className="w-3.5 h-3.5 mr-1.5" />
              Manage Columns
            </Button>
            <Button 
              onClick={onSpaceAdd} 
              size="sm"
              className="h-8 text-[11px] tracking-[0.02em] uppercase bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Space
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {spaces.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[#475569] text-[11px] tracking-[0.02em] uppercase">
            No spaces added yet
          </div>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-white/60 backdrop-blur-sm z-10">
              <tr>
                <th className="px-4 py-3 text-left border-b border-[#1e3a5f]/15 min-w-[140px]">
                  <span className="text-[10px] text-[#475569] uppercase tracking-[0.05em] font-medium">Space Name</span>
                </th>
                <th className="px-4 py-3 text-left border-b border-[#1e3a5f]/15 min-w-[90px]">
                  <span className="text-[10px] text-[#475569] uppercase tracking-[0.05em] font-medium">Area (SF)</span>
                </th>
                {visibleDefaultColumns.includes('daylight') && (
                  <th className="px-4 py-3 text-center border-b border-[#1e3a5f]/15 min-w-[80px]">
                    <span className="text-[10px] text-[#475569] uppercase tracking-[0.05em] font-medium">Daylight</span>
                  </th>
                )}
                {visibleDefaultColumns.includes('plumbing') && (
                  <th className="px-4 py-3 text-center border-b border-[#1e3a5f]/15 min-w-[80px]">
                    <span className="text-[10px] text-[#475569] uppercase tracking-[0.05em] font-medium">Plumbing</span>
                  </th>
                )}
                {visibleDefaultColumns.includes('privacy') && (
                  <th className="px-4 py-3 text-left border-b border-[#1e3a5f]/15 min-w-[100px]">
                    <span className="text-[10px] text-[#475569] uppercase tracking-[0.05em] font-medium">Privacy</span>
                  </th>
                )}
                {visibleDefaultColumns.includes('equipment') && (
                  <th className="px-4 py-3 text-left border-b border-[#1e3a5f]/15 min-w-[130px]">
                    <span className="text-[10px] text-[#475569] uppercase tracking-[0.05em] font-medium">Equipment</span>
                  </th>
                )}
                {visibleDefaultColumns.includes('notes') && (
                  <th className="px-4 py-3 text-left border-b border-[#1e3a5f]/15 min-w-[180px]">
                    <span className="text-[10px] text-[#475569] uppercase tracking-[0.05em] font-medium">Notes</span>
                  </th>
                )}
                {customColumns.map((column) => (
                  <th key={column.id} className="px-4 py-3 border-b border-[#1e3a5f]/15 min-w-[100px]">
                    <span className="text-[10px] text-[#475569] uppercase tracking-[0.05em] font-medium">
                      {column.name}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 border-b border-[#1e3a5f]/15 w-[50px]"></th>
              </tr>
            </thead>
            <tbody>
              {spaces.map((space) => (
                <tr key={space.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-4 py-2 border-b border-[#1e3a5f]/10">
                    <Input
                      value={space.name}
                      onChange={(e) => onSpaceUpdate(space.id, { name: e.target.value })}
                      className="h-8 text-[11px] tracking-[0.02em] bg-white/60 border-[#1e3a5f]/20 focus:border-[#1e3a5f]/40 focus:bg-white"
                    />
                  </td>
                  <td className="px-4 py-2 border-b border-[#1e3a5f]/10">
                    <Input
                      type="number"
                      value={space.plannedArea || ''}
                      onChange={(e) => onSpaceUpdate(space.id, { plannedArea: e.target.value ? Number(e.target.value) : null })}
                      className="h-8 text-[11px] tracking-[0.02em] bg-white/60 border-[#1e3a5f]/20 focus:border-[#1e3a5f]/40 focus:bg-white"
                    />
                  </td>
                  {visibleDefaultColumns.includes('daylight') && (
                    <td className="px-4 py-2 border-b border-[#1e3a5f]/10 text-center">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={space.daylight}
                          onCheckedChange={(checked) => onSpaceUpdate(space.id, { daylight: checked as boolean })}
                          className="border-[#1e3a5f]/30 data-[state=checked]:bg-[#1e3a5f] data-[state=checked]:border-[#1e3a5f]"
                        />
                      </div>
                    </td>
                  )}
                  {visibleDefaultColumns.includes('plumbing') && (
                    <td className="px-4 py-2 border-b border-[#1e3a5f]/10 text-center">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={space.plumbing}
                          onCheckedChange={(checked) => onSpaceUpdate(space.id, { plumbing: checked as boolean })}
                          className="border-[#1e3a5f]/30 data-[state=checked]:bg-[#1e3a5f] data-[state=checked]:border-[#1e3a5f]"
                        />
                      </div>
                    </td>
                  )}
                  {visibleDefaultColumns.includes('privacy') && (
                    <td className="px-4 py-2 border-b border-[#1e3a5f]/10">
                      <select
                        value={space.privacy}
                        onChange={(e) => onSpaceUpdate(space.id, { privacy: e.target.value as Space['privacy'] })}
                        className="w-full h-8 px-2 text-[11px] tracking-[0.02em] rounded-md border border-[#1e3a5f]/20 bg-white/60 focus:border-[#1e3a5f]/40 focus:bg-white focus:outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </td>
                  )}
                  {visibleDefaultColumns.includes('equipment') && (
                    <td className="px-4 py-2 border-b border-[#1e3a5f]/10">
                      <Input
                        value={space.equipment}
                        onChange={(e) => onSpaceUpdate(space.id, { equipment: e.target.value })}
                        className="h-8 text-[11px] tracking-[0.02em] bg-white/60 border-[#1e3a5f]/20 focus:border-[#1e3a5f]/40 focus:bg-white"
                      />
                    </td>
                  )}
                  {visibleDefaultColumns.includes('notes') && (
                    <td className="px-4 py-2 border-b border-[#1e3a5f]/10">
                      <Input
                        value={space.notes}
                        onChange={(e) => onSpaceUpdate(space.id, { notes: e.target.value })}
                        className="h-8 text-[11px] tracking-[0.02em] bg-white/60 border-[#1e3a5f]/20 focus:border-[#1e3a5f]/40 focus:bg-white"
                      />
                    </td>
                  )}
                  {customColumns.map((column) => (
                    <td key={column.id} className={`px-4 py-2 border-b border-[#1e3a5f]/10 ${column.type === 'checkbox' ? 'text-center' : ''}`}>
                      {renderCustomField(space, column)}
                    </td>
                  ))}
                  <td className="px-4 py-2 border-b border-[#1e3a5f]/10 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSpaceDelete(space.id)}
                      className="h-8 w-8 p-0 hover:bg-[#dc2626]/10 hover:text-[#dc2626] text-[#475569]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Total Square Footage */}
      {spaces.length > 0 && (
        <div className="border-t border-[#1e3a5f]/10 bg-white/40 backdrop-blur-sm px-8 py-4">
          <div className="flex items-center justify-between max-w-md">
            <span className="text-[11px] text-[#475569] tracking-[0.05em] uppercase font-medium">Total Program Area:</span>
            <span className="text-[13px] text-[#1e3a5f] tracking-[0.02em] font-semibold">
              {totalSquareFootage.toLocaleString()} SF
            </span>
          </div>
        </div>
      )}

      <ColumnManagementDialog
        open={columnDialogOpen}
        onOpenChange={setColumnDialogOpen}
        customColumns={customColumns}
        visibleDefaultColumns={visibleDefaultColumns}
        onCustomColumnAdd={onCustomColumnAdd}
        onCustomColumnDelete={onCustomColumnDelete}
        onDefaultColumnsChange={onDefaultColumnsChange}
      />
    </div>
  );
}
