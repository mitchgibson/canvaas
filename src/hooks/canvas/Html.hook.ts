import { Component } from "pig-fwk";

export function useHtml(canvas: Component, socket: any) {
  function add(element: any) {
    const component = new Component(element.tagName).content(element.content);
    component.attribute("id", element.attributes.id);
    component.cssClass(element.cssClass);
    component.cssClass(["absolute", "cursor-move", "select-none"]);
    component.attribute("draggable", "true");

    let offsetX, offsetY;

    component.event("dragstart", (context, event) => {
      offsetX = event.clientX - component.getElement().getBoundingClientRect().left;
      offsetY = event.clientY - component.getElement().getBoundingClientRect().top;
      event.dataTransfer.setDragImage(new Image(), 0, 0);
    });

    component.event("drag", (context, event) => {
      console.log("Dragging");

      const x = event.clientX - offsetX - canvas.getElement().getBoundingClientRect().left;
      const y = event.clientY - offsetY - canvas.getElement().getBoundingClientRect().top;
      component.style("left", `${x}px`);
      component.style("top", `${y}px`);

      socket.emit("canvas_update", {
        html: {
          move: {
            element: {
              id: element.attributes.id,
              x: x,
              y: y,
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

  function move(element: any) {
    console.log("Move element", element);
    const component = canvas.findComponentByAttribute("id", element.id);
    component?.style("left", `${element.x}px`);
    component?.style("top", `${element.y}px`);
  }

  return {
    add,
    move,
  };
}
