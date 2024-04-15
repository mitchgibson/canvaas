import { Button, Component, Container, Inject, RouterSlot } from "pig-fwk";
import { SocketService } from "../services/Socket.service";
import { useHtml } from "../hooks/canvas/Html.hook";
import { v4 as geneateUuid } from "uuid";

export class RootComponent extends Container {
  private socket = Inject(SocketService).getSocket();

  private canvas = new Component().cssClass(["rounded-xl", "border", "border-dashed", "w-[800px]", "h-[530px]"]);
  private canvasInner = new Component().cssClass(["w-full", "h-full", "relative"]);
  private html = useHtml(this.canvasInner, this.socket);

  private send = new Button().content("Send").click(() => {
    const element = {
      attributes: {
        id: geneateUuid(),
      },
      tagName: "button",
      content: "Hello, world!",
      cssClass: ["border", "border-emerald-400", "text-emerald-400", "rounded-lg", "px-4", "py-2", "m-2", , "hover:bg-neutral-900"],
    };

    this.html.add(element);
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
      console.log("Canvas sync", data);
      Object.keys(data).forEach((key) => {
        const processor = this[key];
        Object.keys(data[key]).forEach((action) => {
          Object.keys(data[key][action]).forEach((item) => {
            console.log("Sync", key, action, item, data[key][action][item]);
            processor[action](data[key][action][item]);
          });
        });
      });
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
