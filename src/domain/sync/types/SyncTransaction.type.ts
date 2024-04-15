
enum SyncTransactionContext {
    HTML = 'html'
}

enum SyncTransactionAction {
    ADD = 'add',
    MOVE = 'move'
}

export type ElementMove = {
    id: string,
    x: number,
    y: number
};

export type ElementAdd = {
    attributes: {
        id: string
        [key: string]: string
    },
    tagName: string,
    content?: string,
    cssClass?: string[]
};

export type SyncTransactionElement = ElementMove | ElementAdd;

export type SyncTransactionHtmlContext = {
    [SyncTransactionContext.HTML]: {
        [SyncTransactionAction.ADD]: ElementAdd,
        [SyncTransactionAction.MOVE]: ElementMove
    }
}

export type SyncTransaction = {
    [SyncTransactionContext.HTML]: SyncTransactionHtmlContext
};