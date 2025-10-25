import express from "express";
import assetRouter from "./routers/assetrouter.ts";
import locationRouter from "./routers/locationrouter.ts";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "*"
}))

app.use(express.json());

app.use("/assets", assetRouter);

app.use("/locations", locationRouter);

app.listen(3001, () => {
    console.log("Server started on port 3001");
});
