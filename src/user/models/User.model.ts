import * as mongoose from "mongoose";
import { Role } from "../enum/Role";
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    roles: { type: [String], default: [Role.User] },
});

export const User = mongoose.model("User", userSchema);
