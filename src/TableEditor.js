// TableEditor.js
import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TableExtensions } from "./ReorderableTableExtension";
import "./TableEditor.css";

// Create a context to share the active cell editor across components
import { createContext } from "react";
export const ActiveEditorContext = createContext(null);

const TableEditor = () => {
  // Track the currently active editor (main editor or a cell editor)
  const [activeEditor, setActiveEditor] = useState(null);
  
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
    onFocus: () => {
      // When the main editor is focused, set it as active
      setActiveEditor(editor);
    }
  });
  
  // Add a button to insert the reorderable table
  const addReorderableTable = () => {
    editor.chain().focus().insertContent({
      type: 'reorderableTable',
    }).run();
  };

  // Function to handle formatting buttons
  const handleFormat = (formatCommand) => {
    if (activeEditor) {
      activeEditor.chain().focus().toggleBold().run();
    } else if (editor) {
      editor.chain().focus().toggleBold().run();
    }
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <ActiveEditorContext.Provider value={{ activeEditor, setActiveEditor }}>
      <div className="editor-container">
        <div className="visible-tiptap-container">
          <h2>TipTap Editor with Reorderable Table</h2>
          
          <div className="editor-menu">
            <button 
              onClick={() => {
                if (activeEditor) {
                  activeEditor.chain().focus().toggleBold().run();
                } else if (editor) {
                  editor.chain().focus().toggleBold().run();
                }
              }}
              className={activeEditor?.isActive('bold') ? 'is-active' : ''}
            >
              Bold
            </button>
            <button 
              onClick={() => {
                if (activeEditor) {
                  activeEditor.chain().focus().toggleItalic().run();
                } else if (editor) {
                  editor.chain().focus().toggleItalic().run();
                }
              }}
              className={activeEditor?.isActive('italic') ? 'is-active' : ''}
            >
              Italic
            </button>
            <button onClick={addReorderableTable}>
              Insert Reorderable Table
            </button>
          </div>
          
          <EditorContent editor={editor} className="visible-tiptap-editor" />
          
          <div className="editor-info">
            <p>↕️ Use the arrow buttons to reorder rows in the table</p>
            <p>💡 Select text in any cell and use the Bold/Italic buttons to format it</p>
          </div>
        </div>
      </div>
    </ActiveEditorContext.Provider>
  );
};

export default TableEditor;