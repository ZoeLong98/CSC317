import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
  getEventbyId,
  applicationstoMyEvents,
  MyApplication,
  deleteEvent
} from "./server/data/events.js";
import { backendRouter } from "./server/routes/api.js";


const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, "server/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "server/views"));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "server/public", "index.html"));
});

app.get("/addevent", (req, res) => {
  res.sendFile(path.join(__dirname, "server/public", "addevent.html"));
});

app.get("/events", (req, res) => {
  const events = getAllEvents(); 
  res.render("events", { events, activePage: 'events', isEventsPage: true }); 
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


app.post("/register", (req, res) => {
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).send("Event ID is required.");
  }

  console.log(`User registered for event with ID: ${eventId}`);
  res.status(200).send(`Successfully registered for event with ID: ${eventId}`);
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
import { pool } from './server/config/database.js';

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully:', res.rows[0]);
  }
});
