import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// retrieves the current module's filename and directory name to facilitate file path operations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "server/public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "server/public", "index.html"));
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "server/views"));

app.get("/events", async (req, res) => {
  res.render("events");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
