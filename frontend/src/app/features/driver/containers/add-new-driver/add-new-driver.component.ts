import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DriverService } from '../../services/driver.service';
import { DriverAdd } from '../../model/driver.interface';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-new-driver',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-new-driver.component.html',
  styleUrl: './add-new-driver.component.scss'
})
export class AddNewDriverComponent {

  submitted:boolean = false;
  driverDetails = null
  addDriverForm = new FormGroup({
    driver_name: new FormControl(null, [Validators.required]),
    driver_department: new FormControl(null, [Validators.required]),
    driver_license: new FormControl(null, [Validators.required]),
    driver_isActive: new FormControl(false),
  })

  constructor(
    private driverService: DriverService,
    private router: Router,
    private activeModal: NgbActiveModal
  ){ }

  ngOnInit(){
    if(this.driverDetails !== null){
      this.addDriverForm.patchValue(this.driverDetails)
    }
  }

  submitForm(){
    this.submitted = true;
    if(this.addDriverForm.invalid){
      return
    }
    const driverDetails = this.addDriverForm.value
    if(this.driverDetails === null){
      this.driverService.addNewDriver(driverDetails as unknown as DriverAdd).subscribe((res) => {
        this.router.navigateByUrl('driver-list')
      })
    }else{
      this.activeModal.close(driverDetails)
    }
  }

}
