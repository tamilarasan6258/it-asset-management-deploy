import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../../services/assignment/assignment.service';

@Component({
  selector: 'app-admin-return-requests',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-return-requests.component.html',
  styleUrl: './admin-return-requests.component.css'
})
export class AdminReturnRequestsComponent {

  conditionErrors: { [key: string]: string } = {};
  successMsg = '';
  returns: any[] = [];

  constructor(private assignmentService: AssignmentService) {

  }



  ngOnInit() {
    this.assignmentService.getPendingReturnsForAdmin().subscribe({
      next: (res: any[]) => {
        console.log(res);
        this.returns = res
      },
      error: () => alert('❌ Failed to load return requests')
    });
  }

  finalizeReturn(id: string, condition: string) {
    if (!condition) {
      this.conditionErrors[id] = '❗ Please select a condition';
      return;
    }

    this.conditionErrors[id] = ''; // clear error

    this.assignmentService.finalizeReturnByAdmin(id, condition).subscribe({
      next: () => {
        this.successMsg = '✅ Return finalized successfully';
        this.returns = this.returns.filter(r => r._id !== id);

        // Auto-clear the success message after 3 seconds
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => {
        this.successMsg = ''; // clear any old success msg
        this.conditionErrors[id] = '❌ Failed to finalize return';
      }
    });
  }

}
