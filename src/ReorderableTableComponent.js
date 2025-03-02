// ReorderableTableComponent.js
import React, { useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";

const ReorderableTableComponent = () => {
  const [rows, setRows] = useState([
    ["Row 1, Col 1", "Row 1, Col 2", "Row 1, Col 3"],
    ["Row 2, Col 1", "Row 2, Col 2", "Row 2, Col 3"],
    ["Row 3, Col 1", "Row 3, Col 2", "Row 3, Col 3"],
    ["Row 4, Col 1", "Row 4, Col 2", "Row 4, Col 3"],
  ]);

  // Move a row up
  const moveRowUp = (index) => {
    if (index === 0) return; // Can't move first row up
    
    const newRows = [...rows];
    const temp = newRows[index];
    newRows[index] = newRows[index - 1];
    newRows[index - 1] = temp;
    
    setRows(newRows);
  };
  
  // Move a row down
  const moveRowDown = (index) => {
    if (index === rows.length - 1) return; // Can't move last row down
    
    const newRows = [...rows];
    const temp = newRows[index];
    newRows[index] = newRows[index + 1];
    newRows[index + 1] = temp;
    
    setRows(newRows);
  };

  return (
    <NodeViewWrapper className="reorderable-table-wrapper">
      <div className="reorderable-table-container">
        <table className="reorderable-table">
          <thead>
            <tr>
              <th className="controls-column">Controls</th>
              <th>Column 1</th>
              <th>Column 2</th>
              <th>Column 3</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="controls-cell">
                  <button 
                    className="move-button up" 
                    onClick={() => moveRowUp(rowIndex)}
                    disabled={rowIndex === 0}
                    title="Move row up"
                  >
                    ↑
                  </button>
                  <button 
                    className="move-button down" 
                    onClick={() => moveRowDown(rowIndex)}
                    disabled={rowIndex === rows.length - 1}
                    title="Move row down"
                  >
                    ↓
                  </button>
                </td>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} contentEditable="true" suppressContentEditableWarning={true}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </NodeViewWrapper>
  );
};

export default ReorderableTableComponent;