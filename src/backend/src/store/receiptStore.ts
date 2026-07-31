import { Receipt } from "../models/receipt";
import * as sqliteStore from "./sqliteStore";

export const listReceipts = sqliteStore.listReceipts;
export const getReceipt = sqliteStore.getReceipt;
export const createReceipt = sqliteStore.createReceipt;
export const updateReceipt = sqliteStore.updateReceipt;
export const deleteReceipt = sqliteStore.deleteReceipt;
