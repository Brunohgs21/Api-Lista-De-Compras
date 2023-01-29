import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      purchaseList: {
        indexOfList: number;
      };
      listItem: {
        itemIndex: number;
      };
    }
  }
}
