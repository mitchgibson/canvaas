import { Button, Component, Container, Inject, RouterSlot } from "pig-fwk";
import { SocketService } from "../services/Socket.service";
import { v4 as geneateUuid } from "uuid";
import { useSync } from "../functions/sync/Sync";
import { useHtml } from "../functions/Html";
import { ElementAdd } from "../domain/sync/types";
import { useEmit } from "../functions/emit/Emit";

export class RootComponent extends Container {
  private socket = Inject(SocketService).getSocket();

  private canvas = new Component().cssClass(["rounded-xl", "border", "border-dashed", "w-[800px]", "h-[530px]"]);
  private canvasInner = new Component().cssClass(["w-full", "h-full", "relative"]);

  private console = new Container().fill().col()
  .cssClass(["bg-neutral-900", "overflow-auto", "rounded-xl", "overflow-auto", "p-2"])

  private consoleContainer = new Container().row().cssClass(["w-[800px]", "flex", "h-[300px]", "rounded-xl", "border", "border-dashed", "border-emerald-400", "overflow-hidden"]).children([this.console]);

  private insertButton = new Button()
    .cssClass(["py-2", "px-4", "my-4", "border", "border-emerald-400", "rounded-lg", "hover:bg-neutral-700"])
    .content("Button")
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
      useEmit(this.socket).add({
        attributes: element.attributes,
        tagName: element.tagName,
        content: element.content,
        cssClass: element.cssClass,
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

    this.socket.on("console_log", (data) => {
      this.console.insertChild(new Component().content(data.message).cssClass(["text-emerald-400"]));
      this.console.getElement().scrollTop = this.console.getElement().scrollHeight;
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
          .children([this.canvas, new Container().row().cssClass(["max-w-[800px]"]).fillWidth().justifyEnd().children([this.insertButton])])
          .cssClass(["px-2"]),
        this.consoleContainer,
      ]);
  }
}
