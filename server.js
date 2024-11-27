import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// fake data
const UpcomingEvent = [
  {
    title: "Upcoming Event",
    date: "2023-01-01",
    description: "This is an upcoming event",
    planner: "Event Planner",
  },
];
const myEvent = [
  {
    title: "My Event",
    date: "2022-01-01",
    description: "This is my event",
    planner: "Event Planner",
  },
];
const application = [
  {
    username: "Jone",
    event_id: "1",
    status: "Pending",
  },
];
const myapplication = [
  {
    username: "Alice",
    event_id: "1",
    status: "Pending",
  },
];

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
  res.render("myevent", { UpcomingEvent, myEvent });
});

app.get("/notification", async (req, res) => {
  res.render("notification", { application, myapplication });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
