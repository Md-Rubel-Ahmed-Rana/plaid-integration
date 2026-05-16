import BaseController from "@/shared/baseController";
import { Request, Response } from "express";
import { UserService } from "./users.service";
import { HttpStatusCode } from "@/lib/httpStatus";
import { Types } from "mongoose";

class Controller extends BaseController {
  getLoggedInUser = this.catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.getLoggedInUser(req?.user?.id);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Authenticated user retrieved successfully",
      data: user,
    });
  });

  updateProfilePicture = this.catchAsync(
    async (req: Request, res: Response) => {
      const result = await UserService.updateProfilePicture(
        req?.params?.id,
        req.body.profile_picture
      );
      this.sendResponse(res, {
        statusCode: HttpStatusCode.OK,
        success: true,
        message: "User profile picture has been updated successfully",
        data: result,
      });
    }
  );

  updateUser = this.catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.updateUserById(req?.params?.id, req.body);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "User has been updated successfully",
      data: result,
    });
  });

  deleteAccount = this.catchAsync(async (req: Request, res: Response) => {
    const id = req?.params?.id as unknown as Types.ObjectId;
    const result = await UserService.deleteAccount(id);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "User has been deleted successfully",
      data: result,
    });
  });
}

export const UserController = new Controller();
