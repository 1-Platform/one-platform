import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageNotificationComponent } from './manage-notification.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppService } from '../app.service';
import { Apollo } from 'apollo-angular';


describe('ManageNotificationComponent', () => {
  let component: ManageNotificationComponent;
  let fixture: ComponentFixture<ManageNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageNotificationComponent ],
      imports: [
        RouterTestingModule,
        FormsModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      providers: [
        AppService,
        Apollo
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
