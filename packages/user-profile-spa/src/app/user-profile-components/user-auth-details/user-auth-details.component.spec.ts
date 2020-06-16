import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuthDetailsComponent } from './user-auth-details.component';
import { UserAuthItemComponent } from './user-auth-item/user-auth-item.component';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';

describe('UserAuthDetailsComponent', () => {
  let component: UserAuthDetailsComponent;
  let fixture: ComponentFixture<UserAuthDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserAuthDetailsComponent,
        UserAuthItemComponent
      ],
      imports: [
        FormsModule
      ],
      providers: [
        Apollo
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAuthDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
