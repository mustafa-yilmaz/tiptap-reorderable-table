import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { Extension } from "@tiptap/core";

// Create a custom extension to add special attributes to table rows
const DraggableTableRowAttributes = Extension.create({
  name: 'draggableTableRowAttributes',
  
  addGlobalAttributes() {
    return [
      {
        types: ['tableRow'],
        attributes: {
          draggable: {
            default: 'true',
            parseHTML: element => element.getAttribute('draggable') || 'true',
            renderHTML: attributes => {
              return {
                draggable: attributes.draggable,
                'data-sortable-row': 'true',
                'data-sortable-id': Math.random().toString(36).substr(2, 9) // Add a unique ID to each row
              };
            },
          },
        },
      },
    ];
  },
});

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
      class: 'sortable-row',
    },
  }),
  TableHeader,
  TableCell,
  DraggableTableRowAttributes,
];