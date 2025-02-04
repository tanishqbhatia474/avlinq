import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface StationeryItem {
  stationery_id: number;
  stationery_product_name: string;
  stationery_quantity_left: number;
  stationery_unit: string;
}

@Component({
  selector: 'app-child2',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './child2.component.html',
  styleUrls: ['./child2.component.css'],
})
export class Child2Component {
  // Store list of stationery items
  stationeryItems: StationeryItem[] = [];

  // Initialize selected item with default values
  selectedItem: StationeryItem = {
    stationery_id: 0,
    stationery_product_name: '',
    stationery_quantity_left: 0,
    stationery_unit: '',
  };

  updatedQuantity: number = 0;
  updatedUnit: string = '';

  // API endpoint URL (adjust as needed)
  private apiUrl = 'https://localhost:44303/api/StationeryItems';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchItems();
  }

  // Fetch the list of stationery items from the API
  fetchItems(): void {
    this.http.get<StationeryItem[]>(this.apiUrl).subscribe(
      (data) => {
        this.stationeryItems = data;
      },
      (error) => {
        console.error('Error fetching items:', error);
      }
    );
  }

  // When a user selects an item from the dropdown
  onSelectItem(item: StationeryItem): void {
    this.selectedItem = item;
    this.updatedQuantity = item.stationery_quantity_left;
    this.updatedUnit = item.stationery_unit;
  }

  // Update the selected item in the database
  onUpdateItem(): void {
    // Validate: Ensure product name, updated unit, and updated quantity are provided.
    if (
      !this.selectedItem.stationery_product_name.trim() ||
      !this.updatedUnit.trim() ||
      this.updatedQuantity <= 0
    ) {
      alert('All fields are mandatory and quantity must be greater than zero.');
      return;
    }

    const updatedItem = {
      ...this.selectedItem,
      stationery_quantity_left: this.updatedQuantity,
      stationery_unit: this.updatedUnit,
    };

    this.http.put<StationeryItem>(`${this.apiUrl}/${this.selectedItem.stationery_id}`, updatedItem)
      .subscribe(
        (response) => {
          alert('Stock updated successfully!');
          this.fetchItems();  // Refresh the list after update
        },
        (error) => {
          alert('Error updating stock.');
          console.error(error);
        }
      );
  }

  // Delete the selected item from the database
  onDeleteItem(): void {
    if (this.selectedItem && confirm(`Are you sure you want to delete ${this.selectedItem.stationery_product_name}?`)) {
      this.http.delete(`${this.apiUrl}/${this.selectedItem.stationery_id}`)
        .subscribe(
          () => {
            alert('Stock deleted successfully!');
            // Remove the deleted item from the local array
            this.stationeryItems = this.stationeryItems.filter(item => item.stationery_id !== this.selectedItem.stationery_id);
            // Reset the selected item
            this.selectedItem = { stationery_id: 0, stationery_product_name: '', stationery_quantity_left: 0, stationery_unit: '' };
          },
          (error) => {
            alert('Error deleting stock.');
            console.error(error);
          }
        );
    }
  }
}
