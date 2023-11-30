import {
    enumType,
    extendType,
    list,
    nonNull,
    objectType,
    stringArg,
} from "nexus";
import { User as UserModel } from "../../user/models/User.model";
import { Article as ArticleModel } from "../../user/models/Article.model";
import { Article } from "./Article";
import { GraphQLError } from "graphql";
import * as jwt from "jsonwebtoken";
import { SECRET_TOKEN_KEY } from "../../global/secret";
import { Role } from "../../user/enum/Role";
import { RoleGuard } from "../../guards/roles";

const RoleEnum = enumType({
    name: "Role",
    members: [Role.Admin, Role.User],
});

export const User = objectType({
    name: "User",
    definition(t) {
        t.id("id");
        t.string("username");
        t.string("password");
        t.field("roles", { type: list(RoleEnum) });
        t.field("articles", {
            type: list(Article),
            async resolve(parent) {
                const id = parent.id;
                const articles = await ArticleModel.find();
                return articles.filter(
                    article => article.authorId?.toString() === id
                );
            },
        });
    },
});

export const UserQuery = extendType({
    type: "Query",
    definition(t) {
        t.field("users", {
            type: nonNull(list(User)),
            async resolve(_, __, contextValue) {
                const users = await UserModel.find();
                const { loggedInUser } = contextValue;

                if (!loggedInUser) {
                    throw new GraphQLError("Unathorized", {
                        extensions: { code: 401 },
                    });
                }
                if (RoleGuard([Role.Admin], loggedInUser.roles)) return users;
                return await UserModel.find({
                    username: loggedInUser.username,
                });
            },
        });

        t.string("login", {
            args: {
                username: nonNull(stringArg()),
                password: nonNull(stringArg()),
            },
            async resolve(_, { username, password }) {
                const user = await UserModel.findOne({ username });
                if (!user) {
                    throw new GraphQLError("User does not exist", {
                        extensions: { code: 401 },
                    });
                }
                if (user.password !== password) {
                    throw new GraphQLError("Wrong password", {
                        extensions: { code: 401 },
                    });
                }
                const payload = { id: user.id, username, roles: user.roles };
                const token = jwt.sign(payload, SECRET_TOKEN_KEY, {
                    expiresIn: 300,
                });

                return token;
            },
        });
    },
});

export const UserMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createUser", {
            type: User,
            args: {
                username: nonNull(stringArg()),
                password: nonNull(stringArg()),
            },
            async resolve(_, { username, password }) {
                if (await UserModel.findOne({ username })) {
                    throw new GraphQLError("Username is used", {
                        extensions: { code: 401 },
                    });
                }
                const user = new UserModel({ username, password });
                user.save();
                return user;
            },
        });
    },
});
