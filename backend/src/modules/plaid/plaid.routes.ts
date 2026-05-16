import { Router } from "express";
import { PlaidController } from "./plaid.controller";

const router = Router();

router.get("/link-token/:email", PlaidController.createLinkToken);

router.post("/exchange-public-token", PlaidController.exchangePublicToken);

export const PlaidRoutes = router;
