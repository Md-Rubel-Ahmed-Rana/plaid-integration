import ApiError from "@/middlewares/error";
import { IUser } from "./users.interface";
import { UserModel } from "./users.model";
import { HttpStatusCode } from "@/lib/httpStatus";
import { Types } from "mongoose";
import { USER_STATUS } from "./users.enum";

class Service {
  async create(data: IUser) {
    const isExist = await UserModel.findOne({
      email: data.email,
    });

    if (isExist) {
      throw new ApiError(
        HttpStatusCode.CONFLICT,
        `You already have an account. Please login to your account`
      );
    }
    const result = await UserModel.create(data);
    return result;
  }

  async getLoggedInUser(id: string) {
    const user = await UserModel.findById(id).select({ password: 0 });

    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found!");
    }

    if (user?.status === USER_STATUS.BANNED) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Your account has been banned.  You can't access your account. Please contact to support team to activate your account"
      );
    }

    return user;
  }

  async updateProfilePicture(id: string, profile_picture: string) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found!");
    }

    const result = await UserModel.findByIdAndUpdate(
      user._id,
      { profile_picture },
      { new: true }
    ).select({ password: 0 });

    // emit event to delete old image from AWS
    if (user?.profile_picture) {
      console.log("[UserService] Delete old profile picture", user?.name);
    } else {
      console.log(
        "[UserService] User has no old profile picture: ",
        user?.name
      );
    }

    return result;
  }

  async getUserByIdWithPassword(id: string | Types.ObjectId) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found");
    }
    return user;
  }

  async getUserByIdWithoutPassword(id: string | Types.ObjectId) {
    const user = await UserModel.findById(id).select({ password: 0 });
    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found");
    }
    return user;
  }

  async getUserByDynamicKeyValue(
    key: keyof IUser,
    value: string | number
  ): Promise<IUser | null> {
    return await UserModel.findOne({ [key]: value });
  }

  async getUserByEmailOrPhoneNumber(credential: string) {
    return await UserModel.findOne({
      $or: [{ phone_number: credential }, { email: credential }],
    });
  }

  async updateUserById(id: string | Types.ObjectId, data: Partial<IUser>) {
    return await UserModel.findByIdAndUpdate(id, data, { new: true }).select({
      password: 0,
    });
  }

  async deleteAccount(id: Types.ObjectId) {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found");
    }
    return { id };
  }
}

export const UserService = new Service();
