import express from "express";

const app = express();

app.get("/", (request, response) => {
  return response.send("Hello NLW05");
});

app.post("/", (request, response) => {
  return response.json({ message: "User created!" });
});

app.listen(3333, () => console.log("Server is UP! ;) "));
