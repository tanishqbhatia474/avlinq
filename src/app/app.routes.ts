import { Routes,RouterModule } from '@angular/router';
import { FormsComponent } from './components/forms/forms.component';
import {AskComponent} from './components/ask/ask.component';

export const routes: Routes = [
    { path: 'forms', component: FormsComponent },
    { path: '', component: AskComponent }
    
  
];
export const AppRoutingModule = RouterModule.forRoot(routes);
