import { Component, OnInit } from '@angular/core';
import { OdooService } from '../service/odoo-service.service';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-diseno-tabla',
  standalone: true,
  imports: [],
  templateUrl: './diseno-tabla.component.html',
  styleUrl: './diseno-tabla.component.css'
})
export class DisenoTablaComponent implements OnInit{
  
  tabla: any [] = [];
  total: number = 0;
  
  constructor(private odooConent:OdooService, private datos:DataService){}
  
  notesFunc(event: Event) {
    let row = (event.target as HTMLInputElement).closest('tr')
    console.log(row);
    this.odooConent.authenticate().subscribe(uid=>{
      
    })
  }
  fetchAll(){
    this.odooConent.authenticate().subscribe((uid:number)=>{
      this.odooConent.read(uid,['|',['firma_ventas','=',false],'&',['version_ot','>',1],['manufactura','=',false]],'dtm.odt',['id','od_number','firma_ventas','version_ot','date_in','date_rel','notes','date_disign_finish',
        'name_client','product_name','disenador']).subscribe((result:any)=>{
        this.datos.setDiseno(result);
        // Agrega los días faltantes para la fecha de entrega
        this.datos.getDiseno().forEach((val: { diferencia: number; date_disign_finish: string | number | Date; date_in: any; }) => {
          
         val.diferencia = val.date_disign_finish? Math.floor(((new Date(val.date_disign_finish)).getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24)) + 1: 0;
        });
        // Filtra del que le faltan menos días para entregar al que          
        this.tabla = this.datos.getDiseno();
        this.tabla.sort((a,b)=> a.diferencia - b.diferencia);
        this.tabla = this.datos.getDiseno();
        this.total = this.tabla.length;
      })
    })

  }
  ngOnInit(): void {
    this.fetchAll();
  }
  

}
