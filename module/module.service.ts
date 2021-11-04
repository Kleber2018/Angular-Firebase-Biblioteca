import { Injectable } from '@angular/core';


import { AngularFireDatabase} from '@angular/fire/compat/database';




@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  listMedidores
 
  constructor(private db: AngularFireDatabase,) {
    this.listMedidores = db.list('medidores');
  }

 
  //retorna lista de metadados (id,valores, types)
  getMedidores() {
    return this.listMedidores.snapshotChanges(); //
  }
}