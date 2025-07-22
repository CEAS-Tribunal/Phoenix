import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Make sure this is imported

@Component({
  selector: 'app-exec-main-page', // Changed selector to be conventional
  standalone: true,
  imports: [CommonModule], // <-- And added here
  templateUrl: './exec-main-page.component.html',
  styleUrl: './exec-main-page.component.css'
})
export class ExecMainPageComponent {

  // --- Data for Executive Board Members ---
  // This data structure matches your three-column layout.
  // You just need to fill in the 'TBD' (To Be Determined) fields for each person.

  president = {
    position: 'President',
    name: 'TBD',
    email: 'tbd@email.com',
    major: 'TBD',
    bio: 'The President oversees all Tribunal activities and represents the student body.'
  };

  column1 = [
    { position: 'Senator', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Represents the college in Student Government.' },
    { position: 'VP of College Affairs', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Manages internal college-related initiatives.' },
    { position: 'ESOC', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Engineers and Scientists of Cincinnati.' },
    { position: 'Academic Affairs', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Handles academic concerns and curriculum feedback.' },
    { position: 'Career Development', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Organizes career fairs and professional workshops.' },
    { position: 'Equity & Inclusion', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Promotes diversity and inclusion within the college.' },
    { position: 'First Year Experience', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Supports first-year students in their transition to college.' }
  ];

  column2 = [
    { position: 'Election Oversight Committee', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Manages and oversees Tribunal elections.' },
    { position: 'VP of Events', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Oversees all event-planning committees.' },
    { position: 'College Wide Events', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Plans large-scale events for the entire college.' },
    { position: 'EWeek', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Organizes events for National Engineers Week.' },
    { position: 'Expo', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Manages the Tribunal\'s presence at university expos.' },
    { position: 'Social Events', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Plans social gatherings and activities for members.' }
  ];

  column3 = [
    { position: 'Treasurer', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Manages the budget and all financial matters.' },
    { position: 'Chief of Staff', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Assists the President and manages internal operations.' },
    { position: 'Communications', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Handles all official communications and social media.' },
    { position: 'Innovation', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Leads innovation challenges and creative projects.' },
    { position: 'Internship', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Facilitates internship opportunities and resources.' },
    { position: 'Secretary', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Takes meeting minutes and maintains records.' },
    { position: 'Technology', name: 'TBD', email: 'tbd@email.com', major: 'TBD', bio: 'Manages the website and other technical resources.' }
  ];

  // --- Modal Logic ---
  isModalVisible = false;
  selectedExec: any = null;

  openModal(execMember: any) {
    this.selectedExec = execMember;
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.selectedExec = null;
  }
}
