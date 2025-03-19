import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { dynamicService } from './service/dynamic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getTableComponents, typeOptions } from './interface/table-component.model';
declare var bootstrap: any; // Required for Bootstrap Modal handling
import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from './component/edit-modal/edit-modal.component';

@Component({
  selector: 'app-dynamic-table-generate',
  templateUrl: './dynamic-table-generate.component.html',
  styleUrls: ['./dynamic-table-generate.component.scss']
})
export class DynamicTableGenerateComponent implements OnInit {

  componentForm: FormGroup;
  private snackBar = inject(MatSnackBar);
  tableComponentData: getTableComponents[] = [];
  typeEnum = typeOptions; // Store enum reference
  typeOptions: string[] = Object.values(typeOptions); // Extract enum values
  deleteId: number | null = null;
  durationInSeconds:number = 2;
  
  constructor(private fb: FormBuilder, private dynamicService: dynamicService,private dialog: MatDialog) {
    this.componentForm = this.fb.group({
      actions: this.fb.array([
        this.fb.group({
          name: ['', Validators.required],  // Mandatory
          key: ['', Validators.required],  // Mandatory
          type: ['', Validators.required],  // Mandatory
          options: [[]],
          isActive: [true], // Default value
        })
      ])
    });
  }

  ngOnInit(): void {
    this.getComponents();
  }

  get actions(): FormArray {
    return this.componentForm.get('actions') as FormArray;
  }

  onOptionsChange(event: Event, index: number) {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement) return;

    const optionsArray = inputElement.value.split(',')
      .map(opt => opt.trim())
      .filter(opt => opt !== ''); // Trim spaces & remove empty values

    this.actions.at(index).get('options')?.setValue(optionsArray);
  }

  onTypeChange(event: Event, index: number) {
    const selectElement = event.target as HTMLSelectElement;
    if (!selectElement) return;

    const selectedType = selectElement.value;
    const action = this.actions.at(index);

    if (selectedType === 'dropdown') {
      action.get('options')?.setValue([]); // Initialize empty array for dropdown
    } else {
      action.get('options')?.setValue(null); // Reset if not dropdown
    }
  }


  getComponents() {
    this.dynamicService.getComponents().subscribe((action: any) => {
      this.tableComponentData = action;
    })
  }

  // Open Delete Modal
  openDeleteModal(id: number) {
    this.deleteId = id;
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal')!);
    modal.show();
  }

  openEditModal(componentId: number) {
    const dialogRef = this.dialog.open(EditModalComponent, {
      width: '800px',
      data: componentId
    }).afterClosed().subscribe(res=>{
      if (res?.updatedComponent) {
        // If updatedComponent data exists, call updateComponent API
        this.updateComponent(res.updatedComponent.actions[0], componentId);
      }
      this.getComponents();
    }); // Pass data to dialog
  }

  // Handle delete confirmation
  onDeleteConfirmed(id: number) {
    this.dynamicService.deleteComponentById(id).subscribe({
      next: (response) => {
        this.snackBar.open('Component deleted successfully', 'close',
          {
            duration: this.durationInSeconds * 800,
          }
        );
        this.getComponents();
      },
      error: (error) => {
        console.error('Error:', error);
      }
    })
    // this.tableComponentData = this.tableComponentData.filter(item => item.id !== id);
    this.deleteId = null;
  }

  addAction() {
    this.actions.push(this.fb.group({
      name: [''],
      key: [''],
      type: [''],
      options: [[]],
      isActive: true, // Toggle for dynamicValue
    }));
  }

  sendComponent() {
    if (this.componentForm.invalid) {
      console.error('Form is invalid!');
      return;
    }
    // const actionsData = this.actions.value[0]; // Extract FormArray values
    const actionsData = this.actions.value.map((action: any) => ({
      ...action,
      options: action.type === 'dropdown' ? action.options : [] // Ensure options is an array for dropdown only
    }));
    console.log('Sending Data:', actionsData);
    this.dynamicService.addComponent(actionsData[0]).subscribe({
      next: (response) => {
        this.snackBar.open('Component added successfully', 'close',
          {
            duration: this.durationInSeconds * 800,
          }
        );
        this.handleFormReset();

      },
      error: (error) => {
        console.error('Error:', error);
      }
    });

  }

  updateComponent(updatedComponent: any, componentId: number) {
    this.dynamicService.updateComponent(updatedComponent, componentId).subscribe({
      next: () => {
        this.snackBar.open('Component updated successfully', 'close', {
          duration: this.durationInSeconds * 800,
        });
        this.handleFormReset();
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
  
  handleFormReset() {
    this.getComponents();
    this.componentForm.reset();
    this.actions.clear();
    this.addAction(); // Add one empty action field after reset
  }

  getJsonFormat() {
    const actions = this.componentForm.value.actions.filter((action: any) =>
      action.name && action.key && action.value // Ensure all required fields are filled
    );

    return actions.length > 0 ? actions : [];
  }

}
