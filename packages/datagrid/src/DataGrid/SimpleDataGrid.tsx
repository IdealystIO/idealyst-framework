import React from 'react';

interface SimpleColumn {
  key: string;
  header: string;
  width?: number;
}

interface SimpleDataGridProps {
  data: any[];
  columns: SimpleColumn[];
}

export const SimpleDataGrid: React.FC<SimpleDataGridProps> = ({ data, columns }) => {
  return (
    <div style={{ 
      border: '1px solid #ccc',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed'
      }}>
        <thead>
          <tr style={{ 
            backgroundColor: '#f5f5f5',
            borderBottom: '2px solid #ddd'
          }}>
            {columns.map(column => (
              <th 
                key={column.key}
                style={{
                  padding: '12px 8px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  borderRight: '1px solid #ddd',
                  ...(column.width ? { width: column.width } : {})
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr 
              key={index}
              style={{ 
                borderBottom: '1px solid #eee',
                backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff'
              }}
            >
              {columns.map(column => (
                <td 
                  key={column.key}
                  style={{
                    padding: '12px 8px',
                    borderRight: '1px solid #eee',
                    verticalAlign: 'middle'
                  }}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};