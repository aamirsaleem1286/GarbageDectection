import { NextRequest, NextResponse } from "next/server";

import { connect } from "@/database/db";
import User from "@/models/users.model";
import { Error } from "@/types/ErrorTypes";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody;
        const user = await User.findOne({ token });

        if (!user) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        // You may want to add additional checks here, depending on your application logic

        // Mark the user as verified (or whatever other logic you need)
        user.isVerified = true;
        await user.save();

        return NextResponse.json({
            message: "User verified successfully",
            success: true,
        });
    } catch (error: unknown) {
        const Error = error as Error;
        return NextResponse.json({ error: Error.message }, { status: 500 });
    }
}
