import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const watchlistItemSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        symbol: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },
        companyName: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate symbols per user
watchlistItemSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export type WatchlistItem = InferSchemaType<typeof watchlistItemSchema>;

const WatchlistItemModel: Model<WatchlistItem> = mongoose.model<WatchlistItem>(
    "WatchlistItem",
    watchlistItemSchema
);

export default WatchlistItemModel;