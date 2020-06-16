import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuthItemComponent } from './user-auth-item.component';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';

describe('UserAuthItemComponent', () => {
  let component: UserAuthItemComponent;
  let fixture: ComponentFixture<UserAuthItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserAuthItemComponent,
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
    fixture = TestBed.createComponent(UserAuthItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
