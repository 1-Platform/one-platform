import { render } from "@testing-library/react";
import { ConsoleCodeBlock } from "./ConsoleCodeBlock";

describe("Console Code Block Component", () => {
  it("should render codeblock component", () => {
    const { getByText } = render(
      <ConsoleCodeBlock title="welcome" subTitle="step-2" />
    );
    const headingElement = getByText(/welcome/i);
    expect(headingElement).toBeInTheDocument();
  });
});
