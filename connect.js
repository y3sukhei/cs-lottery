const sqlite3 = require("sqlite3").verbose();

// Connecting to or creating a new SQLite database file
const db = new sqlite3.Database(
  "./collection.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the SQlite database.");
  }
);

// Serialize method ensures that database queries are executed sequentially
db.serialize(() => {
  // Create the items table if it doesn't exist
  db.run(
    `CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY,
        name TEXT,
        description TEXT,
        img TEXT
      )`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Created items table.");

      // Clear the existing data in the products table
      db.run(`DELETE FROM items`, (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("All rows deleted from items");

        // Insert new data into the products table
        const values1 = [
          "Gaming Setup",
          "Intel I5-14400F, Asus Atlas Shark RTX 4060, Thermaltake View 270 TG",
          "/assets/gaming_setup.webp",
        ];
        const values2 = [
          "Mouse",
          "Logitech G PRO X SUPERLIGHT 2 - White",
          "/assets/mouse.webp",
        ];

        const values3 = [
          "Keyboard",
          "Logitech - G913 LIGHTSPEED",
          "/assets/keyboard.webp",
        ];

        const values4 = [
          "Headset",
          "Logitech G PRO X 2 Lightspeed - White",
          "/assets/headset.webp",
        ];

        const values5 = [
            "Figure",
            "Demon Slayer Kamado Tanjiro Hinokami Kagura",
            "/assets/figure.png",
          ];

        const insertSql = `INSERT INTO items(name, description, img) VALUES(?, ?, ?)`;

        db.run(insertSql, values1, function (err) {
          if (err) {
            return console.error(err.message);
          }
          const id = this.lastID; // get the id of the last inserted row
          console.log(`Rows inserted, ID ${id}`);
        });

        db.run(insertSql, values2, function (err) {
          if (err) {
            return console.error(err.message);
          }
          const id = this.lastID; // get the id of the last inserted row
          console.log(`Rows inserted, ID ${id}`);
        });

        db.run(insertSql, values3, function (err) {
          if (err) {
            return console.error(err.message);
          }
          const id = this.lastID; // get the id of the last inserted row
          console.log(`Rows inserted, ID ${id}`);
        });

        db.run(insertSql, values4, function (err) {
          if (err) {
            return console.error(err.message);
          }
          const id = this.lastID; // get the id of the last inserted row
          console.log(`Rows inserted, ID ${id}`);
        });

        db.run(insertSql, values5, function (err) {
            if (err) {
              return console.error(err.message);
            }
            const id = this.lastID; // get the id of the last inserted row
            console.log(`Rows inserted, ID ${id}`);
          });

        //   Close the database connection after all insertions are done
        db.close((err) => {
          if (err) {
            return console.error(err.message);
          }
          console.log("Closed the database connection.");
        });
      });
    }
  );
});