import { io } from "socket.io-client";

export class SocketService {

    private socket = io("http://localhost:3000");

    constructor() {
        this.socket.on("connect", () => {
            console.log("Connection made", this.socket.id);
          });
    }

    public getSocket() {
        return this.socket;
    }
}