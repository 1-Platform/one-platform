import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AvatarComponent],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default value for avatar', () => {
    expect(component.size).toBe(50);
  });

  it('should show avatar', () => {
    component.text = 'one-platform';
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('O');
    });
  });
});
