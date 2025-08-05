import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../../services/assignment/assignment.service';

@Component({
  selector: 'app-dept-return-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dept-return-review.component.html',
  styleUrl: './dept-return-review.component.css'
})
export class DeptReturnReviewComponent {

  returns: any[] = [];
  successMsg = '';

  constructor(
    private assignmentService: AssignmentService
  ) {

  }


  ngOnInit() {
    // this.assignmentService.getReturnRequestsForDeptHead().subscribe(res => this.returns = res);
    this.assignmentService.getReturnRequestsForDeptHead().subscribe({
      next: (res: any[]) => {
        console.log(res);
        this.returns = res
      },
      error: () => alert('❌ Failed to load return requests')
    });

  }

  approveReturn(id: string) {
    this.assignmentService.approveReturnByDeptHead(id).subscribe({
      next: () => {
        this.successMsg = '✅ Return approved and message sent';
        this.returns = this.returns.filter(r => r._id !== id);

        // Auto-clear the success message after 3 seconds
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => {
        this.successMsg = '❌ Failed to approve return';
      }
    });
  }


}
