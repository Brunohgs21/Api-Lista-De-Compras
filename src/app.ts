import express, { Application } from "express";
import {
  createList,
  deleteItemFromList,
  deletePurchaseList,
  listPurchaseListById,
  listPurchaseLists,
  patchItemByName,
} from "./logic";
import { ensureItemExists, ensureListExists } from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/purchaseList", createList);

app.get("/purchaseList", listPurchaseLists);

app.get(
  "/purchaseList/:purchaseListId",
  ensureListExists,
  listPurchaseListById
);

app.patch(
  "/purchaseList/:purchaseListId/:itemName",
  ensureListExists,
  ensureItemExists,
  patchItemByName
);

app.delete(
  "/purchaseList/:purchaseListId/:itemName",
  ensureListExists,
  ensureItemExists,
  deleteItemFromList
);

app.delete(
  "/purchaseList/:purchaseListId",
  ensureListExists,
  deletePurchaseList
);

app.listen(3000, () => {
  console.log("Server is running!!");
});
