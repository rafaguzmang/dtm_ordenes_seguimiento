import { Component, OnInit } from '@angular/core';
import { OdooService } from '../service/odoo-service.service';
import { DataService } from '../service/data.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-ordenes-tabla',
  standalone: true,
  imports: [],
  templateUrl: './ordenes-tabla.component.html',
  styleUrl: './ordenes-tabla.component.css'
})
export class OrdenesTablaComponent implements OnInit {
  
  tabla: any[] = [];
  clientes: string[] = [];
  status: string[] = [];
  total: number = 0;
  
  constructor(
    private odoocon:OdooService,
    private datosordenes:DataService
  ){}
  
  actionRestart() {
    this.fetchOrdenes();
  }
  statusSearch($event: Event) {
    const statusVal = $event.target as HTMLInputElement;
    let newtabla:any[] = [];
    let valor:string = '';
    this.tabla.forEach(item =>{
      if(statusVal.value === 'Nesteo'){
        valor = 'aprobacion';
      }else if(statusVal.value === 'Corte'){
        valor = 'corte';
      }else if(statusVal.value === 'Revisión FAI'){
        valor = 'revision';
      }else if(statusVal.value === 'Doblado'){
        valor = 'doblado';
      }else if(statusVal.value === 'Soldadura'){
        valor = 'soldadura';
      }else if(statusVal.value === 'Maquinado'){
        valor = 'maquinado';
      }else if(statusVal.value === 'Pintura'){
        valor = 'pintura';
      }else if(statusVal.value === 'Ensamble'){
        valor = 'ensamble';
      }else if(statusVal.value === 'Calidad'){
        valor = 'calidad';
      }else if(statusVal.value === 'Instalación'){
        valor = 'instalación';
      } 
      if(valor === item.status){
        newtabla.push(item);
      }
    })
    this.tabla = [];
    this.tabla = newtabla;
    this.statusList();
  }
  
  productoSearch($event: Event) {
    const cliente = $event.target as HTMLInputElement;
    let newtabla:any[] = [];
    this.datosordenes.getOrdenes().forEach(item =>{
      if(String(item.product_name).toLowerCase().match(cliente.value)){
        newtabla.push(item);
      }
    })
    this.tabla = [];
    this.tabla = newtabla;
    this.clientesList();
    this.statusList();
  }

  ordenesSearch($event: Event) {
    const valor = $event.target as HTMLInputElement;
    let newtabla:any[] = [];
    this.datosordenes.getOrdenes().forEach(item =>{
      if(String(item.ot_number).match(valor.value)){
        newtabla.push(item);
      }
    })
    this.tabla = [];
    this.tabla = newtabla;
    this.clientesList();
    this.statusList();
  }

  clientesSearch($event: Event) {
    const cliente = $event.target as HTMLInputElement;
    let newtabla:any[] = [];
    this.tabla.forEach(item =>{
      if(cliente.value === item.name_client){
        newtabla.push(item);
      }
    })
    this.tabla = [];
    this.tabla = newtabla;
    this.clientesList();
    this.statusList();
  } 

  statusList() {
    let status:string[] = [];
    let valor:string = '';
    this.tabla.forEach(item =>{
      if(item.status === 'aprobacion'){
        valor = 'Nesteo';
      }else if(item.status === 'corte'){
        valor = 'Corte';
      }else if(item.status === 'revision'){
        valor = 'Revisión FAI';
      }else if(item.status === 'doblado'){
        valor = 'Doblado';
      }else if(item.status === 'soldadura'){
        valor = 'Soldadura';
      }else if(item.status === 'maquinado'){
        valor = 'Maquinado';
      }else if(item.status === 'pintura'){
        valor = 'Pintura';
      }else if(item.status === 'ensamble'){
        valor = 'Ensamble';
      }else if(item.status === 'calidad'){
        valor = 'Calidad';
      }else if(item.status === 'instalacion'){
        valor = 'Instalación';
      }else if(item.status === ''){
        valor = '';
      }    
        
      status.push(valor);   
    })
    this.status = Array.from(new Set(status)); 
  }     

  clientesList(){
    let clientes:string[] = []
    this.tabla.forEach(item =>{
      clientes.push(item.name_client);
    })
    this.clientes = Array.from(new Set(clientes));
  }

  fetchOrdenes(){
    this.odoocon.authenticate().subscribe(uid=>{
      this.odoocon.read(uid,[['status','!=','calidad'],['status','!=','terminado'],['status','!=','instalacion']],
        'dtm.proceso',['ot_number','status','tipe_order','name_client','product_name','create_date','po_number','date_rel']).subscribe(result=>{
          this.datosordenes.setOrdenes(result);          
          // Agrega los días faltantes para la fecha de entrega
          this.datosordenes.getOrdenes().forEach(val => {val.diferencia = Math.floor(((new Date(val.date_rel)).getTime()-(new Date()).getTime())/(1000 * 60 * 60 * 24)) + 1;});
          // Filtra del que le faltan menos días para entregar al que          
          this.tabla = this.datosordenes.getOrdenes();
          this.tabla.sort((a,b)=> a.diferencia - b.diferencia);
          this.total = this.tabla.length;
          this.clientesList();
          this.statusList();            
        })
    })
  }  
  
  ngOnInit(): void {
    this.fetchOrdenes();
  }

 

  

  

 
 
  
}


