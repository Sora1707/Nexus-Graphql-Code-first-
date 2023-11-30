import * as jwt from "jsonwebtoken";
import { SECRET_TOKEN_KEY } from "../global/secret";
import { GraphQLError } from "graphql";

export async function context({ req, res }) {
    let loggedInUser = null;
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new GraphQLError("Unathorized", {
                extensions: { code: 401 },
            });
        }
        loggedInUser = jwt.verify(token, SECRET_TOKEN_KEY);
    } catch (error) {
    } finally {
        return {
            loggedInUser,
        };
    }
}
