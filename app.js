const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const CONTACTS_FILE = "./contacts.json";

// Leer contactos
function loadContacts() {
  const data = fs.readFileSync(CONTACTS_FILE, "utf-8");
  return JSON.parse(data);
}

// Guardar contactos
function saveContacts(contacts) {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
}

app.get("/", (req, res) => {
  const contacts = loadContacts();
  res.render("index", { contacts });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/add", (req, res) => {
  const { name, email, phone } = req.body;
  const contacts = loadContacts();
  contacts.push({ name, email, phone });
  saveContacts(contacts);
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const { phone } = req.body;
  const contacts = loadContacts().filter(c => c.phone !== phone);
  saveContacts(contacts);
  res.redirect("/");
});

app.get("/edit/:phone", (req, res) => {
  const phone = req.params.phone;
  const contacts = loadContacts();
  const contact = contacts.find(c => c.phone === phone);

  if (!contact) return res.status(404).send("Contacto no encontrado");

  res.render("edit", { contact });
});

app.post("/update", (req, res) => {
  const { originalPhone, name, email, phone } = req.body;
  let contacts = loadContacts();

  contacts = contacts.map(c => {
    if (c.phone === originalPhone) {
      return { name, email, phone };
    }
    return c;
  });

  saveContacts(contacts);
  res.redirect("/");
});


app.listen(80, '0.0.0.0', () => console.log("Servidor en http://localhost"));


