
import { NextRequest, NextResponse } from "next/server";

function sanitizeInput(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9-]/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const { id, productName, price, quantity } = await request.json();

    const secret: any = process.env.SECRET_SERVER_KEY;
    const encodedSecret = Buffer.from(secret).toString("base64");
    const basicAuth = `Basic ${encodedSecret}`;
    console.log(basicAuth);

    const sanitizedProductName = sanitizeInput(productName);
    const sanitizedId = sanitizeInput(id.toString());

    const paymentLinkId = `${sanitizedProductName}-${sanitizedId}-${Math.floor(
      Math.random() * 10000
    )}`;

    const data = {
      transaction_details: {
        order_id: paymentLinkId,
        gross_amount: price * quantity,
        payment_link_id: paymentLinkId,
      },
      credit_card: {
        secure: true,
      },
      usage_limit: 1,
      expiry: {
        duration: 1,
        unit: "days",
      },
      item_details: [
        {
          id: id,
          name: productName,
          price: price,
          quantity: quantity,
        },
      ],
      customer_details: {
        first_name: "Highking",
        last_name: "test",
        email: "highking@example.com",
        phone: "081234567890",
      },
    };

    const requestDetails = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: basicAuth,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `https://api.sandbox.midtrans.com/v1/payment-links`,
      requestDetails
    );

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Error Details:", errorDetails);
      throw new Error("Failed to generate payment link");
    }

    const paymentLink = await response.json();
    const { payment_url: url } = paymentLink;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.error();
  }
}
