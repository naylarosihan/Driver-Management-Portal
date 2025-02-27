import { Component, inject } from '@angular/core';
import { DriverService } from '../../services/driver.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNewDriverComponent } from '../add-new-driver/add-new-driver.component';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [],
  providers: [NgbModal],
  templateUrl: './driver-list.component.html',
  styleUrl: './driver-list.component.scss'
})
export class DriverListComponent {

  tableData: any = [
    {
      name: 'id',
      field: '_id'
    },
    {
      name: 'Driver Id',
      field: 'driver_id'
    },
    {
      name: 'Name',
      field: 'driver_name'
    },
    {
      name: 'Department',
      field: 'driver_department'
    },
    {
      name: 'License',
      field: 'driver_license'
    },
    {
      name: 'is Active ?',
      field: 'driver_isActive'
    },
  ]

  private modalService = inject(NgbModal);
  driverList: any = []

  constructor(private driverService: DriverService){}

  ngOnInit(){
    this.getAllDriverDetails()
  }

  getAllDriverDetails(){
    this.driverService.getAllDrivers().subscribe((res) => {
      this.driverList = res
    }, error => {
      console.log(error);
    })
  }

  deleteDriver(data: any){
    this.driverService.deleteDriverById(data._id).subscribe(res => {
      this.getAllDriverDetails()
    })
  }

  updateDriver(data: any){
    const modalRef = this.modalService.open(AddNewDriverComponent)
    modalRef.componentInstance.driverDetails = data
    modalRef.result.then((res) => {
      if(res){
        const result = res
        this.driverService.updateDriverById(result, data._id).subscribe((res) => {
          this.getAllDriverDetails()
        })
      }
    })
  }

}
