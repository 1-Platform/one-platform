import { TimelineScoreFormaterPipe } from './timeline-score-formater.pipe';

const mock = new Array(5).fill({
  id: 1,
  branch: 'main',
  projectId: 1,
  updatedAt: '1639634613428',
  score: {
    pwa: 50,
    accessibility: 55,
    seo: 60,
    bestPractices: 65,
    performance: 70,
  },
});

const mockWithScoreNull = new Array(5).fill({
  id: 1,
  branch: 'main',
  projectId: 1,
  updatedAt: '1639634613428',
  score: null,
});

describe('TimelineScoreFormaterPipe', () => {
  const pipe = new TimelineScoreFormaterPipe('en-US');
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transform data', () => {
    const data = pipe.transform(mock);
    expect(data.length).toBe(5);
    expect(data[0].name).toBe('Accessibility');
    expect(data[0].series.length).toBe(5);
    expect(data[0].series[0].name).toBe('Dec-16, 11:33');
    expect(data[0].series[0].value).toBe(55);
  });

  it('transform data on score null', () => {
    const data = pipe.transform(mockWithScoreNull);
    expect(data.length).toBe(5);
    expect(data[0].name).toBe('Accessibility');
    expect(data[0].series.length).toBe(0);
  });
});
