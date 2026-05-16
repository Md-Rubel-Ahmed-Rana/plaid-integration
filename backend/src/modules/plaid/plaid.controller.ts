import BaseController from "@/shared/baseController";
import { Request, Response } from "express";
import { PlaidService } from "./plaid.service";
import { HttpStatusCode } from "@/lib/httpStatus";

class Controller extends BaseController {
  createLinkToken = this.catchAsync(async (req: Request, res: Response) => {
    const userEmail = req.params.email;
    const result = await PlaidService.createLinkToken(userEmail);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Link token created successfully",
      data: result,
    });
  });

  exchangePublicToken = this.catchAsync(async (req: Request, res: Response) => {
    const { public_token, userId, institution } = req.body;
    const result = await PlaidService.exchangePublicToken(
      public_token,
      userId,
      institution
    );
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Your Bank account verified successfully",
      data: result,
    });
  });
}

export const PlaidController = new Controller();
