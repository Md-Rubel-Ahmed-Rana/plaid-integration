import BaseController from "@/shared/baseController";
import { Request, Response } from "express";
import { PayoutAccountService } from "./payout-account.service";
import { HttpStatusCode } from "@/lib/httpStatus";

class Controller extends BaseController {
  getUserAccounts = this.catchAsync(async (req: Request, res: Response) => {
    const email = req.params.email;
    const result = await PayoutAccountService.getUserAccounts(email);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Payout accounts retrieved successfully",
      data: result,
    });
  });
}

export const PayoutAccountController = new Controller();
