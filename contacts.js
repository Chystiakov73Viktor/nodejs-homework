const fs = require("node:fs/promises");
const path = require("node:path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db/contacts.json");

async function readFile() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

async function writeFile(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf-8");
}

function listContacts() {
  return readFile();
}

async function getContactById(contactId) {
  const contactById = String(contactId);
  const contacts = await readFile();
  const result = contacts.find((contact) => contact.id === contactById);
  return result || null;
}

async function removeContact(contactId) {
  const contactById = String(contactId);
  const contacts = await readFile();
  const index = contacts.findIndex((contact) => contact.id === contactById);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await writeFile(contacts);
  return result;
}

async function updateById(contactId, data) {
  const contactById = String(contactId);
  let contacts = await readFile();
  const updatedContactIndex = contacts.findIndex(
    (contact) => contact.id === contactById
  );

  if (updatedContactIndex === -1) {
    return null;
  }

  contacts = contacts.map((contact) => {
    if (contact.id === contactById) {
      return { ...contact, ...data };
    }
    return contact;
  });

  await writeFile(contacts);

  return contacts[updatedContactIndex];
};

async function addContact(name, email, phone) {
  const contacts = await readFile();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await writeFile(contacts);
  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateById,
};
