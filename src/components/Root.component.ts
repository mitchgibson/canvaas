import { Button, Component, Container, Inject, RouterSlot } from "pig-fwk";
import { SocketService } from "../services/Socket.service";
import { v4 as geneateUuid } from "uuid";
import { useSync } from "../hooks/sync/Sync.hook";
import { useHtml } from "../hooks/sync/Html.hook";
import { ElementAdd } from "../domain/sync/types";

export class RootComponent extends Container {
  private socket = Inject(SocketService).getSocket();

  private canvas = new Component().cssClass(["rounded-xl", "border", "border-dashed", "w-[800px]", "h-[530px]"]);
  private canvasInner = new Component().cssClass(["w-full", "h-full", "relative"]);

  private send = new Button().content("Send").click(() => {
    const element: ElementAdd = {
      attributes: {
        id: geneateUuid(),
      },
      tagName: "button",
      content: "Hello, world!",
      cssClass: ["border", "border-emerald-400", "text-emerald-400", "rounded-lg", "px-4", "py-2", "m-2", "hover:bg-neutral-900"],
    };

    useHtml(this.canvasInner, this.socket).add(element);
    this.socket.emit("canvas_update", {
      html: {
        add: {
          element: element,
        }
      },
    });
  });

  constructor() {
    super();
    this.fillScreen();
    this.cssClass(["bg-neutral-800", "text-emerald-400"]);
    this.children([this.headerSlot(), this.contentLayout()]);
    this.canvas.children([this.canvasInner]);

    this.socket.on("canvas_sync", (data) => {
      const { canvas } = useSync(this.socket);
      canvas(this.canvasInner, data);
    });
  }

  private headerSlot(): RouterSlot {
    return new RouterSlot("header");
  }

  private contentLayout(): Container {
    return new Container()
      .flexGrow()
      .itemsCenter()
      .justifyCenter()
      .cssClass(["py-4", "overflow-hidden"])
      .children([new Container().col().flexGrow().fillWidth().itemsCenter().cssClass(["overflow-auto", "gap-y-12"]).children([this.canvas, this.send])]);
  }
}
