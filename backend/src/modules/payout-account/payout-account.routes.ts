import { Router } from "express";
import { PayoutAccountController } from "./payout-account.controller";

const router = Router();

router.get("/:userId", PayoutAccountController.getUserAccounts);

export const PayoutAccountRoutes = router;
