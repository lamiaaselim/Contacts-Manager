import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from './../../Services/contact.service';
import { Contact } from './../../interface/contact';
import { SocketService } from 'src/app/Services/socket.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss'],
})
export class ContactDetailsComponent implements OnInit {
  contactId: string | null = null;
  lockedContacts: Set<string> = new Set();
  contact: Contact = {
    _id: '',
    name: '',
    phone: '',
    address: '',
    notes: '',
  };

  isNewContact: boolean = false;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private socketService: SocketService ,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isNewContact = this.route.snapshot.data['isNewContact'] || false;
    if (this.isNewContact) {
      // Set up an empty contact object
      this.contact = {
        _id: '',
        name: '',
        phone: '',
        address: '',
        notes: '',
      };
    } else {
      this.contactId = this.route.snapshot.paramMap.get('id');
      if (this.contactId) {
        this.contactService.getContact(this.contactId).subscribe({
          next: (contact) => {
            this.contact = contact;
            // Emit a lock event to the server
            this.socketService.lockContact(this.contactId as string);
          },
          error: (err) => {
            console.error('Failed to load contact', err);
          },
        });
      }
    }

  }

  saveContact(): void {
    if (this.isNewContact) {
      this.contactService.addContact(this.contact).subscribe({
        next: () => {
          this.router.navigate(['/contacts']);
          alert('Contact added successfully');
        },
        error: (err) => console.error('Failed to add contact', err),
      });
    } else {
      this.contactService
        .updateContact(this.contactId as string, this.contact)
        .subscribe({
          next: () => {
            this.router.navigate(['/contacts']);
            alert('Contact updated successfully');
          },
          error: (err) => console.error('Failed to update contact', err),
        });
    }
  }

  deleteContact(): void {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(this.contactId as string).subscribe({
        next: () => {
          this.router.navigate(['/contacts']);
          alert('Contact deleted successfully');
        },
        error: (err) => console.error('Failed to delete contact', err),
      });
    }
  }

  ngOnDestroy(): void {
    if (this.contactId) {
      this.socketService.unlockContact(this.contactId as string);
    }
  }

}
