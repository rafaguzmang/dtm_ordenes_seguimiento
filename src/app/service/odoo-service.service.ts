import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OdooService {

  private url = 'http://localhost:8069/jsonrpc';

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

  update(uid:number,id:number,model:string,campos:any):Observable<any>{
    // console.log(uid,id,localizacion,cantidad,apartado,disponible)
    let method ='call';
    let params = {
          service: 'object',
          method: 'execute',
          args:  [
            "backup",     // Nombre de la base de datos
            uid,                          // ID del usuario que ejecuta la acción (Admin usualmente es 2)
            "admin",               // Contraseña del usuario
            model,        // Nombre del modelo (por ejemplo, 'res.partner')
            "write",                    // Método a ejecutar
            [id],
            campos] // Base de datos, usuario, contraseña, contexto
        }

    return this.call(method, params).pipe(
      map((response: any) => response.result) // Transforma la respuesta y retorna solo `result`
    );
  }

  create(uid:number,model:string,task_args:any):Observable<any>{
    // console.log(uid,id,localizacion,cantidad,apartado,disponible)
    let method ='call';
    let params = {
          service: 'object',
          method: 'execute',
          args:  [
            "backup",     // Nombre de la base de datos
            uid,                          // ID del usuario que ejecuta la acción (Admin usualmente es 2)
            "admin",               // Contraseña del usuario
            model,        // Nombre del modelo (por ejemplo, 'res.partner')
            "create",                    // Método a ejecutar
            task_args]
        }
    return this.call(method, params).pipe(
      map((response: any) => response.result) // Transforma la respuesta y retorna solo `result`
    );
  }
  
  delete(uid:number,model:string,idUnlik:any):Observable<any>{
    // console.log(uid,id,localizacion,cantidad,apartado,disponible)
    let method ='call';
    let params = {
          service: 'object',
          method: 'execute',
          args:  [
            "backup",     // Nombre de la base de datos
            uid,                          // ID del usuario que ejecuta la acción (Admin usualmente es 2)
            "admin",               // Contraseña del usuario
            model,        // Nombre del modelo (por ejemplo, 'res.partner')
            "unlink",                    // Método a ejecutar
            idUnlik]
        }
    return this.call(method, params).pipe(
      map((response: any) => response.result) // Transforma la respuesta y retorna solo `result`
    );
  }

}
