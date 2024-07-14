import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const get = async () => {
  const users = await prismaClient.users.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return users;
};

const register = async (request) => {
  const userRequest = validate(registerUserValidation, request);

  const totalCountUser = await prismaClient.users.count({
    where: {
      email: userRequest.email,
    },
  });

  if (totalCountUser === 1) {
    throw new ResponseError(401, "email is already exist");
  }

  const salt = await bcrypt.genSalt();
  userRequest.password = await bcrypt.hash(userRequest.password, salt);

  const result = await prismaClient.users.create({
    data: userRequest,
  });

  return result;
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.users.findUnique({
    where: {
      email: loginRequest.email,
    },
  });

  if (!user) {
    throw new ResponseError(401, "email is wrong");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ResponseError(401, "password is wrong");
  }

  const payLoad = { id: user.id, name: user.name, email: user.email };

  const accessToken = Jwt.sign(payLoad, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });

  const refreshToken = Jwt.sign(payLoad, process.env.JWT_SECRET_REFRESH, {
    expiresIn: "1d",
  });

  const updateToken = await prismaClient.users.update({
    data: {
      refresh_token: refreshToken,
    },
    where: {
      id: user.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      refresh_token: true,
    },
  });

  return {
    user: updateToken,
    accessToken: accessToken,
  };
};

const refreshTokens = async (refreshToken) => {
  if (!refreshToken) {
    throw new ResponseError(401, "refreshToken is not valid");
  }
  const userToken = await prismaClient.users.findFirst({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!userToken) {
    throw new ResponseError(403, "refreshToken is not exist");
  }

  const data = Jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
  await prismaClient.users.findUnique({
    where: {
      email: data.email,
    },
  });

  const payLoad = { id: data.id, name: data.name, email: data.email };
  const accessToken = Jwt.sign(payLoad, process.env.JWT_SECRET, {
    expiresIn: "20s",
  });

  return accessToken;
};

const logout = async (refreshToken) => {
  if (!refreshToken) {
    throw new ResponseError(401, "refreshToken is not valid");
  }
  const user = await prismaClient.users.findFirst({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!user) {
    throw new ResponseError(401, "refreshToken is not exist");
  }

  return prismaClient.users.update({
    where: {
      id: user.id,
      email: user.email,
    },
    data: {
      refresh_token: null,
    },
  });
};

export default { register, login, get, refreshTokens, logout };
