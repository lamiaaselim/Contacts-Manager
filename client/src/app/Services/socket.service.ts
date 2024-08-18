import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:8080');
  }

  lockContact(contactId: string) {
    this.socket.emit('lockContact', contactId);
  }

  unlockContact(contactId: string) {
    this.socket.emit('unlockContact', contactId);
  }

  onContactLocked(callback: (contactId: string) => void) {
    this.socket.on('contactLocked', callback);
  }

  onContactUnlocked(callback: (contactId: string) => void) {
    this.socket.on('contactUnlocked', callback);
  }
}
