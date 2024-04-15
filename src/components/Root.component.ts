import { Button, Component, Container, Inject, RouterSlot } from "pig-fwk";
import { SocketService } from "../services/Socket.service";

export class RootComponent extends Container {
  private socket = Inject(SocketService).getSocket();

  private canvas = new Component().cssClass(["rounded-xl", "border", "border-dashed", "w-[800px]", "h-[530px]"]);
  private canvasInner = new Component().cssClass(["w-full", "h-full", "relative"]);

  private send = new Button().content("Send").click(() => {
    console.log("Sending data");
    this.socket.emit("canvas_update", {
      html: {
        elements: [
          {
            tagName: "button",
            content: "Hello, world!",
            cssClass: ["border", "border-emerald-400", "text-emerald-400", "rounded-lg", "px-4", "py-2", "m-2", , "hover:bg-neutral-900"],
          },
        ],
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
      console.log("HTML", data.html);

      data.html.elements.forEach((element) => {
        const component = new Component(element.tagName).content(element.content);
        component.cssClass(element.cssClass);
        component.cssClass(["absolute", "cursor-move", "select-none"]);
        component.attribute("draggable", "true");

        component.event("mousedown", (context, event) => {
          console.log("Mouse down", event);
        });

        let offsetX, offsetY;

        component.event("dragstart", (context, event) => {
          offsetX = event.clientX - component.getElement().getBoundingClientRect().left;
          offsetY = event.clientY - component.getElement().getBoundingClientRect().top;
          event.dataTransfer.setDragImage(new Image(), 0, 0);
          component.style("cursor", "move"); // Set the cursor to 'move' during drag
        });

        component.event("drag", (context, event) => {
          console.log("Dragging", `${event.offsetY}px`, `${event.offsetX}px`);
          console.log(event);
          // component.style("visibility", "hidden");
          // component.style("left", `${event.offsetX}px`);

          const x = event.clientX - offsetX - this.canvasInner.getElement().getBoundingClientRect().left;
          const y = event.clientY - offsetY - this.canvasInner.getElement().getBoundingClientRect().top;
          component.style("left", `${x}px`);
          component.style("top", `${y}px`);
        });

        component.event("dragover", (context, event) => {
          event.preventDefault(); // Necessary to allow drop
        });

        component.event("dragend", (context, event) => {
          console.log("Drag end", event);
          event.preventDefault();
          // const x = event.clientX - offsetX - this.canvasInner.getElement().getBoundingClientRect().left;
          // const y = event.clientY - offsetY - this.canvasInner.getElement().getBoundingClientRect().top;
          // component.style("left", `${x}px`);
          // component.style("top", `${y}px`);
          // component.style("top", `${event.offsetY}px`);
          // component.style("left", `${event.offestX}px`);
          component.style("cursor", ""); // Reset the cursor after drag
          //component.style("visibility", "visible");
        });

        this.canvasInner.insertChild(component);
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
