import { Routes,RouterModule } from '@angular/router';
import { FormsComponent } from './components/forms/forms.component';
import {AskComponent} from './components/ask/ask.component';
import { ParentComponent } from './components/parent/parent.component';

export const routes: Routes = [
    { path: 'forms', component: FormsComponent },
    { path: '', component: ParentComponent },
    { path: 'ask', component: AskComponent }
    
  
];
export const AppRoutingModule = RouterModule.forRoot(routes);
