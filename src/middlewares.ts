import { Request, Response, NextFunction } from "express";
import { allLists } from "./database";

export const ensureListExists = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const purchaseListId: number = parseInt(request.params.purchaseListId);

  const indexOfList = allLists.findIndex(
    (el) => el.purchaseListId === purchaseListId
  );

  if (indexOfList === -1) {
    return response.status(404).json({
      message: `List with Id ${purchaseListId} does not exist!`,
    });
  }

  request.purchaseList = {
    indexOfList,
  };
  return next();
};

export const ensureItemExists = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const itemName: string = request.params.itemName;

  const indexOfList: number = request.purchaseList.indexOfList;
  const list = allLists[indexOfList];
  const items = list.data;
  const itemIndex = items.findIndex((el) => el.name === itemName);

  if (itemIndex === -1) {
    return response.status(404).json({
      message: `Item with name ${itemName} doest not exist!`,
    });
  }

  request.listItem = {
    itemIndex,
  };

  return next();
};
