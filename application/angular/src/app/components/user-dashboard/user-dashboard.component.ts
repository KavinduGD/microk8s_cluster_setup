import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);

  // State Signals
  readonly users = signal<User[]>([]);
  readonly searchQuery = signal<string>('');
  readonly loading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly isModalOpen = signal<boolean>(false);
  readonly selectedUser = signal<User | null>(null); // null means "Create", otherwise "Edit"
  readonly isDeleteConfirmOpen = signal<boolean>(false);
  readonly userToDelete = signal<User | null>(null);

  // Form Group
  userForm!: FormGroup;

  // Computed signal for searching/filtering
  readonly filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allUsers = this.users();
    if (!query) {
      return allUsers;
    }
    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  loadUsers(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Failed to load users. Make sure the Spring Boot server is running on port 8080.');
        this.loading.set(false);
        this.showToast('error', 'Failed to load users.');
      },
    });
  }

  openAddModal(): void {
    this.selectedUser.set(null);
    this.userForm.reset();
    this.isModalOpen.set(true);
  }

  openEditModal(user: User): void {
    this.selectedUser.set(user);
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
    });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedUser.set(null);
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const userData: User = this.userForm.value;
    const userToSave = this.selectedUser();

    this.loading.set(true);
    if (userToSave && userToSave.id !== undefined) {
      // Edit
      this.userService.updateUser(userToSave.id, userData).subscribe({
        next: (updated) => {
          this.users.update((prev) =>
            prev.map((u) => (u.id === userToSave.id ? updated : u))
          );
          this.loading.set(false);
          this.closeModal();
          this.showToast('success', `User "${updated.name}" updated successfully!`);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
          this.showToast('error', 'Failed to update user.');
        },
      });
    } else {
      // Create
      this.userService.createUser(userData).subscribe({
        next: (created) => {
          this.users.update((prev) => [...prev, created]);
          this.loading.set(false);
          this.closeModal();
          this.showToast('success', `User "${created.name}" created successfully!`);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
          this.showToast('error', 'Failed to create user.');
        },
      });
    }
  }

  openDeleteConfirm(user: User): void {
    this.userToDelete.set(user);
    this.isDeleteConfirmOpen.set(true);
  }

  closeDeleteConfirm(): void {
    this.isDeleteConfirmOpen.set(false);
    this.userToDelete.set(null);
  }

  confirmDelete(): void {
    const user = this.userToDelete();
    if (!user || user.id === undefined) return;

    this.loading.set(true);
    this.userService.deleteUser(user.id).subscribe({
      next: (response) => {
        this.users.update((prev) => prev.filter((u) => u.id !== user.id));
        this.loading.set(false);
        this.closeDeleteConfirm();
        this.showToast('success', response || 'User deleted successfully.');
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        this.showToast('error', 'Failed to delete user.');
      },
    });
  }

  private toastTimeout: any;
  showToast(type: 'success' | 'error', message: string): void {
    if (type === 'success') {
      this.successMessage.set(message);
      // Don't override persistent connection errors immediately if they were showing,
      // but let's clear local state.
    } else {
      this.errorMessage.set(message);
    }

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastTimeout = setTimeout(() => {
      this.successMessage.set(null);
      // Only clear error message if it's not the persistent connection loading error
      if (!this.errorMessage()?.includes('Spring Boot server')) {
        this.errorMessage.set(null);
      }
    }, 4000);
  }
}
