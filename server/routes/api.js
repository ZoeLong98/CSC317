import express from "express";
import {
  getEventbyId,
  applicationstoMyEvents,
  MyApplication,
  deleteEvent,
} from "../data/events.js";

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

export { router as backendRouter };
