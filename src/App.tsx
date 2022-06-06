import React, { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  const submit = () => {
    console.log(message);
  };

  return (
    <div className="App">
      <section>message : {message}</section>
      <input
        type="text"
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={submit}>submit</button>
    </div>
  );
}

export default App;
