import express from "express";
import productController from "../controller/product-controller.js";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const userRouter = express.Router();
userRouter.use(authMiddleware);

// user api
userRouter.get("/api/user/current", userController.get);

// Product api
userRouter.post("/api/user/:userId/products", productController.create);
userRouter.get(
  "/api/user/:userId/products/:productId",
  productController.getProductId
);
userRouter.get(
  "/api/user/:userId/Products",
  productController.getProductByUser
);
userRouter.get("/api/user/Products", productController.getProducts);
userRouter.patch(
  "/api/user/:userId/products/:productId",
  productController.update
);
userRouter.delete(
  "/api/user/:userId/products/:productId",
  productController.remove
);

export { userRouter };
