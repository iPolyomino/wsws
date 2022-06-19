import React, { useState } from "react";

import Address from "./Address";
import Submit from "./Submit";
import { ReadyState } from "./ReadyState";
import "./App.css";

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);

  return (
    <div className="App">
      <Address ws={ws} setWs={setWs} />
      <Submit ws={ws} />
    </div>
  );
}

export default App;
