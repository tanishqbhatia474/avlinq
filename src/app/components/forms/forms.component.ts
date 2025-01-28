import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})
export class FormsComponent {
  title = 'firstproj';

  receivedData: any = {};  
  
  formData: { 
    serial: number; 
    productName: string; 
    unit: string; 
    quantity: number; 
    required: number;
    total: number; 
  }[] = [
    { serial: 1, productName: '', unit: '', quantity: 0, required: 0, total: 0 }
  ];

  totalQuantity: number = 0;
  totalRequired: number = 0;
  totalUnits: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const rawData = params.get('data');
      if (rawData) {
        this.receivedData = JSON.parse(rawData); 
        console.log('Received Data:', this.receivedData);
        
        if (Array.isArray(this.receivedData)) {
          this.formData = this.receivedData;
        }
      }
    });
  }

  onSubmit() {
    console.log('test Data:', this.receivedData.company);
    alert('Form Submitted! Check console for output.');
  }

  calculateTotals() {
    this.totalQuantity = 0;
    this.totalRequired = 0;
    this.totalUnits = 0;

    this.formData.forEach(item => {
      item.total = (item.quantity || 0) + (item.required || 0);
      this.totalQuantity += item.quantity || 0;
      this.totalRequired += item.required || 0;
      this.totalUnits += item.total;
    });
  }

  addRow() {
    const newSerial = this.formData.length + 1;
    this.formData.push({ 
      serial: newSerial, 
      productName: '', 
      unit: '', 
      quantity: 0, 
      required: 0, 
      total: 0 
    });
  }

  delRow(index: number) {
    // Remove row at the specified index
    if (this.formData.length > 1) {
      this.formData.splice(index, 1); // Delete the row from formData array
    }
  }
}
