import { google } from "googleapis";
import type { OrderPayload } from "@/lib/orders/types";
import { getDeliveryMethod } from "@/lib/orders/deliveryMethods";

/**
 * Appends one row per paid order to the team's shared Google Sheet using a
 * service-account. Setup (one-time, done by the team under their own
 * Google account — see README.md):
 *   1. Create a Google Cloud service account, download its JSON key.
 *   2. Share the target Sheet with the service account's email (Editor).
 *   3. Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
 *      and GOOGLE_SHEET_ID in the environment.
 */
export async function appendOrderRow(order: OrderPayload) {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !privateKey || !sheetId) {
    throw new Error(
      "Google Sheets isn't configured — set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, GOOGLE_SHEET_ID"
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const deliveryLabel = getDeliveryMethod(order.deliveryMethod)?.label ?? order.deliveryMethod;

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Orders!A:K",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          order.orderId,
          `${order.customer.firstName} ${order.customer.lastName}`,
          order.customer.email,
          `'${order.customer.phone}`,
          `${order.customer.street}, ${order.customer.city} ${order.customer.postal}`,
          order.quantity,
          deliveryLabel,
          `R${order.total}`,
          new Date(order.createdAt).toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" }),
          "Paid",
        ],
      ],
    },
  });
}
