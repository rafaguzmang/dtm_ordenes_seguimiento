import { Component, OnInit } from '@angular/core';
import { OdooService } from '../service/odoo-service.service';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-compras-tablas',
  standalone: true,
  imports: [],
  templateUrl: './compras-tablas.component.html',
  styleUrl: './compras-tablas.component.css'
})
export class ComprasTablasComponent implements OnInit {
  
  tabla:any [] = [];
  lamina_tabla:any [] = [];
  cliente_tabla:any [] = [];
  proyecto_tabla:any [] = [];
  prioridad_tabla:any [] = [];
  proveedores_tabla:any [] = [];

  comprarFnc(orden: string,codigo:number) {  
    let ot_number =   orden.substring(0,orden.indexOf(' -'));
    this.odooserv.authenticate().subscribe(uid=>{
      this.odooserv.read(uid,[['orden_trabajo','=',ot_number],['codigo','=',codigo]],'dtm.compras.requerido',
      ['id','orden_trabajo','proveedor_id','codigo','nombre','cantidad','fecha_recepcion']).subscribe(result=>{
        // console.log(result[0].proveedor_id[1],result[0].codigo,result[0].nombre,result[0].cantidad,result[0].fecha_recepcion,result[0].orden_trabajo);
        this.odooserv.create(uid,'dtm.compras.realizado',{          
          "proveedor": result[0].proveedor_id[1],
          "codigo": result[0].codigo,
          "nombre": result[0].nombre,
          "cantidad": result[0].cantidad,
          "fecha_recepcion": result[0].fecha_recepcion,
          "orden_trabajo": result[0].orden_trabajo,
        }).subscribe(transito => {
        })
        this.odooserv.create(uid,'dtm.control.entradas',{          
          "proveedor": result[0].proveedor_id[1],
          "codigo": result[0].codigo,
          "descripcion": result[0].nombre,
          "cantidad": result[0].cantidad,
          "fecha_recepcion": result[0].fecha_recepcion,
          "orden_trabajo": result[0].orden_trabajo,
        }).subscribe(result=>console.log(result))
        this.odooserv.read(uid,[['ot_number','=',ot_number]],'dtm.odt',['id']).subscribe(resultId =>{
          this.odooserv.read(uid,[['model_id','=',resultId[0].id],['materials_list','=',codigo]],'dtm.materials.line',['id']).subscribe(materialid=>{
            this.odooserv.update(uid,materialid[0].id,'dtm.materials.line',{"comprado":true}).subscribe()
          })
        })
        this.odooserv.delete(uid,'dtm.compras.requerido',Number(result[0].id)).subscribe()
      })
    })
  }
  
  // Constructor
  constructor(
    private odooserv:OdooService,
    private datosserv:DataService){}
    
  proveedorFunc(event: Event,orden: string) {
    let element = (event.target as HTMLInputElement).closest('tr');
    let codigo = (element?.children[0] as HTMLInputElement).textContent;
    let proveedor = (event.target as HTMLSelectElement).options[(event.target as HTMLSelectElement).selectedIndex].value
    this.odooserv.authenticate().subscribe(uid=>{
      this.odooserv.read(uid,[['nombre','=',String(proveedor)]],'dtm.compras.proveedor',['id']).subscribe(resultId =>{
        console.log(resultId[0].id);
        this.odooserv.read(uid,[['orden_trabajo','=',orden.substring(0,orden.indexOf(' -'))],
        ['codigo','=',Number(codigo)]],'dtm.compras.requerido',['id']).subscribe(id =>{
          this.odooserv.update(uid,id[0].id,'dtm.compras.requerido',
            {'proveedor_id':resultId[0].id}).subscribe(result=>{
              console.log(result)
            })
        })      
      })
    })
  }
    
