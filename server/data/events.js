import { pool } from "../config/database.js";

const getEventbyId = async (id) => {
  try {
    const results = await pool.query(
      "SELECT * FROM events where created_by = $1",
      [id]
    );
    return results.rows;
  } catch (error) {
    console.error(error.message);
  }
};

const applicationstoMyEvents = async (name) => {
  try {
    const results = await pool.query(
      "SELECT * FROM applications where event_id in (SELECT id FROM events where created_by = $1) and status = 'Pending'",
      [name]
    );
    return results.rows;
  } catch (error) {
    console.error(error.message);
  }
};

const getAllEvents = async () => {
  try {
    const results = await pool.query("SELECT * FROM events");
    return results.rows;
  } catch (error) {
    console.error(error.message);
  }
};

const myUpcomingEvent = async (name) => {
  try {
    const results = await pool.query(
      "SELECT * FROM events where id in (SELECT event_id FROM applications where username = $1 and status = 'accepted')",
      [name]
    );
    return results.rows;
  } catch (error) {
    console.error(error.message);
  }
};

const MyApplication = async (name) => {
  try {
    const results = await pool.query(
      "SELECT * FROM applications where username = $1",
      [name]
    );
    return results.rows;
  } catch (error) {
    console.error(error.message);
  }
};

const deleteEvent = async (id) => {
  try {
    //delete the event
    const results = await pool.query("DELETE FROM events WHERE id = $1", [id]);
    return results.rows;
  } catch (error) {
    console.error(error.message);
  }
};

const addevent = async (
  created_by,
  title,
  description,
  event_date,
  end_date
) => {
  try {
    const results = await pool.query(
      "INSERT INTO events (created_by, title, description, event_date, end_date) VALUES ($1, $2, $3, $4, $5)",
      [created_by, title, description, event_date, end_date]
    );
    return results.rows;
  } catch (error) {
    console.error(error.message);
  }
};

const declineApplication = async (username, event_id) => {
  try {
    const results = await pool.query(
      "update applications set status = 'declined' where username = $1 and event_id = $2",
      [username, event_id]
    );
    return results.rows;
  } catch (error) {
    console.error(error.message);
  }
};

const acceptApplication = async (username, event_id) => {
  try {
    const results = await pool.query(
      "update applications set status = 'accepted' where username = $1 and event_id = $2",
      [username, event_id]
    );
    return results.rows;
  } catch (error) {
    console.error(error.message);
  }
};

export {
  getAllEvents,
  getEventbyId,
  myUpcomingEvent,
  applicationstoMyEvents,
  MyApplication,
  deleteEvent,
  addevent,
  declineApplication,
  acceptApplication,
};
