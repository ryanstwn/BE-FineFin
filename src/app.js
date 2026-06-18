import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import mainRoute from "./routes/index.js";
//import errorMiddleware from "./middlewares/errorMiddleware.js"

const createApp = () => {
  const app = express();

  app.use(cors());

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.use("/api", mainRoute);

  //app.use(errorMiddleware)

  return app;
};

export default createApp;
