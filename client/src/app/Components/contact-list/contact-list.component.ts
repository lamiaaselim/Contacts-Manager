import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ContactService } from './../../Services/contact.service';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/Services/socket.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  contacts: any[] = [];
  filteredContacts: any[] = [];
  lockedContacts: Set<string> = new Set();
  currentPage = 1;
  totalPages = 0;
  filterText = '';

  constructor(
    private contactService: ContactService,
    private socketService: SocketService,
    private router: Router,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getContacts();

    this.socketService.onContactLocked((data) => {
      console.log('Contact locked event received:', data);
      this.lockedContacts.add(data.contactId);
      this.updateContactStatus(data.contactId, true);
    });

    this.socketService.onContactUnlocked((data) => {
      console.log('Contact unlocked event received:', data);
      this.lockedContacts.delete(data.contactId);
      this.updateContactStatus(data.contactId, false);
    });

    this.socketService.onContactUpdated((updatedContact) => {
      console.log('Contact updated event received:', updatedContact); // Debugging line
      this.updateContactInList(updatedContact);
    });
  }

  getContacts(): void {
    const params = {
      page: this.currentPage,
      limit: 5,
    };
    this.contactService.getContacts(params).subscribe((data) => {
      console.log('Contacts data received:', data);
      if (data && Array.isArray(data.contacts)) {
        this.contacts = data.contacts;
        this.totalPages = data.totalPages;
        this.applyFilter();
      } else {
        this.contacts = [];
        this.filteredContacts = [];
        this.totalPages = 0;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getContacts();
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    const filterTextLower = this.filterText.toLowerCase().trim();

    this.filteredContacts = this.contacts.filter((contact) => {
      const nameMatch = contact.name?.toLowerCase().includes(filterTextLower);
      const phoneMatch = contact.phone?.toLowerCase().includes(filterTextLower);
      const addressMatch = contact.address
        ?.toLowerCase()
        .includes(filterTextLower);
      const notesMatch = contact.notes?.toLowerCase().includes(filterTextLower);

      return nameMatch || phoneMatch || addressMatch || notesMatch;
    });
  }

  onEditContact(_id: any) {
    if (this.lockedContacts.has(_id)) {
      alert('This contact is currently being edited by another user.');
      return;
    }

    this.socketService.lockContact(_id);
    this.router.navigate(['contacts', _id]);
  }

  onDeleteContact(contact: any): void {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(contact._id).subscribe(() => {
        this.getContacts();
      });
    }
  }

  onAddContact(): void {
    this.router.navigate(['contacts/new']);
  }

  private updateContactStatus(contactId: string, isLocked: boolean): void {
    const contact = this.contacts.find((contact) => contact._id === contactId);
    if (contact) {
      contact.isLocked = isLocked;
      this.applyFilter();
      console.log('Contact status updated:', contact);
    }
  }

  private updateContactInList(updatedContact: any): void {
    const index = this.contacts.findIndex(
      (contact) => contact._id === updatedContact._id
    );
    if (index !== -1) {
      // Create a new object for the updated contact
      const updatedContactWithNewReference = {
        ...this.contacts[index], // Spread the existing contact properties
        ...updatedContact // Overwrite with the updated contact properties
      };

      // Replace the contact in the contacts array
      this.contacts = [
        ...this.contacts.slice(0, index),
        updatedContactWithNewReference,
        ...this.contacts.slice(index + 1),
      ];

      // Update the filteredContacts to ensure the UI is updated
      this.filteredContacts = [...this.contacts];
      this.cdr.detectChanges(); // Manually trigger change detection
      console.log('Contact list updated:', this.contacts); // Debugging line
    }
  }


  trackByContactId(index: number, contact: any): string {
    return contact._id; // or return any unique identifier for each contact
  }
}
