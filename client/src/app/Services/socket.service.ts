import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

interface LockContactData {
  contactId: string;
  userId: string;
}

interface UnlockContactData {
  contactId: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:8080');
  }

  lockContact(contactId: string) {
    this.socket.emit('lock_contact', { contactId, userId: this.socket.id });
  }

  unlockContact(contactId: string) {
    this.socket.emit('unlock_contact', { contactId });
  }

  onContactLocked(callback: (data: LockContactData) => void) {
    this.socket.on('contact_locked', callback);
  }

  onContactUnlocked(callback: (data: UnlockContactData) => void) {
    this.socket.on('contact_unlocked', callback);
  }
}
