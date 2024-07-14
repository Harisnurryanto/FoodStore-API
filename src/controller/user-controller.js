import userService from "../service/user-service.js";

const register = async (req, res, next) => {
  try {
    await userService.register(req.body);
    res.status(200).json({
      msg: "Register is Successfully",
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await userService.login(request);
    res.cookie("refreshToken", result.user.refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const result = await userService.get();
    res.status(200).json({
      users: result,
    });
  } catch (e) {
    next(e);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    const result = await userService.refreshTokens(refreshToken);
    res.status(200).json({
      accessToken: result,
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await userService.logout(refreshToken);
    res.clearCookie("refreshToken");
    res.status(200).json({
      data: "oke",
    });
  } catch (e) {
    next(e);
  }
};

export default { register, login, get, refreshToken, logout };
