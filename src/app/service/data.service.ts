import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private ordenes:any[] = [];
  private diseno:any[] = [];

  private compras:any[] = [];
  

  constructor() { }

  setCompras(dato:any){
    this.compras = dato;
  }

  getCompras():any{
    return this.compras;
  }

  setDiseno(datos:any){
    this.diseno = datos;
  }

  getDiseno():any{
    return this.diseno;
  }

  setOrdenes(datos:any[]){
    this.ordenes = datos;
  }
  getOrdenes():any[]{
    return this.ordenes;
  }
}
