import { Component, Container } from "pig-fwk";
import { ElementAdd } from "../domain/sync/types";
import { v4 as geneateUuid } from "uuid";
import { useHtml } from "../functions/Html";
import { useEmit } from "../functions/emit/Emit";
import { Socket } from "socket.io-client";

export class InsertMenu extends Container {
  private items: Component[] = [];
  public dropPosition: { x: number, y: number } = { x: 0, y: 0 };

  constructor(private canvasInner: Component, private socket: Socket) {
    super();
    this.css();
    this.build();
  }

  private css() {
    this.cssClass(["min-w-48", "bg-neutral-900", "rounded", "p-2", "border", "border-emerald-400", "z-100"]);
  }

  private build() {
    this.items = [
      buttonItem(this.canvasInner, this.socket, this),
      textItem(this.canvasInner, this.socket, this),
    ];
    this.children(this.items);
  }

  public setDropPosition(x: number, y: number) {
    this.dropPosition = { x, y };
  }
}

function buttonItem(canvasInner: Component, socket: Socket, relativeTo: InsertMenu) {
  const button = new Component().content("Button");
  itemCss(button);
  itemClick(button, canvasInner, socket, {
    attributes: {
      id: geneateUuid(),
    },
    tagName: "button",
    content: "Hello, world!",
    cssClass: ["border", "border-emerald-400", "text-emerald-400", "rounded-lg", "px-4", "py-2", "hover:bg-neutral-900"],
  }, relativeTo);

  return button;
}

function textItem(canvasInner: Component, socket: Socket, relativeTo: InsertMenu) {
  const text = new Component().content("Text");
  itemCss(text);
  itemClick(text, canvasInner, socket, {
    attributes: {
      id: geneateUuid(),
    },
    tagName: "p",
    content: "Shift-click to edit text",
    cssClass: [],
  }, relativeTo);

  return text;

}

function itemCss(component: Component): Component {
  return component.cssClass(["text-neutral-400", "text-sm", "hover:bg-neutral-700", "p-1", "cursor-pointer"]);
}

function itemClick(component: Component, canvasInner: Component, socket: Socket, instruction: ElementAdd, relativeTo: InsertMenu): Component {
  return component.event("click", () => {
    const element: ElementAdd = instruction;
    console.log(relativeTo.getElement().getBoundingClientRect());
    element.x = relativeTo.dropPosition.x;
    element.y = relativeTo.dropPosition.y;

    useHtml(canvasInner, socket).add(element);
    useEmit(socket).add({
      attributes: element.attributes,
      tagName: element.tagName,
      content: element.content,
      cssClass: element.cssClass,
      x: element.x,
      y: element.y,
    });
  });
}
