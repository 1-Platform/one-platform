import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../../shared/shared.module';

import { LeaderboardCardComponent } from './leaderboard-card.component';

describe('LeaderboardCardComponent', () => {
  let component: LeaderboardCardComponent;
  let fixture: ComponentFixture<LeaderboardCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [LeaderboardCardComponent],
    imports: [SharedModule],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
