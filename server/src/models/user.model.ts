import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

export type UserRole = "user" | "admin";

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        emailVerificationTokenHash: {
            type: String,
            default: null
        },
        emailVerificationExpiresAt: {
            type: Date,
            default: null
        },
        passwordResetTokenHash: {
            type: String,
            default: null
        },
        passwordResetExpiresAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret: any) => {
                delete ret.passwordHash;
                delete ret.emailVerificationTokenHash;
                delete ret.emailVerificationExpiresAt;
                delete ret.passwordResetTokenHash;
                delete ret.passwordResetExpiresAt;
                delete ret.__v;

                return ret;
            }
        }
    }
);

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

export type User = InferSchemaType<typeof userSchema>;

const UserModel: Model<User> = mongoose.model<User>("User", userSchema);

export default UserModel;