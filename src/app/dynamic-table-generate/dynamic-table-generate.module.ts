import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DynamicTableGenerateRoutingModule } from './dynamic-table-generate-routing.module';
import { DynamicTableGenerateComponent } from './dynamic-table-generate.component';
import { ReactiveFormsModule } from '@angular/forms'; // ✅ Import this
import { MatIconModule } from '@angular/material/icon';
import { DeleteConfirmationComponent } from './component/delete-confirmation/delete-confirmation.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditModalComponent } from './component/edit-modal/edit-modal.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    DynamicTableGenerateComponent,
    DeleteConfirmationComponent,
    EditModalComponent
  ],
  imports: [
    CommonModule,
    DynamicTableGenerateRoutingModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule
  ],

})
export class DynamicTableGenerateModule { }
