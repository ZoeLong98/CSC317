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
                id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE, 
                phone_number VARCHAR(15) NOT NULL, 
                password VARCHAR(255) NOT NULL
            );
            CREATE TABLE IF NOT EXISTS events (
                id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                created_by VARCHAR(50) NOT NULL,
                title VARCHAR(50) NOT NULL, 
                description TEXT NOT NULL,
                event_date TIMESTAMP NOT NULL,
                end_date TIMESTAMP NOT NULL,
                image TEXT,
                FOREIGN KEY (created_by) REFERENCES users (username) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS applications (
                username VARCHAR(50) NOT NULL,
                event_id INT NOT NULL,
                status VARCHAR(50) NOT NULL,
                PRIMARY KEY (username, event_id),
                FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE,
                FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
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

        INSERT INTO events (created_by, title, description, event_date, end_date, image) VALUES 
            ('defaultuser1', 'FirstEvent', 'This is a sample event', '2024-12-12 01:00:00', '2024-12-13 02:00:00', ''),
            ('defaultuser1', 'Date Night: Pottery', 'Join us for a fun night of pottery!', '2024-12-12 18:00:00', '2024-12-12 20:00:00','https://plus.unsplash.com/premium_photo-1661380954234-13d98a83577c?q=80&w=2070&auto=format&fit=crop'),
            ('defaultuser2', 'Intro to Forging', 'Learn forging together!', '2024-12-13 10:00:00', '2024-12-13 12:00:00', 'https://images.unsplash.com/flagged/photo-1567400389308-a5709e30eb79?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

        INSERT INTO applications (username, event_id, status) VALUES 
            ( 'defaultuser2', 1, 'pending');            
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
