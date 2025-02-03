import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel

export interface StationeryItem {
  stationery_id: number;
  stationery_product_name: string;
  stationery_quantity_left: number;
  stationery_unit: string;
}

@Component({
  selector: 'app-child2',
  standalone: true,  // Mark it as standalone
  imports: [CommonModule, HttpClientModule, FormsModule],  // Import necessary modules
  templateUrl: './child2.component.html',
  styleUrls: ['./child2.component.css'],
})
export class Child2Component {
  stationeryItems: StationeryItem[] = [];  // Store list of stationery items
  selectedItem: StationeryItem = {   // Initialize with default values
    stationery_id: 0,
    stationery_product_name: '',
    stationery_quantity_left: 0,
    stationery_unit: '',
  };  
  updatedQuantity: number = 0;  
  updatedUnit: string = '';  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchItems();
  }

  // Fetch the list of stationery items
  fetchItems(): void {
    this.http.get<StationeryItem[]>('https://localhost:44303/api/StationeryItems')
      .subscribe((data) => {
        this.stationeryItems = data;  
      }, error => {
        console.error('Error fetching items:', error);
      });
  }

  // When a user selects an item from the dropdown
  onSelectItem(item: StationeryItem): void {
    this.selectedItem = item;  
    this.updatedQuantity = item.stationery_quantity_left;  
    this.updatedUnit = item.stationery_unit;  
  }
   
  // Update the selected item in the database
  onUpdateItem(): void {
    if (this.selectedItem) {
      const updatedItem = {
        ...this.selectedItem,  
        stationery_quantity_left: this.updatedQuantity,  
        stationery_unit: this.updatedUnit,  
      };

      this.http.put<StationeryItem>(`https://localhost:44303/api/StationeryItems/${this.selectedItem.stationery_id}`, updatedItem)
        .subscribe(response => {
          alert('Stock updated successfully!');
          this.fetchItems();  // Refresh the list after update
        }, error => {
          alert('Error updating stock.');
          console.error(error);
        });
    }
  }

  // Delete the selected item from the database
  onDeleteItem(): void {
    if (this.selectedItem && confirm(`Are you sure you want to delete ${this.selectedItem.stationery_product_name}?`)) {
      this.http.delete(`https://localhost:44303/api/StationeryItems/${this.selectedItem.stationery_id}`)
        .subscribe(() => {
          alert('Stock deleted successfully!');
          this.stationeryItems = this.stationeryItems.filter(item => item.stationery_id !== this.selectedItem.stationery_id);
          this.selectedItem = { stationery_id: 0, stationery_product_name: '', stationery_quantity_left: 0, stationery_unit: '' };  // Reset selection
        }, error => {
          alert('Error deleting stock.');
          console.error(error);
        });
    }
  }
}
