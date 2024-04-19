import { Component, Container, Inject, RouterSlot } from "pig-fwk";
import { SocketService } from "../services/Socket.service";
import { useSync } from "../functions/sync/Sync";
import { Canvaas } from "./Canvaas.component";

export class RootComponent extends Container {
  private socket = Inject(SocketService).getSocket();
  private canvas = new Canvaas();
  private canvasInner = this.canvas.getCanvasInner();

  private console = new Container().fill().col()
  .cssClass(["bg-neutral-900", "overflow-auto", "rounded-xl", "overflow-auto", "p-2"])

  private consoleContainer = new Container().row().cssClass(["w-[800px]", "flex", "h-[300px]", "rounded-xl", "border", "border-dashed", "border-emerald-400", "overflow-hidden"]).children([this.console]);

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
      .cssClass(["py-4", "overflow-hidden", "gap-y-4"])
      .children([
        new Container()
          .col()
          .fillWidth()
          .itemsCenter()
          .cssClass(["overflow-auto"])
          .children([this.canvas, new Container().row().cssClass(["max-w-[800px]"]).fillWidth().justifyEnd()])
          .cssClass(["px-2"]),
        this.consoleContainer,
      ]);
  }
}
