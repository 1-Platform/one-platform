import { LeaderboardLabelFormaterPipe } from './leaderboard-label-formater.pipe';
import { LeaderboardCategory } from '../enum';

describe('LeaderboardLabelFormaterPipe', () => {
  const pipe = new LeaderboardLabelFormaterPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transform text to titlecase', () => {
    expect(pipe.transform(LeaderboardCategory.ACCESSIBILITY)).toBe(
      'Accessibility'
    );
  });

  it('transform text with _ titlecase', () => {
    expect(pipe.transform(LeaderboardCategory.BEST_PRACTICES)).toBe(
      'Best Practices'
    );
  });

  it('should not transform SEO and PWA', () => {
    expect(pipe.transform(LeaderboardCategory.SEO)).toBe(
      LeaderboardCategory.SEO
    );
    expect(pipe.transform(LeaderboardCategory.PWA)).toBe(
      LeaderboardCategory.PWA
    );
  });
});
