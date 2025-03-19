import { Component, OnInit, inject } from '@angular/core';
import { dynamicTransactionService } from './service/dynamic-transaction.service';
import { IAddDynamicTableTransaction, IProductsData, IsubProducts } from './interface/table-transaction.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dynamicService } from '../dynamic-table-generate/service/dynamic.service';
import { getTableComponents } from '../dynamic-table-generate/interface/table-component.model';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var bootstrap: any; // Required for Bootstrap Modal handling

@Component({
  selector: 'app-dynamic-table-transaction',
  templateUrl: './dynamic-table-transaction.component.html',
  styleUrls: ['./dynamic-table-transaction.component.scss']
})
export class DynamicTableTransactionComponent implements OnInit {
  insuranceData: IProductsData[] = [];
  subProducts: IsubProducts[] = [];
  subProductByData: IsubProducts[] = [];
  insurancesForm!: FormGroup;
  showFields: boolean = false; // To control visibility of fields
  defaultPathPrefix = '/';
  tableComponentData: getTableComponents[] = [];
  private snackBar = inject(MatSnackBar);
  editMode: boolean = false;  // Track if we're in edit mode
  editSubProductId!: number;  // Store the subProductId being edited
  cardTitle: string = 'Add Sub-Product';  // Dynamic title
  durationInSeconds = 2;
  deleteId: number | null = null;

  constructor(private serviceTransaction: dynamicTransactionService,
    private fb: FormBuilder, private dynamicService: dynamicService) { }

  ngOnInit(): void {
    this.getProductDetails();
    this.insuranceForm();
    this.getProductValueChange();
    this.getSubProductValueChange();
    this.getComponents();
  }

  getProductValueChange() {
    this.insurancesForm.get('productId')?.valueChanges.subscribe((productId) => {
      if (productId) {
        const selectedProduct = this.insuranceData.find(product => product.id === productId);
        this.subProducts = selectedProduct ? selectedProduct.subProducts : [];
        console.log(this.subProducts);
        if (this.subProducts.length > 0) {
          this.insurancesForm.get('subProductId')?.setValue(''); // Reset sub-product dropdown
        }
        this.insurancesForm.get('subProductId')?.enable(); // Enable sub-product dropdown
      } else {
        this.subProducts = [];
        this.insurancesForm.get('subProductId')?.disable(); // Disable sub-product dropdown
      }
    });
  }

  getSubProductValueChange() {
    // Listen for changes in the sub-product dropdown
    this.insurancesForm.get('subProductId')?.valueChanges.subscribe((subProductId) => {
      if (subProductId) {
        this.showFields = true;
        this.getSubProductById(subProductId);
        this.editSubProductId = subProductId;
      } else {
        this.showFields = false;
      }
    });
  }

  insuranceForm() {
    this.insurancesForm = this.fb.group({
      productId: ['', Validators.required], // Store product ID
      subProductId: [{ value: '', disabled: true }, Validators.required], // Disable initially
      name: ['', Validators.required],
      path: ['', Validators.required],
      icon: ['', Validators.required],
      fields: this.fb.array([
        this.fb.group({
          title: ['', Validators.required], // Input field for title
          keys: [[]] // Multi-select dropdown for keys
        })
      ]),
      status: ['active']
    });
  }

  // Getter for the fields FormArray
  get fields(): FormArray {
    return this.insurancesForm.get('fields') as FormArray;
  }

  // Add a new field group
  addField(): void {
    const fieldGroup = this.fb.group({
      title: ['', Validators.required], // Input field for title
      keys: [[]] // Multi-select dropdown for keys
    });
    this.fields.push(fieldGroup);
  }

  // Remove a field group
  removeField(index: number): void {
    this.fields.removeAt(index);
  }

  resetFields() {
    const productId = this.insurancesForm.get('productId')?.value;
    const subProductId = this.insurancesForm.get('subProductId')?.value;

    this.insuranceForm(); // Reinitialize the form

    // Restore productId and subProductId values
    this.insurancesForm.patchValue({
      productId: productId,
      subProductId: subProductId
    });
    this.getComponents();
    this.getSubProductById(subProductId);
    if(this.subProductByData.length > 0) {
      this.insurancesForm.get('subProductId')?.enable(); // Enable sub-product dropdown
      this.getSubProductValueChange();
    }
    this.cardTitle = 'Add Sub-Product';
  }


  getProductDetails() {
    this.serviceTransaction.getProducts().subscribe((response: any) => {
      this.insuranceData = response;
    })
  }

  getComponents() {
    this.dynamicService.getComponents().subscribe((action: any) => {
      this.tableComponentData = action;
    })
  }

  getSubProductById(subProductId: number) {
    this.serviceTransaction.getDynamicTablesById(subProductId).subscribe((response: any) => {
      this.subProductByData = response;
    })
  }

