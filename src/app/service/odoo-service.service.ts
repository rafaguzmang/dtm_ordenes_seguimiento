import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OdooService {

  private url = 'http://dtmindustry.ddns.net:8069/jsonrpc';

  constructor(private http:HttpClient) { }

 
  private call(method: string,params: any):Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: new Date().getTime() // Usa un identificador único.

    };
    return this.http.post(this.url,body,{headers})

  }

  authenticate():Observable<number>{
    let method = 'call';
    let params = {
      service: 'common',
      method: 'authenticate',
      args: ['backup', 'rafaguzmang@hotmail.com', 'admin', {}], 
    }
    return this.call(method,params).pipe(
      map((response:any)=>response.result)
    );
  }

  read(uid:number,domain:any,model:string,fields:any):Observable<any>{
    let method ='call';
    let params = {
            service: 'object',
            method: 'execute',
            args: [
              'backup',          // Base de datos
              uid,               // UID autenticado
              'admin',           // Contraseña
              model, // Nombre del modelo
              'search_read',     // Método a ejecutar
                domain, // Dominio para filtrar registros
                fields,
                0,    
            ],
          }

    return this.call(method, params).pipe(
      map((response: any) => response.result) // Transforma la respuesta y retorna solo `result`
    );
  }  
}
