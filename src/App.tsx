import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import "./App.css";

export enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

function App() {
  const [message, setMessage] = useState("");
  const [dialog, setDialog] = useState<string[]>([]);
  const wsRef = useRef<WebSocket>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message === "") return;
    if (wsRef.current?.readyState === ReadyState.Open) {
      wsRef.current?.send(message);
      setDialog([...dialog, `send: ${message}`]);
      setMessage("");
    }
  };

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8888/ws");
    wsRef.current.addEventListener("open", () => {});
    return () => {
      wsRef.current?.addEventListener("close", () => {});
    };
  }, []);

  wsRef.current?.addEventListener("message", (msg) => {
    setDialog([...dialog, `receive: ${msg.data}`]);
  });

  return (
    <div className="App">
      <section>status : {wsRef.current?.readyState}</section>
      <section>
        {dialog.map((d, i) => (
          <p key={i}>{d}</p>
        ))}
      </section>

      <Box
        bg="white"
        m={4}
        rounded="md"
        pos="fixed"
        right="0"
        bottom="0"
        left="0"
      >
        <form onSubmit={submit}>
          <InputGroup>
            <Input
              type="text"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <InputRightElement width="5.5rem">
              <Button type="submit">Submit</Button>
            </InputRightElement>
          </InputGroup>
        </form>
      </Box>
    </div>
  );
}

export default App;
