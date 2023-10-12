import express from "express";
import cors from "cors";
import session from "express-session";
import snippetsRouter from "./routes/snippets.js";
import usersRouter from "./routes/users.js";

const app = express();
app.use(session({ secret: process.env.COOKIE_SECRET, cookie: { maxAge: 60000 * 60 * 24 * 2 } }));

app.use(express.json());
app.use(cors()); // so netlify can talk to this server (on railway)

app.use("/snippets", snippetsRouter);
app.use("/users", usersRouter);

app.listen(process.env.PORT, function () {
  console.log("listening on http://localhost:" + process.env.PORT);
});
