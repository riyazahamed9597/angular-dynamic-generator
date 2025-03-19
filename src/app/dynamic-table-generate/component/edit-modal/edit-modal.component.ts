import { Component, OnInit, Input,Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { dynamicService } from '../../service/dynamic.service';
import { typeOptions } from '../../interface/table-component.model';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})

export class EditModalComponent implements OnInit {
  @Input() componentId!: number;
  editForm: FormGroup;
  typeOptions: string[] = Object.values(typeOptions); // Extract enum values
  ComponentsDataById: any;

  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<EditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dynamicService: dynamicService) {
      this.editForm = this.fb.group({
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
    this.getComponentData(this.data);
  }

  getComponentData(id:number){
    this.dynamicService.getComponentById(id).subscribe((res:any)=>{
      this.ComponentsDataById = res;
      this.editForm = this.fb.group({
        actions: this.fb.array([
          this.fb.group({
            name: [this.ComponentsDataById.name, Validators.required],  // Mandatory
            key: [this.ComponentsDataById.key, Validators.required],  // Mandatory
            type: [this.ComponentsDataById.type, Validators.required],  // Mandatory
            options: [[]],
            isActive: [true], // Default value
          })
        ])
      });
    })
  }

  get actions(): FormArray {
    return this.editForm.get('actions') as FormArray;
  }


  onTypeChange(event: any, index: number): void {
    const selectedType = event.target.value;
    if (selectedType === 'dropdown') {
      this.actions.at(index).get('options')?.setValidators(Validators.required);
    } else {
      this.actions.at(index).get('options')?.clearValidators();
    }
    this.actions.at(index).get('options')?.updateValueAndValidity();
  }

  onOptionsChange(event: any, index: number): void {
    this.actions.at(index).get('options')?.setValue(event.target.value);
  }

  updateComponent(): void {
    if (this.editForm.valid) {
      const updatedComponent = this.editForm.value;
      this.dialogRef.close({ updatedComponent: updatedComponent });
    }
  }
}