import { Routes } from '@angular/router';
import { OrdenesTablaComponent } from './ordenes-tabla/ordenes-tabla.component';
import { DisenoTablaComponent } from './diseno-tabla/diseno-tabla.component';
import { ComprasTablasComponent } from './compras-tablas/compras-tablas.component';
import { ComprasAprobacionComponent } from './compras-aprobacion/compras-aprobacion.component';

export const routes: Routes = [
    { path: 'compras', component: ComprasTablasComponent},
    { path: '', component: OrdenesTablaComponent },
    { path: 'diseno', component: DisenoTablaComponent },
    { path: 'aprovacioncompras', component: ComprasAprobacionComponent },
];
