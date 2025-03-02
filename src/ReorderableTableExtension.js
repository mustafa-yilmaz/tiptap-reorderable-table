// ReorderableTableExtension.js
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { Extension } from "@tiptap/core";

// Create an extension to add the reordering functionality to TipTap's tables
const TableReordering = Extension.create({
  name: 'tableReordering',

  // Add commands that we can call from the editor
  addCommands() {
    return {
      moveRowUp: (pos) => ({ tr, dispatch, state }) => {
        // Find the table node and get its position
        const { doc } = state;
        const resolvedPos = state.doc.resolve(pos);
        const tablePos = resolvedPos.before(1);
        const table = doc.nodeAt(tablePos);
        
        if (!table || table.type.name !== 'table') return false;
        
        // Find the current row position
        const rowPos = resolvedPos.before(2);
        const index = state.doc.resolve(rowPos).index(resolvedPos.depth - 1);
        
        if (index <= 0) return false; // Can't move first row up
        
        // Move the row up by reordering the rows
        if (dispatch) {
          const rows = table.content.content;
          const newRows = Array.from(rows);
          const temp = newRows[index];
          newRows[index] = newRows[index - 1];
          newRows[index - 1] = temp;
          
          // Create a new table with the reordered rows
          const newTable = table.type.create(table.attrs, newRows);
          
          // Replace the old table with the new one
          tr.replaceWith(tablePos, tablePos + table.nodeSize, newTable);
          dispatch(tr);
        }
        
        return true;
      },
      
      moveRowDown: (pos) => ({ tr, dispatch, state }) => {
        // Find the table node and get its position
        const { doc } = state;
        const resolvedPos = state.doc.resolve(pos);
        const tablePos = resolvedPos.before(1);
        const table = doc.nodeAt(tablePos);
        
        if (!table || table.type.name !== 'table') return false;
        
        // Find the current row position
        const rowPos = resolvedPos.before(2);
        const index = state.doc.resolve(rowPos).index(resolvedPos.depth - 1);
        
        if (index >= table.content.childCount - 1) return false; // Can't move last row down
        
        // Move the row down by reordering the rows
        if (dispatch) {
          const rows = table.content.content;
          const newRows = Array.from(rows);
          const temp = newRows[index];
          newRows[index] = newRows[index + 1];
          newRows[index + 1] = temp;
          
          // Create a new table with the reordered rows
          const newTable = table.type.create(table.attrs, newRows);
          
          // Replace the old table with the new one
          tr.replaceWith(tablePos, tablePos + table.nodeSize, newTable);
          dispatch(tr);
        }
        
        return true;
      }
    };
  },
  
  // Add a button next to each row to move it up or down
  addProseMirrorPlugins() {
    return [
      {
        // This plugin adds UI controls to table rows
        props: {
          decorations: (state) => {
            // Find all tables in the document and add controls for reordering
            // This is a placeholder for the actual implementation
            return null;
          }
        }
      }
    ];
  }
});

// Export the standard TipTap table extensions with our reordering extension
export const TableExtensions = [
  StarterKit,
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: 'reorderable-table',
    },
  }),
  TableRow.configure({
    HTMLAttributes: {
      class: 'reorderable-row',
    },
  }),
  TableHeader,
  TableCell,
  TableReordering, // Our extension that adds reordering functionality
];