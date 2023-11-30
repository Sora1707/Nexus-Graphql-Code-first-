import * as mongoose from "mongoose";

export interface ArticleDocument extends mongoose.Document {
    id: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;
    content: string;
}
