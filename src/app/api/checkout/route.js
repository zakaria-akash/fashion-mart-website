import { errorResponse, successResponse } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { sendOrderConfirmationEmail } from "@/lib/email";

export const runtime = "nodejs";

/**
 * POST /api/checkout
 * Processes simulated payment and saves the order record.
 */
export async function POST(request) {
  try {
    await connectToDatabase();
    const session = await getCurrentSession();
    if (!session?.sub) {
      return errorResponse("UNAUTHORIZED", "Login required to checkout.", 401);
    }

    const { items, total } = await request.json();
    if (!items || items.length === 0) {
      return errorResponse("EMPTY_CART", "Your cart is empty.", 400);
    }

    const transactionId = `ch_${Math.random().toString(36).substring(7)}`;

    // Simulate Stripe payment latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Save order to DB
    const order = await Order.create({
      userId: session.sub,
      items: items.map(i => ({ productId: i.id, title: i.title, price: i.price, quantity: i.quantity, size: i.size, color: i.color })),
      total,
      transactionId,
    });

    // Send confirmation email — non-blocking: failure must not cancel the order
    try {
      const user = await User.findById(session.sub);
      if (user) {
        await sendOrderConfirmationEmail({ email: user.email, name: user.name, order });
      }
    } catch (emailError) {
      console.error("Order confirmation email failed:", emailError.message);
    }

    return successResponse({
      message: "Order placed successfully.",
      transactionId,
    });
  } catch (error) {
    return errorResponse("CHECKOUT_FAILED", error.message, 500);
  }
}
