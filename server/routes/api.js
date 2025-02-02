import express from "express";
import { deleteEvent, declineApplication } from "../data/events.js";

const router = express.Router();

// Add routes here

router.delete("/events/:id", (req, res) => {
  const id = parseInt(req.params.id);
  try {
    deleteEvent(id);
    res.status(200).send({ message: "Event deleted" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Failed to delete event" });
  }
});

router.post("/decline", async (req, res) => {
  const { event_id, username } = req.body;
  try {
    await declineApplication(username, event_id);
    console.log(`Declined: ${username} for event ${event_id}`);
  } catch (error) {
    console.error("Error declining application:", error);
    res.status(500).send("An error occurred while declining the application.");
  }
});

export { router as backendRouter };
