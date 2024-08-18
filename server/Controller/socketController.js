// Controller/socketController.js

let ioInstance = null;

function init(io) {
  ioInstance = io;
}

function lockContact(contactId) {
  if (ioInstance) {
    ioInstance.emit('contact_locked', { contactId });
  }
}

function unlockContact(contactId) {
  if (ioInstance) {
    ioInstance.emit('contact_unlocked', { contactId });
  }
}

module.exports = {
  init,
  lockContact,
  unlockContact
};
