import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const notificationSchema = new Schema(
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
        title: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ["alert_triggered"],
            default: "alert_triggered"
        },
        isRead: {
            type: Boolean,
            default: false
        },
        emailSent: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export type Notification = InferSchemaType<typeof notificationSchema>;

const NotificationModel: Model<Notification> = mongoose.model<Notification>(
    "Notification",
    notificationSchema
);

export default NotificationModel;