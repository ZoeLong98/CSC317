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
export const events = [
  { id: 1, title: "Date Night: Pottery", time: "Thurs, August 3rd, 7:30pm", image: "https://plus.unsplash.com/premium_photo-1661380954234-13d98a83577c?q=80&w=2070&auto=format&fit=crop" },
  { id: 2, title: "Intro to Forging", time: "Mon, August 7th, 6:00pm", image: "https://images.unsplash.com/flagged/photo-1567400389308-a5709e30eb79?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 3, title: "Advanced Welding", time: "Sat, August 13th, 10:30am", image: "https://plus.unsplash.com/premium_photo-1682141511588-b40e020dac54?q=80&w=2070&auto=format&fit=crop" },
];

export function getAllEvents() {
  return events;
}

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

