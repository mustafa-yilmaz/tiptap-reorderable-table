// ReorderableTableComponent.js
import React, { useState, useEffect, useContext } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { Editor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ActiveEditorContext } from "./TableEditor";

const ReorderableTableComponent = ({ editor: parentEditor }) => {
  // Access the active editor context
  const { setActiveEditor } = useContext(ActiveEditorContext);
  
  // Initialize with 4 rows and 3 columns
  const [rows, setRows] = useState([
    ["Row 1, Col 1", "Row 1, Col 2", "Row 1, Col 3"],
    ["Row 2, Col 1", "Row 2, Col 2", "Row 2, Col 3"],
    ["Row 3, Col 1", "Row 3, Col 2", "Row 3, Col 3"],
    ["Row 4, Col 1", "Row 4, Col 2", "Row 4, Col 3"],
  ]);

  // Create cell editors
  const [cellEditors, setCellEditors] = useState([]);

  // Initialize cell editors
  useEffect(() => {
    const newCellEditors = rows.map(row => 
      row.map((content, i) => {
        const cellEditor = new Editor({
          extensions: [StarterKit],
          content: content,
          editable: true,
          // When this editor is focused, set it as the active editor
          onFocus: () => {
            setActiveEditor(cellEditor);
          },
        });
        return cellEditor;
      })
    );
    
    setCellEditors(newCellEditors);
    
    // Clean up editors on unmount
    return () => {
      newCellEditors.forEach(row => 
        row.forEach(editor => {
          if (editor) editor.destroy();
        })
      );
    };
  }, [rows, setActiveEditor]);

  // Move a row up
  const moveRowUp = (index) => {
    if (index === 0) return; // Can't move first row up
    
    const newRows = [...rows];
    const temp = newRows[index];
    newRows[index] = newRows[index - 1];
    newRows[index - 1] = temp;
    
    // Also move the editors
    const newEditors = [...cellEditors];
    const tempEditors = newEditors[index];
    newEditors[index] = newEditors[index - 1];
    newEditors[index - 1] = tempEditors;
    
    setRows(newRows);
    setCellEditors(newEditors);
  };
  
  // Move a row down
  const moveRowDown = (index) => {
    if (index === rows.length - 1) return; // Can't move last row down
    
    const newRows = [...rows];
    const temp = newRows[index];
    newRows[index] = newRows[index + 1];
    newRows[index + 1] = temp;
    
    // Also move the editors
    const newEditors = [...cellEditors];
    const tempEditors = newEditors[index];
    newEditors[index] = newEditors[index + 1];
    newEditors[index + 1] = tempEditors;
    
    setRows(newRows);
    setCellEditors(newEditors);
  };

  // Add a new row
  const addRow = () => {
    // Add a new row with empty cells
    const newRow = Array(rows[0].length).fill("");
    setRows([...rows, newRow]);
    
    // Create editors for the new row
    const newRowEditors = newRow.map(() => {
      const cellEditor = new Editor({
        extensions: [StarterKit],
        content: "",
        editable: true,
        onFocus: () => {
          setActiveEditor(cellEditor);
        },
      });
      return cellEditor;
    });
    
    setCellEditors([...cellEditors, newRowEditors]);
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
                {cellEditors[rowIndex]?.map((cellEditor, cellIndex) => (
                  <td key={cellIndex} className="table-cell-editor">
                    {cellEditor && <EditorContent editor={cellEditor} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-actions">
          <button 
            className="add-row-button" 
            onClick={addRow}
            title="Add new row"
          >
            + Add Row
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ReorderableTableComponent;