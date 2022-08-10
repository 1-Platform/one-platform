import { fireEvent, render, screen } from '@testing-library/react';
import { useToggle } from './useToggle';

const UseToggleTest = () => {
  const [toggle, setToggle] = useToggle();

  return (
    <div>
      <button onClick={setToggle.toggle} type="button">
        Toggle
      </button>
      {toggle ? 'ON' : 'OFF'}
    </div>
  );
};

describe('UseToggleTest tests', () => {
  test('should remove protocol', () => {
    render(<UseToggleTest />);
    const btn = screen.getByText('Toggle');
    // initially false
    expect(screen.getByText(/OFF/i)).toBeDefined();
    fireEvent.click(btn);
    // now should be ON
    expect(screen.getByText(/ON/i)).toBeDefined();
    fireEvent.click(btn);
    // now should be OFF
    expect(screen.getByText(/OFF/i)).toBeDefined();
  });
});
