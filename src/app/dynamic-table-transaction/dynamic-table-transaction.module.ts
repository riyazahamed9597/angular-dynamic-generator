import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DynamicTableTransactionRoutingModule } from './dynamic-table-transaction-routing.module';
import { DynamicTableTransactionComponent } from './dynamic-table-transaction.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteConfirmationComponent } from '../dynamic-table-generate/component/delete-confirmation/delete-confirmation.component';


@NgModule({
  declarations: [
    DynamicTableTransactionComponent,
  ],
  imports: [
    CommonModule,
    DynamicTableTransactionRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
  ]
})
export class DynamicTableTransactionModule { }
