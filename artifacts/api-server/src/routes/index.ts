import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import contactRouter from "./contact.js";
import supportRouter from "./support.js";
import storeRouter from "./store.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(contactRouter);
router.use(supportRouter);
router.use(storeRouter);
router.use(adminRouter);

export default router;
