import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-child3',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './child3.component.html',
  styleUrls: ['./child3.component.css'],
})
export class Child3Component implements OnInit {
  requisitionForms: any[] = []; // Array to store the fetched requisition forms

  // API endpoints (adjust these URLs according to your environment)
  private requisitionFormsApiUrl = 'https://localhost:44387/api/RequisitionForms';
  private stationeryApiUrl = 'https://localhost:44303/api/StationeryItems';
  private requisitionItemsApiUrl = 'https://localhost:44387/api/RequisitionItems';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRequisitionForms();
  }

  fetchRequisitionForms(): void {
    this.http.get<any[]>(this.requisitionFormsApiUrl).subscribe(
      (data) => {
        console.log('Requisition Forms fetched:', data);
        this.requisitionForms = data;
      },
      (error) => {
        console.error('Error fetching requisition forms:', error);
      }
    );
  }

  onApprove(item: any): void {
    console.log('Approve clicked for requisition item:', item);

    // Fetch all stationery items
    this.http.get<any[]>(this.stationeryApiUrl).subscribe(
      (stationeryItems) => {
        console.log('Stationery Items fetched:', stationeryItems);
        // Find matching stationery item using case-insensitive comparisons.
        const matchingItem = stationeryItems.find((stationeryItem) =>
          stationeryItem.stationery_product_name.toLowerCase() === item.productName.toLowerCase() &&
          stationeryItem.stationery_unit.toLowerCase() === item.unit.toLowerCase() &&
          stationeryItem.stationery_quantity_left >= item.quantity // Ensure enough stock
        );

        if (matchingItem) {
          console.log('Matching stationery item found:', matchingItem);
          // Update the stationery item quantity and then delete the requisition item.
          this.updateStationeryItem(matchingItem, item.quantity, item.id);
        } else {
          alert('No matching stationery item found or insufficient quantity.');
        }
      },
      (error) => {
        console.error('Error fetching stationery items:', error);
      }
    );
  }

  // Update the matching stationery item quantity by subtracting the approved quantity.
  // Then delete the approved requisition item.
  updateStationeryItem(matchingItem: any, quantityToSubtract: number, requisitionItemId: number): void {
    matchingItem.stationery_quantity_left -= quantityToSubtract;
    console.log('Updated stationery item to be sent:', matchingItem);

    this.http.put(`${this.stationeryApiUrl}/${matchingItem.stationery_id}`, matchingItem).subscribe(
      (response) => {
        console.log('Stationery item updated successfully:', response);
        // After successfully updating the stationery item, delete the requisition item.
        this.deleteRequisitionItem(requisitionItemId);
      },
      (error) => {
        console.error('Error updating stationery item:', error);
      }
    );
  }

  // Delete the approved requisition item from the backend.
  deleteRequisitionItem(itemId: number): void {
    this.http.delete(`${this.requisitionItemsApiUrl}/${itemId}`, { responseType: 'text' }).subscribe(
      (response) => {
        console.log('Requisition item deleted successfully:', response);
        // Optionally, refresh the requisition forms list if necessary.
        this.fetchRequisitionForms();
      },
      (error) => {
        console.error('Error deleting requisition item:', error);
      }
    );
  }
}
