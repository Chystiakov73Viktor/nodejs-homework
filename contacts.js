const fs = require("node:fs/promises");
const path = require("node:path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db/contacts.json");

async function readFile() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8"});
  return JSON.parse(data);
}

async function writeFile(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf-8');
}

function listContacts() {
 return readFile();
}

async function getContactById(contactId) {
  const contacts = await readFile();
  const result = contacts.find(contact => contact.id === contactId);
  return result || null;
}

async function removeContact(contactId) {
  const contacts = await readFile();
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await writeFile(contacts);
  return result;
}

async function addContact(name, email, phone) {
  const contacts = await readFile();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  }
  contacts.push(newContact);
  await writeFile(contacts); 
  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact
}
