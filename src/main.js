import { logger } from "./application/logging.js";
import { web } from "./application/web.js";

const PORT = 3000;
web.listen(PORT, () => {
  logger.info(` server ${PORT}, is listening`);
});
