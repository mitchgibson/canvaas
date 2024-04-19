enum SyncTransactionContext {
  HTML = "html",
}

enum SyncTransactionAction {
  ADD = "add",
  MOVE = "move",
  DROP = "drop",
  INPUT = "input",
}

export type ElementMove = {
  id: string;
  x: number;
  y: number;
};

export type ElementDrop = {
  id: string;
  x: number;
  y: number;
};

export type ElementAdd = {
  attributes: {
    id: string;
    [key: string]: string;
  };
  tagName: string;
  content?: string;
  cssClass?: string[];
  x?: number;
  y?: number;
};

export type ElementInput = {
  id: string;
  content: string;
};

export type SyncTransactionElement = ElementMove | ElementAdd | ElementDrop | ElementInput;

export type SyncTransactionHtmlContext = {
  [SyncTransactionContext.HTML]: {
    [SyncTransactionAction.ADD]: ElementAdd;
    [SyncTransactionAction.MOVE]: ElementMove;
    [SyncTransactionAction.DROP]: ElementDrop;
    [SyncTransactionAction.INPUT]: ElementInput;
  };
};

export type SyncTransaction = {
  [SyncTransactionContext.HTML]: SyncTransactionHtmlContext;
};
