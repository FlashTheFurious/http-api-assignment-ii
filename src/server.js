const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());

// Serve the client page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/client.html"));
});

// Serve the CSS file
app.get("/style.css", (req, res) => {
  res.type("text/css");
  res.sendFile(path.join(__dirname, "../client/style.css"));
});

// In-memory "database" for the purpose of this assignment
let users = {};

app.get("/getUsers", (req, res) => {
  console.log("GET /getUsers called");
  res.status(200).json({ users });
});

app.head("/getUsers", (req, res) => {
  console.log("HEAD /getUsers called");
  res.status(200).end();
});

app.post("/addUser", (req, res) => {
  const { name, age } = req.body;

  console.log("POST /addUser called with:", req.body);

  if (!name || age == null) {
    // Check for null or undefined but allow 0
    console.log("Bad request: Name and age are both required.");
    return res
      .status(400)
      .json({
        message: "Name and age are both required.",
        id: "addUserMissingParams",
      });
  }

  if (users[name]) {
    users[name].age = age;
    console.log(`User ${name} age updated to ${age}`);
    return res.status(204).end();
  } else {
    users[name] = { name, age };
    console.log(`User ${name} created with age ${age}`);
    return res
      .status(201)
      .json({
        message: "Created Successfully",
        id: "user_created",
        user: { name, age },
      });
  }
});

// Handle not found URLs
app.all("*", (req, res) => {
  console.log(`404 Not Found: The requested path '${req.path}' was not found.`);
  res.status(404).json({ message: "Not found", id: "not_found" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
