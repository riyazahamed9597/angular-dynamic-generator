import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationComponent {
  @Input() deleteId: number | null = null;
  @Input() deleteName: string = '';
  @Output() confirmDelete = new EventEmitter<number>(); // Emit delete event

  onConfirm() {
    if (this.deleteId !== null) {
      this.confirmDelete.emit(this.deleteId); // Emit the delete ID
    }
  }
}
