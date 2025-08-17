import app from "./app.js";
import { connectDb } from "./config/db.js";
import { PORT } from "./config/env.js";

const port = PORT || 3000;

(async () => {
  await connectDb();
  app.listen(port, () => {
    console.log(`App is Listening to Port: ${port}`);
  });
})();
