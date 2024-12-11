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

const applicationstoMyEvents = async (id) => {
  try {
    const results = await pool.query(
      "SELECT * FROM applications where event_id in (SELECT id FROM events where created_by = $1)",
      [id]
    );
    return results.rows;
  } catch (error) {
    console.error(error.message);
  }
};

const MyApplication = async (id) => {
  try {
    const results = await pool.query(
      "SELECT * FROM applications where user_id = $1",
      [id]
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

export { getEventbyId, applicationstoMyEvents, MyApplication, deleteEvent };
