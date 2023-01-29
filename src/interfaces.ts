export interface IList {
  listName: string;
  data: Array<IListItem>;
}

export interface IListItem {
  name: string;
  quantity: string;
}

export interface INewList extends IList {
  purchaseListId: number;
}

export type ItemRequired = "name" | "quantity";

export type ListRequired = "listName" | "data";
