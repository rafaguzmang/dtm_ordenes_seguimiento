import { Component, OnInit } from '@angular/core';
import { OdooService } from '../service/odoo-service.service';
import { DataService } from '../service/data.service';

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
  nesteo: number = 0;
  retrazo: number = 0;
  urgente: number = 0;
  total: number = 0;
  ordenes: number = 0;
  calidad: number = 0;
  terminado: number = 0;
  instalacion: number = 0;
  tardia: number = 0;
  nostatus: number = 0;
  
  constructor(
    private odoocon:OdooService,
    private datosordenes:DataService
  ){}

  statusSearch($event: Event) {
    const statusVal = $event.target as HTMLInputElement;
    let newtabla:any[] = [];
    let valor:string = '';
    console.log(statusVal.value);
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
        console.log(valor,item.status);
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

  ordenesNinguno() {
    let newtabla:any = [];
    this.datosordenes.getOrdenes().forEach(val =>{
      if (val.status === false){
        newtabla.push(val);
      }
    });
    this.tabla = [];
    this.tabla = newtabla;
    this.clientesList();
    this.statusList();
  }

  ordenesInstalacion() {
    let newtabla:any = [];
    this.datosordenes.getOrdenes().forEach(val =>{
      if (val.status === 'instalacion'){
        newtabla.push(val);
      }
    });
    this.tabla = [];
    this.tabla = newtabla;
    this.clientesList();
    this.statusList();
  }

  ordenesCalidad() {
    let newtabla:any = [];
    this.datosordenes.getOrdenes().forEach(val =>{
      if (val.status === 'calidad'){
        newtabla.push(val);
      }
    });
    this.tabla = [];
    this.tabla = newtabla;  
    this.clientesList();
    this.statusList();
  }

  ordenesSinFactura() {
    let newtabla:any = [];
    this.datosordenes.getOrdenes().forEach(val =>{
      if (val.status === 'terminado'){
        newtabla.push(val);
      }
    });
    this.tabla = [];
    this.tabla = newtabla;
    this.clientesList();
    this.statusList();
  }

  ordenesTotal() {
    this.tabla = [];
    this.tabla = this.datosordenes.getOrdenes();
    this.clientesList();
    this.statusList();
  }

  ordenesTardia() {
    let newtabla:any = [];
    this.datosordenes.getOrdenes().forEach(val=>{ 
      if ((val.status === 'aprobacion' || val.status === false) && Number(new Date(val.date_rel))-4 <= Number(new Date())){
        newtabla.push(val);
      }
    })    
    this.tabla = [];
    this.tabla = newtabla;
    this.clientesList();
    this.statusList();

  }

  ordenesUrgente() {
    let newtabla:any = [];
    let criterio = ['calidad','terminado','instalacion',false];
    this.datosordenes.getOrdenes().forEach(val=>{
      if ((Number(new Date(val.date_rel))-4 <= Number(new Date())) && criterio.indexOf(val.status)===-1){        
        newtabla.push(val);
      }
    })
    this.tabla = [];
    this.tabla = newtabla;
    this.clientesList();
    this.statusList();

  }

  ordenesRetrazo() {
    let newtabla:any = [];
    let criterio = ['calidad','terminado','instalacion',false];
    this.datosordenes.getOrdenes().forEach(val=>{
      if (((new Date(val.date_rel)) < (new Date(val.create_date))) && criterio.indexOf(val.status)===-1 ){        
        newtabla.push(val);
      }
    })
    this.tabla = [];
    this.tabla = newtabla;
    this.clientesList();
    this.statusList();
    
  }

  ordenesNesteo() {    
    let newtabla:any = [];
    this.datosordenes.getOrdenes().forEach(item =>{
        if(item.status==='aprobacion'){
          newtabla.push(item);
        }
    })
    this.tabla = [];
    this.tabla = newtabla;
    this.clientesList();
    this.statusList();
  }

  ordenesFiltro() {
    let newtabla:any = [];
    let criterio = ['calidad','terminado','instalacion',false];
    this.datosordenes.getOrdenes().forEach(item =>{
        if(criterio.indexOf(item.status)===-1){
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
      this.odoocon.read(uid,[['id','!=',0]],
        'dtm.proceso',['ot_number','status','tipe_order','name_client','product_name','create_date','po_number','date_rel']).subscribe(result=>{
          this.datosordenes.setOrdenes(result);
          this.tabla = this.datosordenes.getOrdenes();
          this.total = this.tabla.length;   
          this.nesteo = this.contador('aprobacion'); 
          this.calidad = this.contador('calidad');
          this.terminado = this.contador('terminado');
          this.instalacion = this.contador('instalacion');      
          this.nostatus = this.contador('false');
          this.ordenes = this.tabla.length - this.calidad - this.terminado -this.instalacion - this.nostatus;
          this.retrazo =  this.retrazoComp();
          this.urgente = this.urgenteComp();
          this.tardia = this.tardiaComp();
          this.clientesList();
          this.statusList();
        })
    })
  }
  
  ngOnInit(): void {
    this.fetchOrdenes();
  }

  contador(tipo:string):number{
    let contador = 0;
    this.tabla.forEach(val =>{
      if (tipo === 'false'){
        if(val.status === false){
          contador++;
        }

      } else if(val.status === tipo){
        contador++;
      }
    });
    return contador;
  }

  retrazoComp():number{
    let contador = 0;
    let criterio = ['calidad','terminado','instalacion',false];
    this.tabla.forEach(val=>{
      if (((new Date(val.date_rel)) < (new Date(val.create_date))) && criterio.indexOf(val.status)===-1){        
        contador++;
      }
    })
    return contador;
  }

  urgenteComp():number{
    let contador = 0;
    let criterio = ['calidad','terminado','instalacion',false];
    this.tabla.forEach(val=>{
      if ((Number(new Date(val.date_rel))-4 <= Number(new Date())) && criterio.indexOf(val.status)===-1 ){        
        contador++;
      }
    })
    return contador;
  }

  tardiaComp():number{
    let contador = 0;
    let criterio = ['calidad','terminado','instalacion',false];
    this.tabla.forEach(val=>{ 
      if (((val.status === 'aprobacion' || val.status === false) && Number(new Date(val.date_rel))-4 <= Number(new Date())) && criterio.indexOf(val.status)===-1 ){
        contador++;
      }
    })    
    return contador;
  }
 
  
}


