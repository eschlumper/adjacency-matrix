import { ProjectData, ADJACENCY_SYMBOLS } from '../types';
import { ExportSettings } from '../components/ExportDialog';
import { BrandSettings } from '../components/BrandSettingsDialog';

export async function exportToPDF(
  project: ProjectData,
  settings: ExportSettings,
  brandSettings: BrandSettings
) {
  // Create a printable HTML document
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to export PDF');
    return;
  }

  const html = generatePrintHTML(project, settings, brandSettings);
  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for content to load, then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}

const DEFAULT_VISIBLE_COLUMNS = ['daylight', 'plumbing', 'privacy', 'equipment', 'notes'];

function generatePrintHTML(
  project: ProjectData,
  settings: ExportSettings,
  brandSettings: BrandSettings
): string {
  const { spaces, adjacencies, name, customColumns = [], visibleDefaultColumns = DEFAULT_VISIBLE_COLUMNS } = project;
  const getAdjacencyKey = (id1: string, id2: string) => [id1, id2].sort().join('-');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${name} - Adjacency Matrix</title>
      <style>
        @media print {
          @page {
            size: ${settings.paperSize} ${settings.orientation};
            margin: 0.5in;
          }
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          color: #000;
          background: white;
          padding: 20px;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 3px solid ${brandSettings.primaryColor};
        }
        
        .header h1 {
          font-size: 24px;
          color: ${brandSettings.primaryColor};
        }
        
        .header .company {
          font-size: 14px;
          color: #666;
        }
        
        .content {
          display: ${settings.orientation === 'landscape' ? 'flex' : 'block'};
          gap: 30px;
        }
        
        .section {
          margin-bottom: 30px;
          ${settings.orientation === 'landscape' ? 'flex: 1;' : ''}
        }
        
        .section h2 {
          font-size: 18px;
          margin-bottom: 15px;
          color: ${brandSettings.primaryColor};
        }
        
        /* Matrix styles */
        .matrix-table {
          border-collapse: collapse;
          font-size: 11px;
        }
        
        .matrix-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
        
        .matrix-table .label {
          background: #f5f5f5;
          font-weight: 500;
          text-align: left;
          white-space: nowrap;
        }
        
        .matrix-table .cell {
          width: 40px;
          height: 40px;
          cursor: default;
          font-size: 18px;
        }
        
        .matrix-table .diagonal-label {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          padding: 8px 4px;
          background: #f5f5f5;
        }
        
        /* Criteria table styles */
        .criteria-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }
        
        .criteria-table th {
          background: ${brandSettings.primaryColor};
          color: white;
          padding: 8px;
          text-align: left;
          font-weight: 500;
        }
        
        .criteria-table td {
          border: 1px solid #ddd;
          padding: 6px 8px;
        }
        
        .criteria-table tr:nth-child(even) {
          background: #f9f9f9;
        }
        
        /* Legend */
        .legend {
          margin-top: 15px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #f9f9f9;
        }
        
        .legend h3 {
          font-size: 12px;
          margin-bottom: 8px;
        }
        
        .legend-items {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
        }
        
        .legend-symbol {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>${name}</h1>
          <div class="company">${brandSettings.companyName || 'Interior Architecture'}</div>
        </div>
        <div style="color: #666; font-size: 12px;">
          ${new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div class="content">
        ${settings.includeMatrix ? `
          <div class="section">
            <h2>Adjacency Matrix</h2>
            <table class="matrix-table">
              <tbody>
                ${spaces.map((rowSpace, rowIndex) => `
                  <tr>
                    <td class="label">${rowSpace.name}</td>
                    ${spaces.map((colSpace, colIndex) => {
                      if (colIndex >= rowIndex) return '';
                      const key = getAdjacencyKey(rowSpace.id, colSpace.id);
                      const strength = adjacencies[key] || null;
                      const symbolData = ADJACENCY_SYMBOLS[strength];
                      return `
                        <td class="cell">
                          <span style="color: ${symbolData.color}">${symbolData.symbol}</span>
                        </td>
                      `;
                    }).join('')}
                  </tr>
                `).join('')}
                <tr>
                  <td></td>
                  ${spaces.slice(0, -1).map(space => `
                    <td class="diagonal-label">${space.name}</td>
                  `).join('')}
                </tr>
              </tbody>
            </table>
            
            <div class="legend">
              <h3>Legend</h3>
              <div class="legend-items">
                ${Object.entries(ADJACENCY_SYMBOLS)
                  .filter(([key]) => key !== 'null')
                  .map(([key, data]) => `
                    <div class="legend-item">
                      <span class="legend-symbol" style="color: ${data.color}">${data.symbol}</span>
                      <span>${data.label}</span>
                    </div>
                  `).join('')}
              </div>
            </div>
          </div>
        ` : ''}
        
        ${settings.includeCriteria ? `
          <div class="section">
            <h2>Program Criteria</h2>
            <table class="criteria-table">
              <thead>
                <tr>
                  <th>Space</th>
                  <th>Area (SF)</th>
                  ${visibleDefaultColumns.includes('daylight') ? '<th>Daylight</th>' : ''}
                  ${visibleDefaultColumns.includes('plumbing') ? '<th>Plumbing</th>' : ''}
                  ${visibleDefaultColumns.includes('privacy') ? '<th>Privacy</th>' : ''}
                  ${visibleDefaultColumns.includes('equipment') ? '<th>Equipment</th>' : ''}
                  ${visibleDefaultColumns.includes('notes') ? '<th>Notes</th>' : ''}
                  ${customColumns.map(col => `<th>${col.name}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${spaces.map(space => `
                  <tr>
                    <td>${space.name}</td>
                    <td>${space.plannedArea || '-'}</td>
                    ${visibleDefaultColumns.includes('daylight') ? `<td>${space.daylight ? '✓' : ''}</td>` : ''}
                    ${visibleDefaultColumns.includes('plumbing') ? `<td>${space.plumbing ? '✓' : ''}</td>` : ''}
                    ${visibleDefaultColumns.includes('privacy') ? `<td>${space.privacy}</td>` : ''}
                    ${visibleDefaultColumns.includes('equipment') ? `<td>${space.equipment || '-'}</td>` : ''}
                    ${visibleDefaultColumns.includes('notes') ? `<td>${space.notes || '-'}</td>` : ''}
                    ${customColumns.map(col => {
                      const value = space.customFields?.[col.id];
                      if (col.type === 'checkbox') {
                        return `<td>${value ? '✓' : ''}</td>`;
                      }
                      return `<td>${value || '-'}</td>`;
                    }).join('')}
                  </tr>
                `).join('')}
                <tr style="font-weight: 500; background: #f0f0f0;">
                  <td>Total</td>
                  <td>${spaces.reduce((sum, s) => sum + (s.plannedArea || 0), 0)}</td>
                  <td colspan="${visibleDefaultColumns.length + customColumns.length}"></td>
                </tr>
              </tbody>
            </table>
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
}
