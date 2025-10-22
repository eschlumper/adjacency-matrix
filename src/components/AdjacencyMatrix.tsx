import { useState } from 'react';
import { Space, AdjacencyStrength, ADJACENCY_SYMBOLS } from '../types';

interface AdjacencyMatrixProps {
  spaces: Space[];
  adjacencies: Record<string, AdjacencyStrength>;
  onAdjacencyChange: (spaceId1: string, spaceId2: string, strength: AdjacencyStrength) => void;
}

// Circle symbol component for cleaner rendering
function CircleSymbol({ type, color, size = 20 }: { type: 'filled' | 'outlined' | 'none' | 'dash'; color: string; size?: number }) {
  if (type === 'none') return null;
  
  if (type === 'dash') {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <line x1="5" y1="10" x2="15" y2="10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  
  if (type === 'filled') {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="6" fill={color} />
      </svg>
    );
  }
  
  // outlined
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="5.5" stroke={color} strokeWidth="2" fill="none" />
    </svg>
  );
}

export function AdjacencyMatrix({ spaces, adjacencies, onAdjacencyChange }: AdjacencyMatrixProps) {
  const [hoveredCell, setHoveredCell] = useState<{ rowId: string; colId: string; rowName: string; colName: string } | null>(null);

  const getAdjacencyKey = (id1: string, id2: string) => {
    return [id1, id2].sort().join('-');
  };

  const cycleAdjacency = (currentStrength: AdjacencyStrength): AdjacencyStrength => {
    const cycle: AdjacencyStrength[] = [null, 'required', 'preferred', 'neutral'];
    const currentIndex = cycle.indexOf(currentStrength);
    return cycle[(currentIndex + 1) % cycle.length];
  };

  const handleCellClick = (spaceId1: string, spaceId2: string) => {
    const key = getAdjacencyKey(spaceId1, spaceId2);
    const current = adjacencies[key] || null;
    const next = cycleAdjacency(current);
    onAdjacencyChange(spaceId1, spaceId2, next);
  };

  const isLabelHighlighted = (spaceId: string) => {
    if (!hoveredCell) return false;
    return hoveredCell.rowId === spaceId || hoveredCell.colId === spaceId;
  };

  const getSpaceName = (spaceId: string) => {
    return spaces.find(s => s.id === spaceId)?.name || '';
  };

  if (spaces.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-[#e8e6e1] text-[#475569] text-[11px] tracking-[0.02em] uppercase">
        Add spaces to begin building your adjacency matrix
      </div>
    );
  }

  const cellSize = 48; // px

  return (
    <div className="overflow-auto h-full bg-[#e8e6e1]">
      <div className="min-w-full px-12 py-12 flex flex-col items-start gap-10">
        {/* Title */}
        <div>
          <h2 className="text-[#475569] uppercase tracking-[0.15em] text-xs font-medium">Adjacency Matrix</h2>
        </div>

        {/* Triangular Matrix */}
        <div className="inline-block bg-white/40 backdrop-blur-sm rounded-sm border border-[#1e3a5f]/10 p-8">
          <table className="border-separate border-spacing-0">
            <tbody>
              {/* Data rows - each row compares that space with all previous spaces */}
              {spaces.map((rowSpace, rowIndex) => {
                if (rowIndex === 0) return null; // Skip first space (no comparisons yet)
                
                return (
                  <tr key={rowSpace.id}>
                    {/* Row label */}
                    <td 
                      className="pr-5 py-0 text-right align-middle"
                      style={{ height: `${cellSize}px` }}
                    >
                      <div
                        className={`text-[11px] tracking-[0.04em] whitespace-nowrap transition-all duration-200 uppercase inline-block px-2 py-1 ${
                          isLabelHighlighted(rowSpace.id)
                            ? 'text-[#1e3a5f] font-semibold border-b-2 border-[#1e3a5f]/40'
                            : 'text-[#475569] font-medium'
                        }`}
                      >
                        {rowSpace.name}
                      </div>
                    </td>

                    {/* Cells - one for each space that comes before this row */}
                    {spaces.slice(0, rowIndex).map((colSpace, colIndex) => {
                      const key = getAdjacencyKey(rowSpace.id, colSpace.id);
                      const strength = adjacencies[key] || null;
                      const symbolData = ADJACENCY_SYMBOLS[strength];
                      const isHovered = 
                        (hoveredCell?.rowId === rowSpace.id && hoveredCell?.colId === colSpace.id) ||
                        (hoveredCell?.rowId === colSpace.id && hoveredCell?.colId === rowSpace.id);

                      // Check if this is a diagonal cell
                      const isDiagonal = colIndex === rowIndex - 1;

                      return (
                        <td
                          key={colSpace.id}
                          className="p-0 align-middle relative"
                        >
                          {/* Diagonal line for diagonal cells */}
                          {isDiagonal && (
                            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                              <svg 
                                width={cellSize} 
                                height={cellSize} 
                                className="absolute top-0 left-0"
                                style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                              >
                                <line 
                                  x1="0" 
                                  y1="0" 
                                  x2={cellSize} 
                                  y2={cellSize} 
                                  stroke="#1e3a5f" 
                                  strokeWidth="1.5"
                                  opacity="0.3"
                                />
                              </svg>
                            </div>
                          )}

                          <div
                            className={`cursor-pointer transition-all duration-200 flex items-center justify-center relative ${
                              isHovered
                                ? 'bg-[#1e3a5f]/12 border-[#1e3a5f]/50 shadow-md scale-105'
                                : 'bg-white/80 border-[#1e3a5f]/20 hover:bg-[#1e3a5f]/5'
                            }`}
                            style={{ 
                              width: `${cellSize}px`, 
                              height: `${cellSize}px`,
                              borderWidth: isHovered ? '2px' : '1px',
                              borderStyle: 'solid',
                            }}
                            onClick={() => handleCellClick(rowSpace.id, colSpace.id)}
                            onMouseEnter={() => setHoveredCell({ 
                              rowId: rowSpace.id, 
                              colId: colSpace.id,
                              rowName: rowSpace.name,
                              colName: colSpace.name
                            })}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            <CircleSymbol type={symbolData.type} color={symbolData.color} size={18} />

                            {/* Relationship tooltip */}
                            {isHovered && (
                              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[#1e3a5f] text-white text-[10px] px-3 py-1.5 rounded whitespace-nowrap tracking-wide font-medium pointer-events-none z-20 shadow-lg">
                                <div className="text-center">
                                  <div className="opacity-90">{rowSpace.name} ↔ {colSpace.name}</div>
                                  <div className="text-[9px] mt-0.5 opacity-75 uppercase">{symbolData.label}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Column labels row - rotated 45 degrees */}
              <tr>
                <td className="pt-5"></td>
                {spaces.slice(0, -1).map((space, index) => (
                  <td 
                    key={space.id} 
                    className="pt-5 pb-2 align-top relative"
                    style={{ width: `${cellSize}px` }}
                  >
                    <div 
                      className="flex items-start justify-center overflow-visible"
                      style={{ height: '80px' }}
                    >
                      <div
                        className={`transform -rotate-45 origin-bottom-left whitespace-nowrap text-[11px] tracking-[0.04em] transition-all duration-200 uppercase px-2 py-1 ${
                          isLabelHighlighted(space.id)
                            ? 'text-[#1e3a5f] font-semibold border-b-2 border-[#1e3a5f]/40'
                            : 'text-[#475569] font-medium'
                        }`}
                        style={{
                          transformOrigin: 'bottom left',
                          position: 'absolute',
                          left: '50%',
                          bottom: '8px',
                        }}
                      >
                        {space.name}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="bg-white/40 backdrop-blur-sm rounded-sm border border-[#1e3a5f]/10 px-6 py-4">
          <div className="flex items-center gap-8">
            {Object.entries(ADJACENCY_SYMBOLS)
              .filter(([key]) => key !== 'null' && key !== 'avoid')
              .map(([key, data]) => (
                <div key={key} className="flex items-center gap-3">
                  <div 
                    className="border border-[#1e3a5f]/20 flex items-center justify-center bg-white/80"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <CircleSymbol type={data.type} color={data.color} size={18} />
                  </div>
                  <span className="text-[11px] text-[#475569] tracking-[0.04em] uppercase font-medium">
                    {data.label}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