  sendFunc(event: Event,orden:string) {
    let element = (event.target as HTMLInputElement).closest('tr');
    let unidad = (element?.children[4].children[0].children[0] as HTMLInputElement).value;
    let total = (element?.children[5] as HTMLInputElement).textContent;
    let folio = (element?.children[6].children[0].children[0] as HTMLInputElement).value;
    let date = (element?.children[7].children[0].children[0] as HTMLInputElement).value;
    let codigo = (element?.children[0] as HTMLInputElement).textContent;
    let cantidad = (element?.children[0] as HTMLInputElement).textContent;
    console.log(unidad,total,folio,date,Number(orden.substring(0,orden.indexOf(' -'))),codigo,cantidad);
    this.odooserv.authenticate().subscribe(udi=>{
      this.odooserv.read(udi,[['orden_trabajo','=',orden.substring(0,orden.indexOf(' -'))],
      ['codigo','=',Number(codigo)]],'dtm.compras.requerido',['id']).subscribe(id =>{
        this.odooserv.update(udi,id[0].id,'dtm.compras.requerido',
          {'unitario':unidad,'costo':Number(cantidad)*Number(unidad),'orden_compra':folio,'fecha_recepcion':date}).subscribe(result=>{
            total = String(Number(cantidad)*Number(unidad)); 
          })
      })
    })
    
  }


  
  materialesFn(project:string) {
    let orden = Number(project.substring(0,project.indexOf(' -')))
    let result:any = [];
    this.tabla.forEach(row =>{
      Number(row.orden_trabajo) === orden?result.push([row.codigo,row.proveedor_id[1],
        row.nombre,row.cantidad,row.unitario,row.costo,row.aprovacion]):null;
    })
    return result;  
  }

  ordenesFn(cliente:string) {
    let result:any = [];
    this.tabla.forEach(row =>{
      row.cliente === cliente?result.push(row.orden_trabajo + ' - '+ row.proyecto):null;
    })
    result = new Set(result);    
    return result;
  }

  proveedoresList(){
    this.odooserv.authenticate().subscribe(uid=>{
      this.odooserv.read(uid,[['id','!=','0']],'dtm.compras.proveedor',['id','nombre']).subscribe(result=>{
        result.forEach((proveedor:any)=> this.proveedores_tabla.push(proveedor.nombre))
      })
    })
  }

  ngOnInit(): void {
    this.proveedoresList();
    this.odooserv.authenticate().subscribe((uid:number)=>{
      this.odooserv.read(uid,[['id','!=','0']],'dtm.compras.requerido',['id','orden_trabajo','nombre','proveedor_id','codigo','nombre',
        'cantidad','unitario','costo','orden_compra','fecha_recepcion','aprovacion']).subscribe(result=>{          
          this.datosserv.setCompras(result);    
          this.odooserv.read(uid,[['id','!=','0']],'dtm.proceso',['id','ot_number','date_rel','name_client','product_name']).subscribe((result:any)=>{
            let tabla:any[] = this.datosserv.getCompras();
            // Agrega fecha de entrega y nombre de cliente
            tabla.forEach((orden:any) => {
              result.forEach((priori:any) => {
                if( orden.orden_trabajo === priori.ot_number){
                  orden['date_rel'] = Math.floor(((new Date(priori.date_rel)).getTime()-(new Date()).getTime())/(1000 * 60 * 60 * 24));
                  orden['cliente'] = priori.name_client;
                  orden['proyecto'] = priori.product_name;
                }
              })         
            }) 

            
            // Filtra la tabla por prioridad
            tabla.forEach(dato => dato.date_rel === undefined?dato.date_rel=1000:null)
            tabla = tabla.sort((a,b) => a.date_rel - b.date_rel)
            this.prioridad_tabla = tabla;  
            this.tabla = tabla;                 
            // Obtiene los clientes
            let setTabla:any = new Set();
            this.tabla.forEach(dato => {
              dato.cliente?setTabla.add(dato.cliente):null
            })                      
            this.cliente_tabla = setTabla;
            // Obtiene las ordenes
            setTabla = new Set();
            this.tabla.forEach(dato => {
              dato.proyecto?setTabla.add(dato.orden_trabajo + ' - '+dato.proyecto):null
            }) 
            this.proyecto_tabla = setTabla;                            
          })          
        })
    })
  }

 

}


