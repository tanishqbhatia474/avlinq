import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-child3',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // Import HttpClientModule directly
  templateUrl: './child3.component.html',
  styleUrls: ['./child3.component.css'],
})
export class Child3Component implements OnInit {
  requisitionForms: any[] = []; // Array to store the fetched data
  private apiUrl = 'https://localhost:44387/api/RequisitionForms'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRequisitionForms();
  }

  fetchRequisitionForms(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.requisitionForms = data;
      },
      (error) => {
        console.error('Error fetching requisition forms:', error);
      }
    );
  }
  onApprove(item: any): void {
   
    console.log('Approved item:', item);

    
    item.approved = true; 
  }
}
