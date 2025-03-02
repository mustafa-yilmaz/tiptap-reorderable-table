// TableEditor.js
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TableExtensions } from "./ReorderableTableExtension";
import "./TableEditor.css";

const TableEditor = () => {
  const editor = useEditor({
    extensions: TableExtensions,
    content: `
      <h3>TipTap Editor with Reorderable Table</h3>
      <p>This is a fully editable rich text editor with a custom reorderable table component.</p>
      <div data-type="reorderable-table"></div>
      <p>You can add text before and after the table. The table is a special component inside the editor.</p>
      <p>Use the arrow buttons to reorder rows in the table!</p>
    `,
    editable: true,
  });
  
  // Add a button to insert the reorderable table
  const addReorderableTable = () => {
    editor.chain().focus().insertContent({
      type: 'reorderableTable',
    }).run();
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="editor-container">
      <div className="visible-tiptap-container">
        <h2>TipTap Editor with Reorderable Table</h2>
        
        <div className="editor-menu">
          <button onClick={() => editor.chain().focus().toggleBold().run()}>
            Bold
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()}>
            Italic
          </button>
          <button onClick={addReorderableTable}>
            Insert Reorderable Table
          </button>
        </div>
        
        <EditorContent editor={editor} className="visible-tiptap-editor" />
        
        <div className="editor-info">
          <p>↕️ Use the arrow buttons to reorder rows in the table</p>
        </div>
      </div>
    </div>
  );
};

export default TableEditor;