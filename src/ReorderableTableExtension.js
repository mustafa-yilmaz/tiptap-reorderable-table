// ReorderableTableExtension.js
import StarterKit from "@tiptap/starter-kit";
import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ReorderableTableComponent from "./ReorderableTableComponent";

// Custom node for the reorderable table
const ReorderableTable = Node.create({
  name: 'reorderableTable',
  
  group: 'block',
  
  content: 'text*',
  
  parseHTML() {
    return [
      {
        tag: 'div[data-type="reorderable-table"]',
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'reorderable-table', ...HTMLAttributes }, 0];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(ReorderableTableComponent);
  },
});

export const TableExtensions = [
  StarterKit,
  ReorderableTable,
];