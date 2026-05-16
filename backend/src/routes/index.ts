import { PayoutAccountRoutes } from "@/modules/payout-account/payout-account.routes";
import { PlaidRoutes } from "@/modules/plaid/plaid.routes";
import { Router } from "express";
const router = Router();

router.use("/plaid", PlaidRoutes);

router.use("/payout-accounts", PayoutAccountRoutes);

export const AppRoutes = router;
