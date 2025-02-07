import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private ordenes:any[] = [];
  constructor() { }

  setOrdenes(datos:any[]){
    this.ordenes = datos;
  }
  getOrdenes():any[]{
    return this.ordenes;
  }
}
