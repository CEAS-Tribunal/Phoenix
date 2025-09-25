import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommitteesService, Committee, CommitteeRole, Person } from '../committees.service';

@Component({
  selector: 'app-committees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './committees-page.component.html',
})
export class CommitteesPageComponent implements OnInit {
  showRolesModal = false;
  activeTab: 'tab1' | 'tab2' = 'tab1';
  selectedRole: CommitteeRole | null = null;
  /** members for selected role */
  members: Person[] = [];
  isMembersLoading = false;
  membersError: string | null = null;

  committees: Committee[] = [];
  isLoading = false;
  errorMsg: string | null = null;
  selectedCommitteeColor: string | null = null;

  constructor(private committeesService: CommitteesService) {}

  ngOnInit(): void {
    this.loadCommittees();
  }

  loadCommittees(): void {
    this.isLoading = true;
    this.errorMsg = null;
    this.committeesService.getCommittees().subscribe({
      next: (data) => {
        this.committees = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading committees', error);
        this.errorMsg = 'Failed to load committees. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  openRolesModal(role: CommitteeRole, color: string) {
    this.selectedRole = role;
    this.selectedCommitteeColor = color;
    this.activeTab = 'tab1';
    this.showRolesModal = true;
    this.loadMembers(role.id);
  }

  /** load ExecMembers for selected role */
  private loadMembers(roleId: number): void {
    this.isMembersLoading = true;
    this.membersError = null;
    this.committeesService.getMembers(roleId).subscribe({
      next: (data) => {
        this.members = data;
        this.isMembersLoading = false;
        console.log(this.members)
      },
      error: (err) => {
        console.error('Failed to load members', err);
        this.membersError = 'Could not load members. Please try again later.';
        this.isMembersLoading = false;
      },
    });
  }

  closeRolesModal() {
    this.selectedRole = null;
    this.selectedCommitteeColor = null;
    this.showRolesModal = false;
  }
}
