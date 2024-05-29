import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { connect } from "@/database/db";
import { HTTP_STATUS } from "@/enums/enums";
import User from "@/models/users.model";
import { Error } from "@/types/ErrorTypes";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password, city, state } = reqBody;

        console.log(reqBody);

        // Check if user already exists
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (city.length === 0) {
            return NextResponse.json({ error: "Please provide a valid city", success: false }, { status: HTTP_STATUS.BAD_REQUEST });
        }
        if (state.length === 0) {
            return NextResponse.json({ error: "Please provide a valid state", success: false }, { status: HTTP_STATUS.BAD_REQUEST });
        }
        if (city === "select city") {
            return NextResponse.json({ error: "Please provide a valid city", success: false }, { status: HTTP_STATUS.BAD_REQUEST });
        }
        if (state === "Select State") {
            return NextResponse.json({ error: "Please provide a valid state", success: false }, { status: HTTP_STATUS.BAD_REQUEST });
        }
        if (user) {
            return NextResponse.json({ error: "User already exists", success: false }, { status: HTTP_STATUS.BAD_REQUEST });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create a new user
        const newUser = new User({
            username,
            email,
            state,
            city,
            password: hashedPassword,
        });

        // Save the user to the database
        const savedUser = await newUser.save();
        console.log(savedUser);

        return NextResponse.json(
            {
                message: "User registered successfully",
                success: true,
            },
            {
                status: HTTP_STATUS.CREATED,
            },
        );
    } catch (error: unknown) {
        const Error = error as Error;
        return NextResponse.json({ error: Error.message }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
    }
}
