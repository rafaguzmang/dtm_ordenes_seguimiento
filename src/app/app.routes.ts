import { Routes } from '@angular/router';
import { OrdenesTablaComponent } from './ordenes-tabla/ordenes-tabla.component';
import { DisenoTablaComponent } from './diseno-tabla/diseno-tabla.component';

export const routes: Routes = [
    { path: '', component: OrdenesTablaComponent },
    { path: 'diseno', component: DisenoTablaComponent },
];
