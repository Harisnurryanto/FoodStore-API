import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createProductsValidation,
  getProductsValidation,
  updateProductsValidation,
} from "../validation/product-validation.js";
import { validate } from "../validation/validation.js";

const checkUserMustExists = async (user, userId) => {
  userId = validate(getProductsValidation, userId);

  const totalUserInDatabase = await prismaClient.users.count({
    where: {
      email: user.email,
      id: userId,
    },
  });

  if (totalUserInDatabase !== 1) {
    throw new ResponseError(404, "user is not found");
  }

  return userId;
};

const create = async (user, userId, request) => {
  userId = await checkUserMustExists(user, userId);
  const reqProduct = validate(createProductsValidation, request);
  reqProduct.userId = userId;

  const result = await prismaClient.product.create({
    data: reqProduct,
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      price: true,
      userId: true,
    },
  });

  return result;
};

const getProductId = async (user, userId, productId) => {
  userId = await checkUserMustExists(user, userId);
  const productsId = validate(getProductsValidation, productId);

  const result = await prismaClient.product.findFirst({
    where: {
      id: productsId,
      userId: userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      price: true,
      userId: true,
    },
  });

  if (!result) {
    throw new ResponseError(404, "product is not found!");
  }

  return result;
};

const getProductByUser = async (user, userId) => {
  userId = await checkUserMustExists(user, userId);

  const result = await prismaClient.product.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      price: true,
      userId: true,
    },
  });

  return result;
};

const getProducts = async (user) => {
  return prismaClient.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      price: true,
      userId: true,
    },
  });
};

const update = async (user, userId, request) => {
  userId = await checkUserMustExists(user, userId);
  const productId = validate(updateProductsValidation, request);

  const totalProductsInDatabase = await prismaClient.product.count({
    where: {
      userId: userId,
      id: productId.id,
    },
  });

  if (totalProductsInDatabase !== 1) {
    throw new ResponseError(404, "products is not found!");
  }

  const result = await prismaClient.product.update({
    where: {
      id: productId.id,
    },
    data: {
      name: productId.name,
      description: productId.description,
      imageUrl: productId.imageUrl,
      price: productId.price,
    },
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      price: true,
      userId: true,
    },
  });

  return result;
};

const remove = async (user, userId, productId) => {
  userId = await checkUserMustExists(user, userId);
  const productsId = validate(getProductsValidation, productId);

  const totalProductsInDatabase = await prismaClient.product.count({
    where: {
      userId: userId,
      id: productsId,
    },
  });

  if (totalProductsInDatabase !== 1) {
    throw new ResponseError(404, "product is not found!");
  }

  return prismaClient.product.delete({
    where: {
      id: productsId,
    },
  });
};

export default {
  create,
  getProductId,
  getProductByUser,
  getProducts,
  update,
  remove,
};
