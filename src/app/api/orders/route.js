import { successResponse, errorResponse } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/Order";

export async function GET() {
  try {
    await connectToDatabase();
    const session = await getCurrentSession();
    if (!session?.sub) return errorResponse("UNAUTHORIZED", "Login required", 401);

    const orders = await Order.find({ userId: session.sub }).sort({ createdAt: -1 }).lean();
    return successResponse({
      data: orders.map(o => ({
        id: String(o._id),
        transactionId: o.transactionId,
        total: o.total,
        createdAt: o.createdAt,
      }))
    });
  } catch (error) {
    return errorResponse("ORDERS_FETCH_FAILED", error.message, 500);
  }
}
