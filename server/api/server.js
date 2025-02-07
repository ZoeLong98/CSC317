import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { pool } from "../config/database.js"; // Assuming you have a database.js file for your database connection
import {
  getAllEvents,
  getEventbyId,
  myUpcomingEvent,
  applicationstoMyEvents,
  MyApplication,
  declineApplication,
  acceptApplication,
} from "../data/events.js";
import { backendRouter } from "../routes/api.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  session({
    store: new (pgSession(session))({
      pool: pool, // 使用现有的 PostgreSQL 连接池
      createTableIfMissing: true, // 自动创建 session 表
    }),
    secret: process.env.SESSION_SECRET || "a-secret-key",
    resave: false, // 避免不必要的 session 保存操作
    saveUninitialized: false, // 避免存储未修改的 session
    cookie: {
      secure: process.env.NODE_ENV === "production", // 仅在生产环境中使用 secure cookie
      maxAge: 3600000, // 1 小时
      sameSite: "lax", // 或者 "strict" 或 "none" 取决于你的需求
    },
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Middleware to check if user is logged in
function checkAuth(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/addevent", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "addevent.html"), {
    userid: req.session.userid,
    username: req.session.username,
  });
});

app.get("/events", async (req, res) => {
  try {
    const events = await getAllEvents();
    res.render("events", { events, activePage: "events", isEventsPage: true });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).send("An error occurred while fetching events.");
  }
});

app.get("/myevent", checkAuth, async (req, res) => {
  try {
    const UpcomingEvent = await myUpcomingEvent(req.session.username);
    const myEvent = await getEventbyId(req.session.username);
    res.render("myevent", { UpcomingEvent, myEvent });
  } catch (error) {
    console.error("Error fetching my events:", error.message);
    res.status(500).send("An error occurred while fetching my events.");
  }
});

app.get("/notification", checkAuth, async (req, res) => {
  try {
    const application = await applicationstoMyEvents(req.session.username);
    const myapplication = await MyApplication(req.session.username);
    res.render("notification", { application, myapplication });
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).send("An error occurred while fetching notifications.");
  }
});

// Signup Page Route
app.get("/signup", (req, res) => {
  res.render("signup"); // Render signup.ejs
});

// Signup Logic - Save to Database
app.post("/signup", async (req, res) => {
  const { username, email, phone_number, password } = req.body;

  if (!username || !email || !phone_number || !password) {
    return res.render("signup", { errorMessage: "All fields are required!" });
  }

  try {
    const query = `
      INSERT INTO users (username, email, phone_number, password) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *;
    `;
    const values = [username, email, phone_number, password];
    const result = await pool.query(query, values);

    console.log("User registered successfully:", result.rows[0]);

    // 成功註冊後跳轉到 /events 頁面
    res.redirect("/login");
  } catch (error) {
    console.error("Error inserting user:", error.message);

    // 針對重複的 email 報錯
    if (error.message.includes("unique constraint")) {
      return res.render("signup", { errorMessage: "Email already exists." });
    }

    res.render("signup", { errorMessage: "Failed to register user." });
  }
});

// Login Page Route
app.get("/login", (req, res) => {
  if (req.session && req.session.username) {
    res.sendFile(path.join(__dirname, "../public", "logout.html"));
  } else {
    res.render("login", { Message: null });
  }
  // Render login.ejs with no error message initially
});

// Login Logic
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("login", {
      Message: "Email and password are required!",
    });
  }

  try {
    const query = `
      SELECT * FROM users WHERE email = $1 AND password = $2;
    `;
    const values = [email, password];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      const user = result.rows[0]; // Extract user from result
      console.log("User logged in:", user);
      // Store user ID and username in session
      req.session.userid = user.id;
      req.session.username = user.username;
      if (req.session.username) {
        res.redirect("/events");
      }
    } else {
      res.render("login", {
        Message: "Invalid email or password. Please try again.",
      }); // 顯示錯誤訊息
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    res.render("login", {
      Message: "An error occurred. Please try again later.",
    });
  }
});

// Logout Route
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Logout failed.");
    }
    res.clearCookie("connect.sid");
    res.redirect("/"); // Redirect to login page after successful logout
  });
});

// Route to handle adding an event
app.post("/add-event", checkAuth, async (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  console.log("Event data:", req.body);
  const createdBy = req.session.username; // Get the username from the session
  console.log("Created by:", createdBy);
  try {
    if (!createdBy || !title || !description || !startDate || !endDate) {
      return res.status(400).send("All fields are required.");
    }
    const query = `
       INSERT INTO events (created_by, title, description, event_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *;;
    `;
    const values = [createdBy, title, description, startDate, endDate];
    const result = await pool.query(query, values);

    console.log("Event created successfully:", result.rows[0]);
    res.status(201).send("Event created successfully.");
  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(500).send("An error occurred while creating the event.");
  }
});

// mount the router with /api prefix
app.use("/api", backendRouter);

app.post("/register", async (req, res) => {
  const { eventId } = req.body;
  console.log("Event ID:", eventId);
  if (!req.session || !req.session.username) {
    return res.status(401).send("You must be logged in to apply to an event.");
  }
  const username = req.session.username;
  if (!eventId) {
    return res.status(400).send("Event ID is required.");
  }
  try {
    const query = `
      INSERT INTO applications (username, event_id, status) VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [username, eventId, "Pending"];
    const result = await pool.query(query, values);

    console.log("Application created successfully:", result.rows[0]);
    res.status(201).send("Application created successfully.");
  } catch (error) {
    console.error("Error creating application:", error.message);
    res.status(500).send("An error occurred while creating the application.");
  }
});

app.post("/decline", async (req, res) => {
  const { event_id, username } = req.body;
  try {
    await declineApplication(username, event_id);
    console.log(`Declined: ${username} for event ${event_id}`);
    res.redirect("/notification");
  } catch (error) {
    console.error("Error declining application:", error);
    res.status(500).send("An error occurred while declining the application.");
  }
});

app.post("/accept", async (req, res) => {
  const { event_id, username } = req.body;
  try {
    await acceptApplication(username, event_id);
    console.log(`Accepted: ${username} for event ${event_id}`);
    res.redirect("/notification");
  } catch (error) {
    console.error("Error accepting application:", error);
    res.status(500).send("An error occurred while accepting the application.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected successfully:", res.rows[0]);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
