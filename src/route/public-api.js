import express from "express";
import userController from "../controller/user-controller.js";

const publicRouter = new express.Router();

publicRouter.post("/api/users", userController.register);
publicRouter.post("/api/users/login", userController.login);
publicRouter.get("/api/users/token", userController.refreshToken);
publicRouter.delete("/api/users/logout", userController.logout);

export { publicRouter };
