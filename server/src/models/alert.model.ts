import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const alertSchema = new Schema(
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
        metric: {
            type: String,
            enum: ["price", "percent"],
            required: true
        },
        direction: {
            type: String,
            enum: ["up", "down"],
            required: true
        },
        value: {
            type: Number,
            required: true,
            min: 0
        },
        isActive: {
            type: Boolean,
            default: true
        },
        triggeredAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export type Alert = InferSchemaType<typeof alertSchema>;

const AlertModel: Model<Alert> = mongoose.model<Alert>("Alert", alertSchema);

export default AlertModel;