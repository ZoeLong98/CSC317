import { pool } from "./database.js";

const dropTables = async () => {
  try {
    console.log("dropping tables...");
    const dropTablesQuery = `
        DROP TABLE IF EXISTS applications;
        DROP TABLE IF EXISTS events;
        DROP TABLE IF EXISTS users;
        `;
    await pool.query(dropTablesQuery);
  } catch (error) {
    console.log(error);
  }
};

const createTables = async () => {
  try {
    console.log("creating applications, users and events...");
    const createQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL, 
                email VARCHAR(100) NOT NULL UNIQUE, 
                phone_number VARCHAR(15) NOT NULL, 
                password VARCHAR(255) NOT NULL
            );
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                created_by INT NOT NULL,
                title VARCHAR(50) NOT NULL, 
                description TEXT NOT NULL,
                event_date TIMESTAMP NOT NULL,
                end_date TIMESTAMP NOT NULL,
                FOREIGN KEY (created_by) REFERENCES users (id)
            );
            CREATE TABLE IF NOT EXISTS applications (
                user_id INT NOT NULL,
                username VARCHAR(50) NOT NULL,
                event_id INT NOT NULL,
                status VARCHAR(50) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (event_id) REFERENCES events (id)
            );
        `;
    await pool.query(createQuery);
    console.log("created applications, users and events...");
  } catch (error) {
    console.log(error);
  }
};

const insertData = async () => {
  try {
    console.log("adding initial data...");
    const insertQuery = `
        INSERT INTO users (username, email, phone_number, password) VALUES 
            ('defaultuser1', 'test1@test1.com', '111111', '111111'),
            ('defaultuser2', 'test2@test2.com', '222222', '222222');

        INSERT INTO events (created_by, title, description, event_date, end_date) VALUES 
            (1, 'FirstEvent', 'This is a sample event', '2024-12-12 01:00:00', '2024-12-13 02:00:00');
            
        INSERT INTO applications (user_id, username, event_id, status) VALUES 
            (2, 'defaultuser2', 1, 'pending');            
        `;
    await pool.query(insertQuery);
    console.log("added initial data...");
  } catch (error) {
    console.log(error);
  }
};

const setup = async () => {
  await dropTables();
  await createTables();
  await insertData();
};

setup();
