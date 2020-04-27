import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuthDetailsComponent } from './user-auth-details.component';

describe('UserAuthDetailsComponent', () => {
  let component: UserAuthDetailsComponent;
  let fixture: ComponentFixture<UserAuthDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAuthDetailsComponent ]
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
