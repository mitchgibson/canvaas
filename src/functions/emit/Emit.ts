import { Socket } from "socket.io-client";
import { ElementAdd, ElementDrop, ElementInput, ElementMove } from "../../domain/sync/types";

export function useEmit(socket: Socket) {
  function move(element: ElementMove) {
    socket.emit("canvas_update", {
      event: "canvas_update__move",
      data: {
        html: {
          move: {
            element: element,
          },
        },
      },
    });
  }

  function drop(element: ElementDrop) {
    socket.emit("canvas_update", {
      event: "canvas_update__drop",
      data: {
        html: {
          drop: {
            element: element,
          },
        },
      },
    });
  }

  function input(element: ElementInput) {
    socket.emit("canvas_update", {
      event: "canvas_update__input",
      data: {
        html: {
          input: {
            element: element,
          },
        },
      },
    });
  }

  function add(element: ElementAdd) {
    socket.emit("canvas_update", {
      event: "canvas_update__create",
      data: {
        html: {
          add: {
            element: element,
          },
        },
      },
    });
  }

  return {
    move,
    drop,
    add,
    input,
  };
}
