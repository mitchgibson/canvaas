import { Component, Inject } from "pig-fwk";
import { InsertMenu } from "./InsertMenu.component";
import { SocketService } from "../services/Socket.service";

export class Canvaas extends Component {
    private socketService: SocketService = Inject(SocketService);
    private canvasInner = new Component();
    private menu = new InsertMenu(this.canvasInner, this.socketService.getSocket());

    constructor() {
        super();
        this.css();
        this.build();
        this.setup();
    }

    private css() {
        this.cssClass(["p-2", "rounded-xl", "border", "border-dashed", "w-[800px]", "h-[530px]"]);
        this.canvasInner.cssClass(["w-full", "h-full", "relative"]);
        this.menu.cssClass(["absolute", "top-0", "left-0", "z-100"]);
    }

    private build() {
        this.children([this.canvasInner]);
    }

    private setup() {
        this.event("contextmenu", (context, event) => {
            event.preventDefault();
            this.menu.attribute("style", `top: ${event.clientY}px; left: ${event.clientX}px;`);
            this.menu.setDropPosition(event.offsetX, event.offsetY);
            this.insertChild(this.menu);
        });
        this.menu.event("click", (context, event) => {
            this.removeChild(this.menu);
        });
    }

    public getCanvasInner() {
        return this.canvasInner;
    }
}