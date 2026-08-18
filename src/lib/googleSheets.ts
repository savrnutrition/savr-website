import { google } from "googleapis";
import type { OrderPayload } from "@/lib/orders/types";
import { getDeliveryMethod } from "@/lib/orders/deliveryMethods";

/**
 * Converts a JS Date to a Google Sheets date serial number using SA local
 * time (UTC+2). The serial is the number of days since Dec 30 1899, which
 * is what Sheets expects when you write a number to a cell with a date format.
 */
function toSheetsDateSerial(date: Date): number {
  const saMs = date.getTime() + 2 * 60 * 60 * 1000; // shift to UTC+2
  const sa = new Date(saMs);
  return (
    (Date.UTC(sa.getUTCFullYear(), sa.getUTCMonth(), sa.getUTCDate()) -
      Date.UTC(1899, 11, 30)) /
    86400000
  );
}

function getConnection(scopes: string[]) {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!clientEmail || !privateKey || !sheetId) return null;
  const auth = new google.auth.JWT({ email: clientEmail, key: privateKey, scopes });
  return { sheets: google.sheets({ version: "v4", auth }), sheetId };
}

export async function isReturningCustomer(email: string): Promise<boolean> {
  try {
    const conn = getConnection(["https://www.googleapis.com/auth/spreadsheets.readonly"]);
    if (!conn) return false;
    const res = await conn.sheets.spreadsheets.values.get({
      spreadsheetId: conn.sheetId,
      range: "Orders!E:E", // Email is column E in the new tracker layout
    });
    const needle = email.toLowerCase();
    return (res.data.values ?? []).some(
      (row) => typeof row[0] === "string" && row[0].toLowerCase() === needle
    );
  } catch {
    return false;
  }
}

/**
 * Writes one row to the Orders tab of the SAVR tracker sheet.
 *
 * New column layout (A–S, 19 columns):
 *   A  Date serial     J  Unit Price
 *   B  Order ID        K  Discount %
 *   C  Source          L  Delivery Method
 *   D  Customer Name   M  Delivery Fee
 *   E  Email           N  Total
 *   F  Phone           O  Tracking # (blank — team fills)
 *   G  Address         P  Payment
 *   H  Qty             Q  Delivery Status
 *   I  Flavour         R  Status Updated (blank)
 *                      S  Notes (blank)
 */
export async function appendOrderRow(order: OrderPayload) {
  const conn = getConnection(["https://www.googleapis.com/auth/spreadsheets"]);
  if (!conn) {
    throw new Error(
      "Google Sheets not configured — set GOOGLE_SERVICE_ACCOUNT_EMAIL, " +
        "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, GOOGLE_SHEET_ID"
    );
  }
  const { sheets, sheetId } = conn;
  const deliveryLabel = getDeliveryMethod(order.deliveryMethod)?.label ?? order.deliveryMethod;

  // Find the next empty row by counting entries in the Order ID column (B).
  // We use update() on a specific row rather than append() to avoid the
  // pre-set formulas in column N interfering with INSERT_ROWS row detection.
  const colB = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Orders!B:B",
  });
  const nextRow = (colB.data.values?.length ?? 1) + 1;

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `Orders!A${nextRow}:S${nextRow}`,
    // RAW so customer-supplied text is stored as inert strings — no formula
    // injection. The date serial in column A is treated as a number, which
    // the column's dd/mm/yyyy format then displays correctly.
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          toSheetsDateSerial(new Date(order.createdAt)), // A: Date
          order.orderId,                                  // B: Order ID
          "Website",                                      // C: Source
          `${order.customer.firstName} ${order.customer.lastName}`, // D: Name
          order.customer.email,                           // E: Email
          order.customer.phone,                           // F: Phone
          `${order.customer.street}, ${order.customer.city} ${order.customer.postal}`, // G: Address
          order.quantity,                                 // H: Qty
          "Tomato Napoletana",                            // I: Flavour
          order.unitPrice,                                // J: Unit Price
          order.discountPercent ?? 0,                     // K: Discount %
          deliveryLabel,                                  // L: Delivery Method
          order.deliveryFee,                              // M: Delivery Fee
          order.total,                                    // N: Total
          "",                                             // O: Tracking # (team fills)
          "Paid",                                         // P: Payment
          "Pending Booking",                              // Q: Delivery Status (team updates)
          "",                                             // R: Status Updated
          "",                                             // S: Notes
        ],
      ],
    },
  });
}
