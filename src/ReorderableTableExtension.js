// ReorderableTableExtension.js
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { Extension } from '@tiptap/core';

// Create custom table row reordering commands
const TableRowReordering = Extension.create({
  name: 'tableRowReordering',

  addCommands() {
    return {
      customMoveRowUp: () => ({ tr, state, dispatch, view }) => {
        try {
          // Find the selected row in the DOM
          const selectedRow = view.dom.querySelector('tr.row-selected');
          if (!selectedRow || !selectedRow.closest('tbody')) return false;
          
          // Get the position of this row in the DOM
          const tbodyElement = selectedRow.closest('tbody');
          const rows = Array.from(tbodyElement.querySelectorAll('tr'));
          const rowIndex = rows.indexOf(selectedRow);
          
          if (rowIndex <= 0) return false; // Can't move up the first row
          
          // Find table position in ProseMirror document
          let tablePos = null;
          let tableNode = null;
          
          state.doc.descendants((node, pos) => {
            if (tablePos !== null) return false; // Already found the table
            if (node.type.name === 'table') {
              tablePos = pos;
              tableNode = node;
              return false;
            }
          });
          
          if (!tablePos || !tableNode) return false;
          
          // Get tbody node
          const tbodyNode = tableNode.firstChild;
          if (!tbodyNode) return false;
          
          // Get the two rows to swap
          const rowToMove = tbodyNode.child(rowIndex);
          const targetRow = tbodyNode.child(rowIndex - 1);
          
          if (!rowToMove || !targetRow) return false;
          
          // Calculate positions
          let pos = tablePos + 1; // +1 for table start
          
          // Skip to the rowToMove position
          for (let i = 0; i < rowIndex; i++) {
            pos += tbodyNode.child(i).nodeSize;
          }
          
          const rowToMovePos = pos;
          const targetRowPos = rowToMovePos - targetRow.nodeSize;
          
          if (dispatch) {
            // Delete the row we want to move
            let newTr = tr.delete(rowToMovePos, rowToMovePos + rowToMove.nodeSize);
            
            // Insert it at the target position
            newTr = newTr.insert(targetRowPos, rowToMove);
            
            dispatch(newTr);
            
            // Re-apply the row selection class after DOM update
            setTimeout(() => {
              const rows = view.dom.querySelectorAll('tbody tr');
              if (rows[rowIndex - 1]) {
                const newSelectedRow = rows[rowIndex - 1];
                // Clear all selections
                view.dom.querySelectorAll('tr.row-selected').forEach(r => {
                  r.classList.remove('row-selected');
                });
                // Select the moved row
                newSelectedRow.classList.add('row-selected');
              }
            }, 10);
          }
          
          return true;
        } catch (error) {
          console.error("Error in customMoveRowUp:", error);
          return false;
        }
      },
      
      customMoveRowDown: () => ({ tr, state, dispatch, view }) => {
        try {
          // Find the selected row in the DOM
          const selectedRow = view.dom.querySelector('tr.row-selected');
          if (!selectedRow || !selectedRow.closest('tbody')) return false;
          
          // Get the position of this row in the DOM
          const tbodyElement = selectedRow.closest('tbody');
          const rows = Array.from(tbodyElement.querySelectorAll('tr'));
          const rowIndex = rows.indexOf(selectedRow);
          
          if (rowIndex === -1 || rowIndex >= rows.length - 1) return false; // Can't move down the last row
          
          // Find table position in ProseMirror document
          let tablePos = null;
          let tableNode = null;
          
          state.doc.descendants((node, pos) => {
            if (tablePos !== null) return false; // Already found the table
            if (node.type.name === 'table') {
              tablePos = pos;
              tableNode = node;
              return false;
            }
          });
          
          if (!tablePos || !tableNode) return false;
          
          // Get tbody node
          const tbodyNode = tableNode.firstChild;
          if (!tbodyNode) return false;
          
          // Get the two rows to swap
          const rowToMove = tbodyNode.child(rowIndex);
          const targetRow = tbodyNode.child(rowIndex + 1);
          
          if (!rowToMove || !targetRow) return false;
          
          // Calculate positions
          let pos = tablePos + 1; // +1 for table start
          
          // Skip to the rowToMove position
          for (let i = 0; i < rowIndex; i++) {
            pos += tbodyNode.child(i).nodeSize;
          }
          
          const rowToMovePos = pos;
          const targetRowPos = rowToMovePos + rowToMove.nodeSize;
          
          if (dispatch) {
            // Delete the row we want to move
            let newTr = tr.delete(rowToMovePos, rowToMovePos + rowToMove.nodeSize);
            
            // Insert it after the target position
            newTr = newTr.insert(targetRowPos, rowToMove);
            
            dispatch(newTr);
            
            // Re-apply the row selection class after DOM update
            setTimeout(() => {
              const rows = view.dom.querySelectorAll('tbody tr');
              if (rows[rowIndex + 1]) {
                const newSelectedRow = rows[rowIndex + 1];
                // Clear all selections
                view.dom.querySelectorAll('tr.row-selected').forEach(r => {
                  r.classList.remove('row-selected');
                });
                // Select the moved row
                newSelectedRow.classList.add('row-selected');
              }
            }, 10);
          }
          
          return true;
        } catch (error) {
          console.error("Error in customMoveRowDown:", error);
          return false;
        }
      }
    };
  }
});

// Make sure we have all the required extensions
export const TableExtensions = [
  StarterKit,
  Table.configure({
    resizable: true,
    allowTableNodeSelection: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  TableRowReordering, // Add our custom extension
];