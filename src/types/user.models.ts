export type UserRole = "user" | "admin" | "moderator";

export interface UserDocument extends Document {
  email: string;
  role: UserRole;
}
