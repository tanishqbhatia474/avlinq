import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Child1Component } from '../child1/child1.component';
import { Child2Component } from '../child2/child2.component';
import { Child3Component } from '../child3/child3.component';


@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [CommonModule, Child1Component, Child2Component, Child3Component],
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent {
  selectedComponent = 'child1';

  setComponent(component: string) {
    this.selectedComponent = component;
  }
}
