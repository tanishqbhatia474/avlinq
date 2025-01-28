import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ask',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ask.component.html',
  styleUrls: ['./ask.component.css'], // Corrected key to styleUrls
})
export class AskComponent {
  formData = {
    company: '',
    location: '',
  };

  constructor(private router: Router) {} // Inject Router into the constructor
  
  onSubmit() {
    const formData = this.formData;
    console.log('Submitted Data:', formData);
    
  
    // Redirect to '/form' with query parameters
    this.router.navigate(['/forms'], { queryParams: { data: JSON.stringify(formData) } });

  }
  
}
