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

  private console = new Container().fill().col()
  .cssClass(["bg-neutral-900", "overflow-auto", "rounded-xl"])

  private consoleContainer = new Container().row().cssClass(["w-[800px]", "flex", "flex-grow", "rounded-xl", "border", "border-dashed", "border-emerald-400"]).children([this.console]);

  private send = new Button()
    .cssClass(["py-2", "px-4", "my-4", "border", "border-emerald-400", "rounded-lg", "hover:bg-neutral-700"])
    .content("Send")
    .click(() => {
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
        event: 'canvas_update__create',
        data: {
          html: {
            add: {
              element: element,
            },
          },
        }
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
      canvas(this.canvasInner, data.data);
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
      .children([
        new Container()
          .col()
          .fillWidth()
          .itemsCenter()
          .cssClass(["overflow-auto"])
          .children([this.canvas, new Container().row().cssClass(["max-w-[800px]"]).fillWidth().justifyEnd().children([this.send])])
          .cssClass(["px-2"]),
        this.consoleContainer,
      ]);
  }
}
