import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPackageComponent } from './add-new-package.component';

describe('AddNewPackageComponent', () => {
  let component: AddNewPackageComponent;
  let fixture: ComponentFixture<AddNewPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewPackageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
