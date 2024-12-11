import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
  getEventbyId,
  applicationstoMyEvents,
  MyApplication,
} from "./server/data/events.js";
import { backendRouter } from "./server/routes/api.js";

const app = express();
const PORT = process.env.PORT || 3000;

// retrieves the current module's filename and directory name to facilitate file path operations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "server/public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "server/public", "index.html"));
});

app.get("/addevent", (req, res) => {
  res.sendFile(path.join(__dirname, "server/public", "addevent.html"));
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "server/views"));

app.get("/events", async (req, res) => {
  res.render("events");
});

app.get("/myevent", async (req, res) => {
  const UpcomingEvent = await getEventbyId("defaultuser1");
  const myEvent = await getEventbyId("defaultuser1");
  res.render("myevent", { UpcomingEvent, myEvent });
});

app.get("/notification", async (req, res) => {
  const application = await applicationstoMyEvents("defaultuser1");
  const myapplication = {};
  res.render("notification", { application, myapplication });
});

// mount the router with /api prefix
app.use(express.json());
app.use("/api", backendRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
