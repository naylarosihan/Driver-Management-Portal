import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PackageService } from '../../services/package.service';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-new-package',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './add-new-package.component.html',
  styleUrl: './add-new-package.component.scss'
})
export class AddNewPackageComponent {
  loadDriverName$ = new Observable<any>();
  submitted: boolean = false
  packageDetails: any = null
  addNewPackageForm = new FormGroup({
    package_title: new FormControl(null, Validators.required),
    package_weight: new FormControl(null, Validators.required),
    package_destination: new FormControl(null, Validators.required),
    package_description: new FormControl(null),
    isAllocated: new FormControl(false),
    driverID: new FormControl(null, Validators.required)
  })
  constructor(
    private packageService: PackageService,
    private router: Router,
    private activeModal: NgbActiveModal
  ){}

  ngOnInit(){
    this.loadDriverName$ = this.packageService.getAllDrivers().pipe(
      map((res: any) => {
        return res.map((data: any) => {
          return {
            name: data.driver_name,
            id: data._id
          }
        })
      })
    )
    if(this.packageDetails !== null){
      this.addNewPackageForm.patchValue(this.packageDetails)
      if(this.packageDetails.driverID !== null){
        this.addNewPackageForm.get('driverID')!.setValue(this.packageDetails?.driverID?._id)
      }
    }
  }

  submitPackage(){
    this.submitted = true
    if(this.addNewPackageForm.invalid){
      return
    }
    const driverDetails = this.addNewPackageForm.value
    if(this.packageDetails === null){
      this.packageService.addNewPackage(driverDetails).subscribe((res) => {
        this.router.navigateByUrl('package-list')
      })
    }else{
      this.activeModal.close({...driverDetails,old_driver_id:this.packageDetails?.driverID?._id})
    }
  }
}
