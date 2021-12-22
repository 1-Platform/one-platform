import { LHScoreLabelFormaterPipe } from './lhscore-label-formater.pipe';

describe('LHScoreLabelFormaterPipe', () => {
  const pipe = new LHScoreLabelFormaterPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format lighthouse label', () => {
    expect(pipe.transform('pwa')).toEqual('PWA');
  });

  it('should leave not lighthouse label as it is', () => {
    expect(pipe.transform('sos')).toEqual('sos');
  });
});
