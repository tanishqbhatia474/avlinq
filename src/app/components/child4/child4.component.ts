import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-child4',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './child4.component.html',
  styleUrls: ['./child4.component.css']
})
export class Child4Component implements OnInit {
  title = 'firstproj';

  // Form data for the requisition form
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
      formId?: number;
    }[];
  } = {
    requisitionDate: new Date().toISOString().split('T')[0],  // Format: YYYY-MM-DD
    employeeId: '',
    department: '',
    name: '',
    totalQuantity: 0,
    totalRequired: 0,
    createdAt: new Date().toISOString(),
    items: [
      { serialNo: 1, productName: '', unit: '', quantity: 0, required: 0, formId: 0 }
    ]
  };

  totalQuantity: number = 0;
  totalRequired: number = 0;
  totalUnits: number = 0;

  // API endpoint to add new stock using the StationeryItem schema
  // (This endpoint is assumed to support GET (for fetching all stock items),
  // POST (for adding new stock), and PUT (for updating an existing stock) operations.)
  private addStockApiUrl = 'https://localhost:44303/api/StationeryItems';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const rawData = params.get('data');
      if (rawData) {
        try {
          const parsed = JSON.parse(rawData);
          // If received data is an array, map it to the form items
          if (Array.isArray(parsed)) {
            this.formData.items = parsed.map(item => ({
              ...item,
              formId: item.formId || 0
            }));
          }
        } catch (e) {
          console.error('Error parsing query parameters:', e);
        }
      }
    });
  }

  // Called when the form is submitted
  onSubmit() {
    console.log('Form Data:', this.formData);

    // Validate each item; all fields must be non-empty and quantity must be > 0
    for (const item of this.formData.items) {
      if (!item.productName.trim() || !item.unit.trim() || item.quantity <= 0) {
        alert("Please ensure all fields are filled and quantity is greater than zero for each item.");
        return;
      }
    }

    // Loop through each item and process it
    this.formData.items.forEach(item => {
      this.processStockItem(item);
    });

    alert('Stock has been submitted.');
  }

  // Process each stock item: if it exists, update its quantity; if not, add a new stock item.
  processStockItem(item: any): void {
    // First, fetch all existing stationery items
    this.http.get<any[]>(this.addStockApiUrl).subscribe(
      (data) => {
        // Use case-insensitive matching for product name and unit.
        const existing = data.find(stock =>
          stock.stationery_product_name.toLowerCase() === item.productName.trim().toLowerCase() &&
          stock.stationery_unit.toLowerCase() === item.unit.trim().toLowerCase()
        );

        if (existing) {
          // Update the existing stock by adding the quantity
          existing.stationery_quantity_left += item.quantity;
          console.log('Existing stock found. Updated quantity:', existing.stationery_quantity_left);

          // Send a PUT request to update the stock
          this.http.put(`${this.addStockApiUrl}/${existing.stationery_id}`, existing).subscribe(
            (res) => {
              console.log('Stock updated successfully:', res);
            },
            (err) => {
              console.error('Error updating stock:', err);
            }
          );
        } else {
          // No matching stock found; add a new stock record.
          const newStock = {
            stationery_product_name: item.productName.trim(),
            stationery_quantity_left: item.quantity,
            stationery_unit: item.unit.trim()
          };
          console.log('No matching stock found. Adding new stock:', newStock);
          this.http.post(this.addStockApiUrl, newStock).subscribe(
            (res) => {
              console.log('Stock added successfully:', res);
            },
            (err) => {
              console.error('Error adding new stock:', err);
            }
          );
        }
      },
      (error) => {
        console.error('Error fetching existing stock items:', error);
      }
    );
  }

  // Helper method to calculate totals (if needed)
  calculateTotals() {
    this.totalQuantity = 0;
    this.totalRequired = 0;
    this.totalUnits = 0;

    this.formData.items.forEach(item => {
      this.totalQuantity += item.quantity || 0;
      this.totalRequired += item.required || 0;
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
      formId: 0
    });
  }

  delRow(index: number) {
    if (this.formData.items.length > 1) {
      this.formData.items.splice(index, 1);
    }
  }
}
