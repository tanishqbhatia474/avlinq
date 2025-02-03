import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule for standalone component
import { CommonModule } from '@angular/common';

export interface StationeryItem {
  stationery_id: number;
  stationery_product_name: string;
  stationery_quantity_left: number;
  stationery_unit: string;
}

@Component({
  selector: 'app-child1',
  templateUrl: './child1.component.html',
  styleUrls: ['./child1.component.css'],
  standalone: true,   // Standalone component setting
  imports: [HttpClientModule,CommonModule],  // Import HttpClientModule to use HttpClient
})
export class Child1Component implements OnInit {
  stationeryItems: StationeryItem[] = [];  // Array to store the fetched data

  constructor(private http: HttpClient) {}  // Inject HttpClient into the constructor

  ngOnInit(): void {
    // Send a GET request to fetch the stationery items from the backend
    this.http.get<StationeryItem[]>('https://localhost:44303/api/StationeryItems') 
      .subscribe((data) => {
        this.stationeryItems = data;  // Assign the response data to the stationeryItems array
      });
  }
}
