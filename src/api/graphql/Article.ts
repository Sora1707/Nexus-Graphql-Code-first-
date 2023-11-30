import { extendType, list, nonNull, objectType } from "nexus";
import { Article as ArticleModel } from "../../user/models/Article.model";
import { ArticleDocument } from "../../user/interfaces/ArticleDocument";
import { User as UserModel } from "../../user/models/User.model";
import { User } from "./User";

export const Article = objectType({
    name: "Article",
    definition(t) {
        t.id("id");
        t.string("content");
        t.field("author", {
            type: User,
            async resolve(parent: ArticleDocument) {
                const authorId = parent.authorId;
                const user = await UserModel.findById(authorId);
                return user?.toObject();
            },
        });
    },
});

export const ArticleQuery = extendType({
    type: "Query",
    definition(t) {
        t.field("articles", {
            type: nonNull(list(Article)),
            async resolve() {
                const articles = await ArticleModel.find();
                return articles;
            },
        });
    },
});
