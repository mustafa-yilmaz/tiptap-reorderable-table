import React from "react";
import "./App.css"; //** Import global styles */
import TableEditor from "./TableEditor";

function App() {
  return (
    <div className="App">
     <header className="app-header">
        <h1>Reorderable Table in TipTap</h1>
      </header>
      <TableEditor />
    </div>
  );
}

export default App;
