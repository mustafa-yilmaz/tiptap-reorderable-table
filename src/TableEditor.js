// TableEditor.js
import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TableExtensions } from "./ReorderableTableExtension";
import "./TableEditor.css";

const TableEditor = () => {
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  
  const editor = useEditor({
    extensions: TableExtensions,
    content: `
      <h3>Reorderable Table</h3>
      <p>This is a table example with row reordering functionality.</p>
      <table>
        <thead>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
            <th>Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Row 1, Cell 1</td>
            <td>Row 1, Cell 2</td>
            <td>Row 1, Cell 3</td>
          </tr>
          <tr>
            <td>Row 2, Cell 1</td>
            <td>Row 2, Cell 2</td>
            <td>Row 2, Cell 3</td>
          </tr>
          <tr>
            <td>Row 3, Cell 1</td>
            <td>Row 3, Cell 2</td>
            <td>Row 3, Cell 3</td>
          </tr>
        </tbody>
      </table>
      <p>Try all the table features plus row reordering!</p>
    `,
    editable: true,
  });

  // Manual row selection function
  const selectRow = (index) => {
    setSelectedRowIndex(index);
  };

  // Move the currently selected row up
  const moveRowUp = () => {
    if (selectedRowIndex === null || selectedRowIndex <= 0 || !editor) return;
    
    const dom = editor.view.dom;
    const tables = dom.querySelectorAll('table');
    
    // Process each table (usually there's just one)
    tables.forEach(table => {
      const tbody = table.querySelector('tbody');
      if (!tbody) return;
      
      const rows = tbody.querySelectorAll('tr');
      if (selectedRowIndex >= rows.length) return;
      
      // Get the rows to swap
      const currentRow = rows[selectedRowIndex];
      const prevRow = rows[selectedRowIndex - 1];
      
      // Swap the rows
      tbody.insertBefore(currentRow, prevRow);
      
      // Update the editor content and maintain selection
      editor.commands.setContent(dom.innerHTML);
      setSelectedRowIndex(selectedRowIndex - 1);
    });
  };

  // Move the currently selected row down
  const moveRowDown = () => {
    if (selectedRowIndex === null || !editor) return;
    
    const dom = editor.view.dom;
    const tables = dom.querySelectorAll('table');
    
    // Process each table (usually there's just one)
    tables.forEach(table => {
      const tbody = table.querySelector('tbody');
      if (!tbody) return;
      
      const rows = tbody.querySelectorAll('tr');
      if (selectedRowIndex >= rows.length - 1) return;
      
      // Get the rows to swap
      const currentRow = rows[selectedRowIndex];
      const nextRow = rows[selectedRowIndex + 1];
      
      // Swap the rows
      if (nextRow.nextSibling) {
        tbody.insertBefore(currentRow, nextRow.nextSibling);
      } else {
        tbody.appendChild(currentRow);
      }
      
      // Update the editor content and maintain selection
      editor.commands.setContent(dom.innerHTML);
      setSelectedRowIndex(selectedRowIndex + 1);
    });
  };

  return (
    <div className="editor-container">
      <div className="visible-tiptap-container">
        <h2>Tiptap Editor</h2>
        
        {/* Editor toolbar */}
        <div className="editor-menu">
          <button onClick={() => editor?.chain().focus().toggleBold().run()}>
            Bold
          </button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()}>
            Italic
          </button>
        </div>
        
        {/* Table operations */}
        <div className="table-buttons">
          <button onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
            Insert Table
          </button>
          <button onClick={() => editor?.chain().focus().addColumnBefore().run()}>
            Add Column Before
          </button>
          <button onClick={() => editor?.chain().focus().addColumnAfter().run()}>
            Add Column After
          </button>
          <button onClick={() => editor?.chain().focus().addRowBefore().run()}>
            Add Row Before
          </button>
          <button onClick={() => editor?.chain().focus().addRowAfter().run()}>
            Add Row After
          </button>
          <button onClick={() => editor?.chain().focus().deleteColumn().run()}>
            Delete Column
          </button>
          <button onClick={() => editor?.chain().focus().deleteRow().run()}>
            Delete Row
          </button>
          <button onClick={() => editor?.chain().focus().deleteTable().run()}>
            Delete Table
          </button>
        </div>
        
        {/* Row reordering controls */}
        <div className="row-reordering-controls">
          <button
            className="row-control-button"
            onClick={moveRowUp}
            disabled={selectedRowIndex === null || selectedRowIndex <= 0}
          >
            ↑ Move Row Up
          </button>
          <button
            className="row-control-button"
            onClick={moveRowDown}
            disabled={selectedRowIndex === null || (editor && selectedRowIndex >= editor.view.dom.querySelectorAll('tbody tr').length - 1)}
          >
            ↓ Move Row Down
          </button>
        </div>
        
        {/* Row selection buttons */}
        <div className="row-selection-options">
          <div className="row-selection-info">
            {selectedRowIndex !== null ? (
              <p>Row {selectedRowIndex + 1} selected</p>
            ) : (
              <p>No row selected. Select a row number:</p>
            )}
          </div>
          
          <div className="row-selection-buttons">
            {editor && Array.from(editor.view.dom.querySelectorAll('tbody tr')).map((_, index) => (
              <button
                key={index}
                className={`row-select-button ${selectedRowIndex === index ? 'selected' : ''}`}
                onClick={() => selectRow(index)}
              >
                Row {index + 1}
              </button>
            ))}
          </div>
        </div>
        
        {/* TipTap editor content */}
        <EditorContent editor={editor} className="visible-tiptap-editor" />
        
        <div className="editor-info">
          <p>💡 To reorder rows: First select a row number, then use the "Move Row Up/Down" buttons</p>
          <p>📝 You can also use all the standard TipTap table features (add/remove rows and columns, etc.)</p>
        </div>
      </div>
    </div>
  );
};

export default TableEditor;