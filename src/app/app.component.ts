import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrdenesTablaComponent } from "./ordenes-tabla/ordenes-tabla.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ OrdenesTablaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ordenes-seguimiento';
}
