import React, { useState } from "react";
import { Button, Flex, Input } from "@chakra-ui/react";
import { ReadyState } from "./ReadyState";

function Address({ ws, setWs }: { ws: WebSocket | null; setWs: any }) {
  const [address, setAddress] = useState("");
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

  const buttonMessage = ["Connecting", "Close", "Closing", "Connect"];

  return (
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
  );
}

export default Address;
