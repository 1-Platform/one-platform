import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexComponent } from './index.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { SpaNotificationsListComponent } from './spa-notifications-list/spa-notifications-list.component';
import { Apollo } from 'apollo-angular';
import { AppService } from '../app.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { notificationItemsMock } from '../mocks/notificationItems.mock';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;
  const notificationService = { getNotificationItems: jest.fn() };
  const getNotificationSpy = notificationService.getNotificationItems.mockReturnValue(
    Promise.resolve(notificationItemsMock)
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        IndexComponent,
        SpaNotificationsListComponent,
      ],
      imports: [
        RouterTestingModule,
        FormsModule,
      ],
      providers: [
        { provide: AppService, useValue: notificationService },
        Apollo,
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
