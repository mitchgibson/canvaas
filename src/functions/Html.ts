import { Component } from "pig-fwk";
import { ElementAdd, ElementInput, ElementMove } from "../domain/sync/types";
import { Socket } from "socket.io-client";
import { useEmit } from "./emit/Emit";

export function useHtml(canvas: Component, socket: Socket) {
  function add(element: ElementAdd) {
    const span = new Component("span").content("Hello, world!");
    const component = new Component(element.tagName).children([span]);

    Object.keys(element.attributes).forEach((key) => {
      component.attribute(key, element.attributes[key]);
    });
    component.cssClass(element.cssClass || []);
    component.cssClass(["absolute"]);

    let offsetX, offsetY;

    component.event("blur", (context, event) => {
      component.removeCssClass("cursor-move");
      component.attribute("draggable", "false");
    });

    span.event("blur", (context, event) => {
      span.attribute("contenteditable", "false");
    });

    component.event("input", (context, event) => {
      console.log("input");
      let value = span.getElement().innerText;
      useEmit(socket).input({
        id: element.attributes.id,
        content: value,
      });
    });

    component.event("click", (context, event) => {
      component.cssClass(["cursor-move"]);
      component.attribute("draggable", "true");

      if(event.shiftKey) {
        span.attribute("contenteditable", "true");
        span.getElement().focus();
      }
    });

    component.event("dragstart", (context, event) => {
      offsetX = event.clientX - component.getElement().getBoundingClientRect().left;
      offsetY = event.clientY - component.getElement().getBoundingClientRect().top;
      event.dataTransfer.setDragImage(new Image(), 0, 0);
    });

    component.event("dragend", (context, event) => {
      const x = event.clientX - offsetX - canvas.getElement().getBoundingClientRect().left;
      const y = event.clientY - offsetY - canvas.getElement().getBoundingClientRect().top;
      component.style("left", `${x}px`);
      component.style("top", `${y}px`);

      useEmit(socket).drop({
        id: element.attributes.id,
        x: x,
        y: y,
      });
    });

    component.event("drag", (context, event) => {
      const x = event.clientX - offsetX - canvas.getElement().getBoundingClientRect().left;
      const y = event.clientY - offsetY - canvas.getElement().getBoundingClientRect().top;
      component.style("left", `${x}px`);
      component.style("top", `${y}px`);

      useEmit(socket).move({
        id: element.attributes.id,
        x: x,
        y: y,
      });
    });

    component.event("dragover", (context, event) => {
      event.preventDefault(); // Necessary to allow drop
    });

    canvas.insertChild(component);
  }

  function move(element: ElementMove) {
    const component = canvas.findComponentByAttribute("id", element.id);
    component?.style("left", `${element.x}px`);
    component?.style("top", `${element.y}px`);
  }

  function input(element: ElementInput) {
    const component = canvas.findComponentByAttribute("id", element.id);
    component?.getChildren()[0]?.content(element.content || "");
  }

  return {
    add,
    move,
    input,
  };
}
