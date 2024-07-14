import productService from "../service/product-service.js";

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const userId = req.params.userId;
    const result = await productService.create(user, userId, request);

    res.status(200).json({
      data: result,
      msg: "product berhasil di tambahkan!",
    });
  } catch (e) {
    next(e);
  }
};

const getProductId = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = req.params.userId;
    const productId = req.params.productId;
    const result = await productService.getProductId(user, userId, productId);

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getProductByUser = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = req.params.userId;
    const result = await productService.getProductByUser(user, userId);

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await productService.getProducts(user);

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = req.params.userId;
    const productId = req.params.productId;
    const request = req.body;
    request.id = productId;
    const result = await productService.update(user, userId, request);

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = req.params.userId;
    const productId = req.params.productId;
    await productService.remove(user, userId, productId);

    res.status(200).json({
      data: "product berhasil di hapus!",
    });
  } catch (e) {
    next(e);
  }
};
export default {
  create,
  getProductId,
  getProductByUser,
  getProducts,
  update,
  remove,
};
