const { io } = require("./../socket");

// Function to emit an event when a contact is locked
exports.lockContact = (contactId) => {
  io.emit("contactLocked", contactId);
};

// Function to emit an event when a contact is unlocked
exports.unlockContact = (contactId) => {
  io.emit("contactUnlocked", contactId);
};