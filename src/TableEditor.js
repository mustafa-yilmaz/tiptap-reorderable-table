// TableEditor.js
import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TableExtensions } from "./ReorderableTableExtension";
import "./TableEditor.css";

const TableEditor = () => {
  const editor = useEditor({
    extensions: TableExtensions,
    content: `
      <h3>TipTap Editor with Enhanced Table</h3>
      <p>This is a fully editable rich text editor with a reorderable table.</p>
      <p>The table below maintains all of TipTap's built-in features while adding row reordering.</p>

      <table>
        <tr>
          <th>Header 1</th>
          <th>Header 2</th>
          <th>Header 3</th>
        </tr>
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
      </table>

      <p>Try these features:</p>
      <ul>
        <li>Use toolbar buttons to reorder rows</li>
        <li>Format text within cells</li>
        <li>Resize columns by dragging borders</li>
        <li>Insert and delete rows and columns</li>
      </ul>
    `,
    editable: true,
  });
  
  // Reference to observe table elements
  const editorRef = useRef(null);

  // Function to add row controls to tables
  const addRowControls = () => {
    if (!editor || !editor.view || !editorRef.current) return;

    // Get all table rows
    const rows = editorRef.current.querySelectorAll('table tr');
    
    rows.forEach((row, index) => {
      // Skip if this row already has controls or is a header row
      if (row.querySelector('.row-controls') || row.parentElement.tagName === 'THEAD') return;
      
      // Find the position of this row in the document
      const pos = editor.view.posAtDOM(row, 0);
      if (pos === -1) return;
      
      // Create row control buttons
      const controlsEl = document.createElement('div');
      controlsEl.className = 'row-controls';
      
      // Up button
      const upButton = document.createElement('button');
      upButton.innerHTML = '↑';
      upButton.className = 'row-control up';
      upButton.title = 'Move row up';
      upButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        editor.chain().focus().moveRowUp(pos).run();
      };
      
      // Down button
      const downButton = document.createElement('button');
      downButton.innerHTML = '↓';
      downButton.className = 'row-control down';
      downButton.title = 'Move row down';
      downButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        editor.chain().focus().moveRowDown(pos).run();
      };
      
      controlsEl.appendChild(upButton);
      controlsEl.appendChild(downButton);
      
      // Add controls to the row
      row.appendChild(controlsEl);
    });
  };

  // Add standard table operations
  const addTableButtons = () => {
    return (
      <div className="table-buttons">
        <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
          Insert Table
        </button>
        <button onClick={() => editor.chain().focus().addColumnBefore().run()}>
          Add Column Before
        </button>
        <button onClick={() => editor.chain().focus().addColumnAfter().run()}>
          Add Column After
        </button>
        <button onClick={() => editor.chain().focus().addRowBefore().run()}>
          Add Row Before
        </button>
        <button onClick={() => editor.chain().focus().addRowAfter().run()}>
          Add Row After
        </button>
        <button onClick={() => editor.chain().focus().deleteColumn().run()}>
          Delete Column
        </button>
        <button onClick={() => editor.chain().focus().deleteRow().run()}>
          Delete Row
        </button>
        <button onClick={() => editor.chain().focus().deleteTable().run()}>
          Delete Table
        </button>
      </div>
    );
  };

  // Initialize and update row controls
  useEffect(() => {
    if (!editor) return;
    
    editorRef.current = editor.view.dom;
    
    // Add row controls initially
    addRowControls();
    
    // Add row controls when content changes
    const handler = () => {
      setTimeout(addRowControls, 50);
    };
    
    editor.on('update', handler);
    
    return () => {
      editor.off('update', handler);
    };
  }, [editor]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="editor-container">
      <div className="visible-tiptap-container">
        <h2>TipTap Editor with Enhanced Reorderable Table</h2>
        
        <div className="editor-menu">
          <button 
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            Bold
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            Italic
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          >
            Heading
          </button>
        </div>
        
        {addTableButtons()}
        
        <EditorContent editor={editor} className="visible-tiptap-editor" />
        
        <div className="editor-info">
          <p>↕️ Use the arrow buttons at the end of each row to reorder rows</p>
          <p>💡 This table has all standard TipTap features plus row reordering!</p>
        </div>
      </div>
    </div>
  );
};

export default TableEditor;