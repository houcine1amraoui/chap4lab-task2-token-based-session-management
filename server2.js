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
app.get("/posts", async (req, res) => {
  const { username, password } = req.body;
  res.json(posts.filter((post) => post.author === username));
});

// create a post by a specific user
// user should authenticate
app.post("/posts", auth, async (req, res) => {
  const { title } = req.body;
  const username = "test";
  const newPost = { title, username };
  res.json(newPost);
});

function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// also call signup
app.post("/register", async (req, res) => {
  const newUser = {
    username,
    password,
  };
  users.push(newUser);
  console.log(users);
  return res.json(newUser);
});

// also called sigin
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  var match = false;
  if (username && password) {
    // validation
    const result = users.filter((user) => {
      return user.username === username;
    });
    if (result.length > 0) {
      if (result[0].password === password) {
        const token = jwt.sign(username, process.env.TOKEN_SECRET);
        return res.json(token);
      } else {
        return res.send("False");
      }
    }
  }
});

const PORT = 1000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
