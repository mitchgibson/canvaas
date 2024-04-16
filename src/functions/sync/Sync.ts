import { Socket } from "socket.io-client";
import { useHtml } from "../Html";
import { Component } from "pig-fwk";
import { SyncTransactionHtmlContext } from "../../domain/sync/types";

export function useSync(socket: Socket) {

    function canvas(host: Component, data: SyncTransactionHtmlContext) {
        const handler = useHtml(host, socket);

        Object.keys(data).forEach((key) => {
          Object.keys(data[key]).forEach((action) => {
            Object.keys(data[key][action]).forEach((item) => {
              handler[action](data[key][action][item]);
            });
          });
        });
    }

    return {
        canvas
    };
}