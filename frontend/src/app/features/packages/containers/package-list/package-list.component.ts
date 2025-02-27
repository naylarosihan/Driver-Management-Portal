import { Component, inject } from '@angular/core';
import { PackageService } from '../../services/package.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNewPackageComponent } from '../add-new-package/add-new-package.component';

@Component({
  selector: 'app-package-list',
  standalone: true,
  imports: [],
  templateUrl: './package-list.component.html',
  styleUrl: './package-list.component.scss'
})
export class PackageListComponent {

  tableData: any = [
    {
      name: 'id',
      field: '_id',
      cell: (params: any) => params._id
    },
    {
      name: 'Title',
      field: 'package_title',
      cell: (params: any) => params.package_title
    },
    {
      name: 'Weight',
      field: 'package_weight',
      cell: (params: any) => params.package_weight + ' KG'
    },
    {
      name: 'Destination',
      field: 'package_destination',
      cell: (params: any) => params.package_destination
    },
    {
      name: 'Description',
      field: 'package_description',
      cell: (params: any) => params.package_description
    },
    {
      name: 'is Allocated',
      field: 'isAllocated',
      cell: (params: any) => params.isAllocated
    },
    {
      name: 'Driver Id',
      field: 'driverID',
      cell: (params: any) => params.driverID !== null ? params.driverID._id : '-'
    },
  ]

  packageList: any = []
  private modalService = inject(NgbModal);

  constructor(private packageService: PackageService){}

  ngOnInit(){
    this.getAllPackageDetails()
  }

  getAllPackageDetails(){
    this.packageService.getAllPackages().subscribe((res) => {
      this.packageList = res
    }, error => {
      console.log(error)
    })
  }

  deletePackage(data: any){
    this.packageService.deletePackage(data._id).subscribe(res => {
      this.getAllPackageDetails()
    })
  }

  updatePackage(data: any){
    const modalRef = this.modalService.open(AddNewPackageComponent)
    modalRef.componentInstance.packageDetails = data
    modalRef.result.then((res) => {
      if(res){
        const result = res
        this.packageService.updatePackageById(result, data._id).subscribe((res) => {
          this.getAllPackageDetails()
        })
      }
    })
  }

}
