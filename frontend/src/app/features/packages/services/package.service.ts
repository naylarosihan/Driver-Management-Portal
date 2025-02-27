import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  constructor(private http: HttpClient) { }

  getAllDrivers(){
    return this.http.get(environment.backendUrl + 'drivers/driver-list')
  }

  addNewPackage(data: any): Observable<{id: string, package_id: string}>{
    return this.http.post<{id: string, package_id: string}>(environment.backendUrl + 'packages/add', data)
  }

  getAllPackages(){
    return this.http.get(environment.backendUrl + 'packages/package-list')
  }

  deletePackage(id: string){
    return this.http.delete(environment.backendUrl + 'packages/delete/' + id)
  }

  updatePackageById(data: any, id: string){
    return this.http.put(environment.backendUrl + `packages/` + id, data)
  }
}