  getEditDetailSubProductById(subDynamicProductId: number) {
    this.serviceTransaction.getSubProductDetailById(subDynamicProductId).subscribe((response: any) => {
      // Convert `keys` from object array to array of `id`s
      const patchedFields = response.fields.map((field: any) => ({
        title: field.title,
        keys: field.keys.map((key: any) => key.id) // Extract only the ID values
      }));
      this.insurancesForm.patchValue({
        name: response.name,
        subProductId: response.subProductId,
        path: response.path,
        icon: response.icon,
        status: response.status,
        // fields: response.fields
      });

      // Reset and repopulate fields FormArray
      this.fields.clear();
      patchedFields.forEach((field: any) => {
        this.fields.push(this.fb.group({   // Ensure proper FormGroup initialization
          title: [field.title, Validators.required],
          keys: [field.keys]  // Assign extracted keys
        }));
      });

      // Enable edit mode
      this.editMode = true;
      this.editSubProductId = subDynamicProductId;
      this.cardTitle = 'Edit Sub-Product';
    });
  }

  openDeleteModal(id: number) {
    this.deleteId = id;
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal')!);
    modal.show();
  }

  onDeleteConfirmed(id: number) {
    this.serviceTransaction.deleteDynamicProductById(id).subscribe({
      next: (response) => {
        this.snackBar.open('Product configuration deleted successfully', 'close',
          {
            duration: this.durationInSeconds * 800,
          }
        );
        this.resetFields();
      },
      error: (error) => {
        console.error('Error:', error);
      }
    })
    // this.tableComponentData = this.tableComponentData.filter(item => item.id !== id);
    this.deleteId = null;
  }

  onSubmit(): void {
    if (this.insurancesForm.valid) {
      const formData = this.insurancesForm.value;
      const sanitizedPath = formData.path.startsWith('/')
        ? formData.path
        : this.defaultPathPrefix + formData.path;

      const payload: IAddDynamicTableTransaction = {
        name: formData.name,
        path: sanitizedPath,
        icon: formData.icon,
        fields: formData.fields,
        status: formData.status,
        subProductId: formData.subProductId
      };


      const apiCall = this.editMode
        ? this.serviceTransaction.updateDynamicProduct(payload, this.editSubProductId!)
        : this.serviceTransaction.addDynamicProduct(payload);

      apiCall.subscribe(
        (response) => {
          console.log('API Response:', response);
          this.snackBar.open(this.editMode ? 'Product updated successfully' : 'Product configured successfully', 'Close',
            {
              duration: this.durationInSeconds * 800,
            }
          );
          this.resetFields();

          // Reset edit mode after submission
          this.editMode = false;
          // this.editSubProductId = null;
          this.cardTitle = 'Add Sub-Product';
        },
        (error) => {
          alert('Error submitting data.');
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  // onSubmit(): void {
  //   if (this.insurancesForm.valid) {
  //     const formData = this.insurancesForm.value;
  //     const sanitizedPath = formData.path.startsWith('/') 
  //     ? formData.path 
  //     : this.defaultPathPrefix + formData.path;

  //     const payload: IAddDynamicTableTransaction = {
  //       name: formData.name,
  //       path: sanitizedPath,
  //       icon: formData.icon,
  //       fields: formData.fields,
  //       status: formData.status,
  //       subProductId: formData.subProductId
  //     };

  //     if (this.editMode && this.editSubProductId) {
  //       // PATCH request (Update existing record)
  //       this.serviceTransaction.updateDynamicProduct(payload, this.editSubProductId).subscribe(
  //         (response) => {
  //           console.log('Update Response:', response);
  //           this.snackBar.open('Product updated successfully', 'Close',{
  //             duration: this.durationInSeconds * 800,
  //           }
  //           );
  //           this.resetForm();
  //         },
  //         (error) => {
  //           alert('Error updating data.');
  //         }
  //       );
  //     } else {
  //       // POST request (Create new record)
  //       this.serviceTransaction.addDynamicProduct(payload).subscribe(
  //         (response) => {
  //           console.log('API Response:', response);
  //           this.snackBar.open('Product configured successfully', 'Close',
  //             {
  //               duration: this.durationInSeconds * 800,
  //             }
  //           );
  //           this.resetForm();
  //         },
  //         (error) => {
  //           alert('Error submitting data.');
  //         }
  //       );
  //     }
  //   } else {
  //     console.log('Form is invalid');
  //   }
  // }
  // resetForm() {
  //   // this.insurancesForm.reset();
  //   // this.fields.clear();
  //   this.insuranceForm(); // Reinitialize form
  //   this.getComponents();
  //   this.getProductDetails();
  //   this.getSubProductById(this.editSubProductId);
  //   this.cardTitle = 'Add Sub-Product'; // Reset title
  //   this.editMode = false; // Exit edit mode
  // }

}
