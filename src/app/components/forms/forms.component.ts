import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClientModule here

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule], // Add HttpClientModule here
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})
export class FormsComponent {
  title = 'firstproj';

  receivedData: any = {};

  formData: { 
    requisitionDate: string;
    employeeId: string;
    department: string;
    name: string;
    totalQuantity: number;
    totalRequired: number;
    createdAt: string;
    items: { 
      serialNo: number;
      productName: string;
      unit: string;
      quantity: number;
      required: number;
      formId?: number; // Ensuring formId exists for backend mapping
    }[]; 
  } = {
    requisitionDate: new Date().toISOString().split('T')[0], // Fix date format to 'YYYY-MM-DD'
    employeeId: '',
    department: '',
    name: '',
    totalQuantity: 0,
    totalRequired: 0,
    createdAt: new Date().toISOString(), // Keeping full ISO format
    items: [{ formId: 0, serialNo: 1, productName: '', unit: '', quantity: 0, required: 0 }]
  };

  totalQuantity: number = 0;
  totalRequired: number = 0;
  totalUnits: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const rawData = params.get('data');
      if (rawData) {
        this.receivedData = JSON.parse(rawData);

        if (Array.isArray(this.receivedData)) {
          this.formData.items = this.receivedData.map(item => ({
            ...item,
            formId: item.formId || 0 // Ensure formId is included for backend compatibility
          }));
        }
      }
    });
  }

  async onSubmit() {
    console.log('Form Data:', this.formData);
  
    try {
      // Send form data to backend and get the formId from the response
      const response = await this.sendFormDataToBackend(this.formData);
      
      // Capture the formId from the response
      const formId = response.id;  // Assuming the backend returns the ID as 'id'

      // Update formId for each item in the formData.items
      this.formData.items.forEach(item => {
        item.formId = formId;
      });

      // Send each item to the backend
      this.formData.items.forEach(item => {
        this.sendItemToBackend(item);
      });

      alert('Form Submitted! Check console for output.');
    } catch (error) {
      console.error('Error during form submission:', error);
      alert('An error occurred while submitting the form. Check the console for details.');
    }
  }
 
  sendFormDataToBackend(formData: any) {
    const apiUrl = 'https://localhost:44387/api/RequisitionForms/AddRequisitionForm';  // Endpoint for adding requisition form
    
    return this.http.post<any>(apiUrl, formData).toPromise(); // Now returns a promise
  }

  sendItemToBackend(item: any) {
    const apiUrl = 'https://localhost:44387/api/RequisitionItems/AddRequisitionItem';  // Endpoint for adding requisition item
    console.log('item data is ', item);
    this.http.post(apiUrl, item).subscribe(
      data => console.log('Item added successfully:', data),
      error => console.error('Error adding item:', error)
    );
  }

  calculateTotals() {
    this.totalQuantity = 0;
   

    this.formData.items.forEach(item => {
      this.totalQuantity += item.quantity || 0;
    
    });
  }

  addRow() { 
    const newSerial = this.formData.items.length + 1;
    this.formData.items.push({
      serialNo: newSerial,
      productName: '',
      unit: '',
      quantity: 0,
      required: 0,
      formId: 0 // Ensure formId exists
    });
  }

  delRow(index: number) {
    if (this.formData.items.length > 1) {
      this.formData.items.splice(index, 1);
    }
   this.calculateTotals();
  }
}
