import { Request, Response } from "express";
import {
  IList,
  IListItem,
  INewList,
  ItemRequired,
  ListRequired,
} from "./interfaces";
import { allLists } from "./database";

const validateNewList = (payload: any): IList => {
  const keys: Array<string> = Object.keys(payload);
  const keysData: Array<string> = Object.keys(payload.data[0]);

  const requiredKeysList: Array<ListRequired> = ["listName", "data"];

  const containsAllRequired: boolean = requiredKeysList.every((key: string) => {
    return keys.includes(key);
  });

  if (!containsAllRequired) {
    throw new Error(`Required keys are: ${requiredKeysList}`);
  }

  const requiredKeysData: Array<ItemRequired> = ["name", "quantity"];

  let test = 0;
  payload.data.forEach((el: IListItem) => {
    if (
      el.name === undefined ||
      el.quantity == undefined ||
      Object.keys(el).length > 2
    ) {
      test++;
    }
  });

  const containsAllRequiredData: boolean = requiredKeysData.every(
    (key: string) => {
      return keysData.includes(key);
    }
  );

  if (!containsAllRequiredData || test > 0) {
    throw new Error(`Required keys are: ${requiredKeysData}`);
  }

  const { listName, data } = payload;
  if (typeof listName != "string") {
    throw new Error("The list name need to be a string");
  }

  return { listName, data };
};

let id: number = 0;
export const createList = (request: Request, response: Response): Response => {
  try {
    const listData: IList = validateNewList(request.body);
    id += 1;

    const newListData: INewList = {
      purchaseListId: id,
      ...listData,
    };
    allLists.push(newListData);
    return response.status(201).json(newListData);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(400).json({
        message: error.message,
      });
    }
    return response.status(500).json({
      message: "Internal server error",
    });
  }
};

export const listPurchaseLists = (
  request: Request,
  response: Response
): Response => {
  return response.json(allLists);
};

export const listPurchaseListById = (
  request: Request,
  response: Response
): Response => {
  const indexOfList: number = request.purchaseList.indexOfList;

  return response.json(allLists[indexOfList]);
};

export const patchItemByName = (
  request: Request,
  response: Response
): Response => {
  const indexOfList: number = request.purchaseList.indexOfList;
  const itemIndex: number = request.listItem.itemIndex;
  const list = allLists[indexOfList];

  const requiredKeysData: Array<ItemRequired> = ["name", "quantity"];
  const keysData: Array<string> = Object.keys(request.body);

  // const containsAllRequiredData: boolean = requiredKeysData.every(
  //   (key: string) => {
  //     return keysData.includes(key);
  //   }
  // );
  let test: boolean = true;
  keysData.forEach((item) => {
    if (item == "name") {
      test = true;
    } else if (item == "quantity") {
      test = true;
    } else test = false;
  });

  if (!test) {
    return response.status(400).json({
      message: `Updatable fields are ${requiredKeysData}`,
    });
  }

  list.data[itemIndex] = { ...list.data[itemIndex], ...request.body };
  return response.json(list.data[itemIndex]);
};
export const deleteItemFromList = (
  request: Request,
  response: Response
): Response => {
  const indexOfList: number = request.purchaseList.indexOfList;
  const itemIndex: number = request.listItem.itemIndex;
  const list = allLists[indexOfList];
  list.data.splice(itemIndex, 1);

  return response.status(204).send();
};

export const deletePurchaseList = (
  request: Request,
  response: Response
): Response => {
  const indexOfList: number = request.purchaseList.indexOfList;
  allLists.splice(indexOfList, 1);

  return response.status(204).send();
};
