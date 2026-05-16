import { Router } from "express";
import { PayoutAccountController } from "./payout-account.controller";

const router = Router();

router.get("/:email/accounts", PayoutAccountController.getUserAccounts);

export const PayoutAccountRoutes = router;
