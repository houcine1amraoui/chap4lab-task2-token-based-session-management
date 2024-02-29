import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const app = express();
app.use(express.json());

let users = [
  {
    username: "mohamed-msila",
    password: "mohamed2024",
  },
  {
    username: "amina-msila",
    password: "amina2024",
  },
];

let posts = [
  {
    title: "Post 1",
    author: "mohamed-msila",
  },
  {
    title: "Post 2",
    author: "amina-msila",
  },
];

// get post of a specific user
// user should authenticate
// then authorization is performed based on username
app.get("/posts", tokenAuth, async (req, res) => {
  const username = req.body.username;
  res.json(posts.filter((post) => post.author === username));
});

// create a post by a specific user
// user should authenticate
app.post("/posts", tokenAuth, async (req, res) => {
  const { title, username } = req.body;
  if (title && username) {
    const newPost = { title, author: username };
    posts.push(newPost);
    res.json(newPost);
  } else {
    res.send("Both username and title are required");
  }
});

// also called signin
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    // validation
    const result = users.filter((user) => {
      return user.username === username;
    });
    if (result.length > 0) {
      if (result[0].password === password) {
        const token = jwt.sign(username, process.env.TOKEN_SECRET);
        // res.set("Authorization", `Bearer ${token}`);
        return res.json({ token });
      } else {
        return res.send("Invalid username or password");
      }
    }
  } else {
    return res.send("Both username and password are required");
  }
});

// also called sigin
function tokenAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    next();
  });
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
