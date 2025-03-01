import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TableExtensions } from "./ReorderableTableExtension";
import "./TableEditor.css";
import Sortable from "sortablejs";

const TableEditor = () => {
  // We still use TipTap editor in the background, but don't display it
  const editor = useEditor({
    extensions: TableExtensions,
    content: `
      <table>
        <tbody>
          <tr><td>Row 1, Col 1</td><td>Row 1, Col 2</td></tr>
          <tr><td>Row 2, Col 1</td><td>Row 2, Col 2</td></tr>
          <tr><td>Row 3, Col 1</td><td>Row 3, Col 2</td></tr>
        </tbody>
      </table>
    `,
    onUpdate: ({ editor }) => {
      // When the editor content changes, update our representation of the table
      updateTableData();
    }
  });

  // State to track table data
  const [tableData, setTableData] = useState([
    ["Row 1, Col 1", "Row 1, Col 2"],
    ["Row 2, Col 1", "Row 2, Col 2"],
    ["Row 3, Col 1", "Row 3, Col 2"]
  ]);

  // Reference to the drag container
  const dragContainerRef = useRef(null);
  const hiddenEditorRef = useRef(null);
  
  // Extract table data from the editor
  const updateTableData = () => {
    if (!editor) return;
    
    try {
      const dom = new DOMParser().parseFromString(
        editor.getHTML(),
        'text/html'
      );
      
      const rows = dom.querySelectorAll('tbody tr');
      const newData = [];
      
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = [];
        
        cells.forEach(cell => {
          rowData.push(cell.innerHTML);
        });
        
        if (rowData.length > 0) {
          newData.push(rowData);
        }
      });
      
      if (newData.length > 0) {
        setTableData(newData);
      }
    } catch (error) {
      console.error("Error extracting table data:", error);
    }
  };
  
  // Apply table data back to the editor
  const applyTableDataToEditor = () => {
    if (!editor) return;
    
    const tableHtml = `
      <table>
        <tbody>
          ${tableData.map(row => `
            <tr>
              ${row.map(cell => `<td>${cell}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    editor.commands.setContent(tableHtml);
  };
  
  // Initialize Sortable when component mounts
  useEffect(() => {
    if (!dragContainerRef.current) return;
    
    const sortable = new Sortable(dragContainerRef.current, {
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      onEnd: (evt) => {
        // Update tableData after row reordering
        const newData = [...tableData];
        const [movedItem] = newData.splice(evt.oldIndex, 1);
        newData.splice(evt.newIndex, 0, movedItem);
        setTableData(newData);
        
        // Apply changes to the editor
        setTimeout(() => {
          applyTableDataToEditor();
        }, 50);
      }
    });
    
    return () => {
      sortable.destroy();
    };
  }, [tableData]);
  
  // Extract table data from editor when it's ready
  useEffect(() => {
    if (editor) {
      updateTableData();
    }
  }, [editor]);

  return (
    <div className="editor-container">
      {/* Hidden TipTap editor - we keep this for data management but don't display it */}
      <div className="hidden-editor" ref={hiddenEditorRef}>
        <EditorContent editor={editor} />
      </div>
      
      {/* Only the draggable representation is shown */}
      <div className="reorderable-table-container">
        <h2>Sample Table</h2>
        <div className="table-container">
          <div className="reorderable-table">
            <div className="reorderable-rows" ref={dragContainerRef}>
              {tableData.map((row, rowIndex) => (
                <div key={rowIndex} className="reorderable-row">
                  <div className="drag-handle">⋮⋮</div>
                  <div className="row-content">
                    {row.map((cell, cellIndex) => (
                      <div 
                        key={cellIndex} 
                        className="cell" 
                        contentEditable={true}
                        dangerouslySetInnerHTML={{ __html: cell }}
                        onBlur={(e) => {
                          // Update the cell content when it's edited
                          const newData = [...tableData];
                          newData[rowIndex][cellIndex] = e.target.innerHTML;
                          setTableData(newData);
                          applyTableDataToEditor();
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableEditor;