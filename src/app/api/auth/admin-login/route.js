import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { setAuthCookie } from "@/lib/auth";
import { serverEnv } from "@/lib/env";
import { User } from "@/models/User";

export const runtime = "nodejs";

/**
 * POST /api/auth/admin-login
 * Specialized authentication for the Admin Portal.
 * Checks against hardcoded environment credentials and assigns the 'admin' role.
 */
export async function POST(request) {
  try {
    await connectToDatabase();
    const json = await request.json();
    
    // Extract and normalize inputs
    const email = typeof json?.email === "string" ? json.email.trim().toLowerCase() : "";
    const password = typeof json?.password === "string" ? json.password.trim() : "";

    if (!email || !password) {
      return errorResponse("MISSING_CREDENTIALS", "Email and password are required.", 400);
    }

    // 1. Verify against hardcoded Admin Email from .env
    const isMasterAdmin = serverEnv.adminEmails.includes(email);
    
    // 2. Verify against hardcoded Admin Password from .env
    const isPasswordCorrect = password === serverEnv.adminPassword;

    if (!isMasterAdmin || !isPasswordCorrect) {
      // Logic for debugging if needed (check if env is loaded)
      const envCheck = serverEnv.adminPassword ? "LOADED" : "MISSING";
      console.log(`Admin login attempt for ${email}. Env password status: ${envCheck}`);
      
      return errorResponse("INVALID_ADMIN_CREDENTIALS", "Invalid admin email or password.", 401);
    }

    // Attempt to find the admin user in the DB to get their actual name/ID, 
    // or fallback to a static object for the token.
    let user = await User.findOne({ email });

    const response = successResponse({
      data: {
        user: {
          id: user ? String(user._id) : "master-admin",
          name: user ? user.name : "System Admin",
          email: email,
          role: "admin",
        },
      },
    });

    // Attach high-privilege JWT session cookie
    await setAuthCookie(response, {
      id: user ? String(user._id) : "master-admin",
      name: user ? user.name : "System Admin",
      email: email,
      role: "admin",
    });

    return response;
  } catch (error) {
    return errorResponse("ADMIN_LOGIN_FAILED", error.message, 500);
  }
}
