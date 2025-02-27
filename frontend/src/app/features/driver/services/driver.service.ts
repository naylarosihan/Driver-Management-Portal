import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DriverAdd } from '../model/driver.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(private http: HttpClient) { }

  addNewDriver(data: DriverAdd): Observable<{id: string, driver_id: string}>{
    return this.http.post<{id: string, driver_id: string}>(environment.backendUrl + 'drivers/add', data)
  }

  getAllDrivers(){
    return this.http.get(environment.backendUrl + 'drivers/driver-list')
  }

  deleteDriverById(id: string){
    return this.http.delete(environment.backendUrl + 'drivers/delete/'+id)
  }

  updateDriverById(data: any, id: string){
    return this.http.put(environment.backendUrl + `drivers/` + id, data)
  }

}
