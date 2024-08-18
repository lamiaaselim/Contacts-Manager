import { Component, OnInit } from '@angular/core';
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

  constructor(private contactService: ContactService, private socketService: SocketService , private router: Router) {}

  ngOnInit(): void {
    this.getContacts();

    this.socketService.onContactLocked((contactId) => {
      this.lockedContacts.add(contactId);
    });

    this.socketService.onContactUnlocked((contactId) => {
      this.lockedContacts.delete(contactId);
    });
  }

  getContacts(): void {
    const params = {
      page: this.currentPage,
      limit: 5,
    };
    this.contactService.getContacts(params).subscribe((data) => {
      console.log(data);
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
    this.router.navigate(['contacts',_id]);
    // this.router.navigate(['contacts', _id]);
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
}
