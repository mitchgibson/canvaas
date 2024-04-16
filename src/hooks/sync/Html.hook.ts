import { Component } from "pig-fwk";
import { ElementAdd, ElementMove } from "../../domain/sync/types";
import { Socket } from "socket.io-client";

export function useHtml(canvas: Component, socket: Socket) {
  function add(element: ElementAdd) {
    const component = new Component(element.tagName).content(element.content || "");
    Object.keys(element.attributes).forEach((key) => {
      component.attribute(key, element.attributes[key]);
    });
    component.cssClass(element.cssClass || []);
    component.cssClass(["absolute", "cursor-move", "select-none"]);
    component.attribute("draggable", "true");

    let offsetX, offsetY;

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

      socket.emit("canvas_update", {
        event: "canvas_update__drop",
        data: {
          html: {
            move: {
              element: {
                id: element.attributes.id,
                x: x,
                y: y,
              },
            },
          },
        },
      });
    });

    component.event("drag", (context, event) => {
      const x = event.clientX - offsetX - canvas.getElement().getBoundingClientRect().left;
      const y = event.clientY - offsetY - canvas.getElement().getBoundingClientRect().top;
      component.style("left", `${x}px`);
      component.style("top", `${y}px`);

      socket.emit("canvas_update", {
        event: "canvas_update__move",
        data: {
          html: {
            move: {
              element: {
                id: element.attributes.id,
                x: x,
                y: y,
              },
            },
          },
        },
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

  return {
    add,
    move,
  };
}
