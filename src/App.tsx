import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon, Icon } from "@chakra-ui/icons";
import "./App.css";

export enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

type WsData = {
  type: string;
  message: string;
};

function App() {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [dialog, setDialog] = useState<WsData[]>([]);
  const wsRef = useRef<WebSocket>();

  const connect = (event: React.FormEvent<HTMLButtonElement>) => {
    console.log(address);
    wsRef.current?.addEventListener("close", () => {});
    wsRef.current = new WebSocket(address);
    wsRef.current.addEventListener("open", () => {});
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message === "") return;
    if (wsRef.current?.readyState === ReadyState.Open) {
      wsRef.current?.send(message);
      setDialog([...dialog, { type: "send", message: message }]);
      setMessage("");
    }
  };

  wsRef.current?.addEventListener("message", (msg) => {
    setDialog([...dialog, { type: "receive", message: msg.data }]);
  });

  const statusColors = ["gray", "lightgreen", "orange", "red"];

  return (
    <div className="App">
      <Flex m={4}>
        <Input
          type="text"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button onClick={connect}>Connect</Button>
        <Icon
          viewBox="0 0 200 200"
          color={statusColors[wsRef.current?.readyState || 0]}
        >
          <path
            fill="currentColor"
            d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
          />
        </Icon>
      </Flex>
      <section>
        {dialog.map((data, i) => (
          <p key={i}>
            {data.type === "send" && <ArrowUpIcon />}
            {data.type === "receive" && <ArrowDownIcon />}
            {data.message}
          </p>
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
