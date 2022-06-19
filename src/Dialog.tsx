import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

import { WsData } from "./Data";

function Dialog({ dialog }: { dialog: WsData[] }) {
  return (
    <section>
      {dialog.map((data, i) => (
        <p key={i}>
          {data.type === "send" && <ArrowUpIcon />}
          {data.type === "receive" && <ArrowDownIcon />}
          {data.message}
        </p>
      ))}
    </section>
  );
}

export default Dialog;
