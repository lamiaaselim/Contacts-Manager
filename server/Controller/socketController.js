let ioInstance = null;

function init(io) {
  ioInstance = io;
}

function lockContact(contactId) {
  if (ioInstance) {
    try {
      ioInstance.emit("contact_locked", { contactId });
    } catch (error) {
      console.error("Error emitting contact_locked event:", error);
    }
  }
}

function unlockContact(contactId) {
  if (ioInstance) {
    try {
      ioInstance.emit("contact_unlocked", { contactId });
    } catch (error) {
      console.error("Error emitting contact_unlocked event:", error);
    }
  }
}

const notifyNewContact = (contact) => {
  if (ioInstance) {
    try {
      ioInstance.emit("new_contact", contact);
    } catch (error) {
      console.error("Error emitting new_contact event:", error);
    }
  }
};

function updateContact(contact) {
  console.log("Emitting contact_updated:", contact); // Debugging line to check the emitted data
  ioInstance.emit("contact_updated", contact);
}

module.exports = {
  init,
  lockContact,
  unlockContact,
  notifyNewContact,
  updateContact,
};
