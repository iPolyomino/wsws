import React, { useState } from "react";
import { Button, Flex, Input } from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
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
  const [ws, setWs] = useState<WebSocket | null>(null);

  const connect = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (ws !== null) {
      ws.close();
      return;
    }

    const client = new WebSocket(address);

    client.addEventListener("open", () => {
      console.log("connected");
      setWs(client);
    });
    client.addEventListener("close", () => {
      console.log("disconnected");
      setWs(null);
    });
    client.addEventListener("error", (e) => {
      console.error(e);
      setWs(null);
    });
  };

  ws?.addEventListener("message", (msg) => {
    setDialog([...dialog, { type: "receive", message: msg.data }]);
  });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message === "") return;
    if (ws?.readyState === ReadyState.Open) {
      ws?.send(message);
      setDialog([...dialog, { type: "send", message: message }]);
      setMessage("");
    }
  };

  const buttonMessage = ["Connecting", "Close", "Closing", "Connect"];

  return (
    <div className="App">
      <form onSubmit={connect}>
        <Flex m={4}>
          <Input
            type="text"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            bgColor={ws?.readyState === ReadyState.Open ? "green" : ""}
            isDisabled={(ws?.readyState || 3) <= 2}
          />
          <Button type="submit">{buttonMessage[ws?.readyState || 3]}</Button>
        </Flex>
      </form>
      <section>
        {dialog.map((data, i) => (
          <p key={i}>
            {data.type === "send" && <ArrowUpIcon />}
            {data.type === "receive" && <ArrowDownIcon />}
            {data.message}
          </p>
        ))}
      </section>

      <form onSubmit={submit}>
        <Flex m={4} rounded="md" pos="fixed" right="0" bottom="0" left="0">
          <Input
            type="text"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit">Submit</Button>
        </Flex>
      </form>
    </div>
  );
}

export default App;
