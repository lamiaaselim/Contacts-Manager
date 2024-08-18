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
  private userId: string | null = null;

  constructor() {
    this.socket = io('http://localhost:8080');
    this.socket.on('connect', () => {
      this.userId = this.socket.id as string;
      console.log('Socket connected:', this.userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.userId = null;
    });
  }

  lockContact(contactId: string) {
    if (this.userId) {
      this.socket.emit('lock_contact', { contactId, userId: this.userId });
    }
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

  onContactUpdated(callback: (contact: any) => void) {
    this.socket.on('contact_updated', callback);
  }
}
