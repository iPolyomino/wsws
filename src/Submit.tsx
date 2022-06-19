import React, { useState } from "react";
import { Button, Flex, Input } from "@chakra-ui/react";

import Dialog from "./Dialog";
import { ReadyState } from "./ReadyState";
import { WsData } from "./Data";

function Submit({ ws }: { ws: WebSocket | null }) {
  const [message, setMessage] = useState("");
  const [dialog, setDialog] = useState<WsData[]>([]);

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

  return (
    <>
      <Dialog dialog={dialog} />
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
    </>
  );
}

export default Submit;
