import { render, fireEvent, waitFor } from "@testing-library/react";
import ConfigureOPNavbar from ".";

describe("ConfigureSSI Page", () => {
  it("should render configure SSI page", () => {
    const { getByText } = render(<ConfigureOPNavbar />);
    const headingElement = getByText(/Configure OPC Base/i);
    expect(headingElement).toBeInTheDocument();
  });

  it("should change active theme", async () => {
    const { container } = render(<ConfigureOPNavbar />);
    let currentActiveImage = container.querySelector("img[active-theme]");
    const navOnlyThemeImage = container.querySelector("#nav-only"); // get the nav-only image button
    expect(currentActiveImage?.getAttribute("active-theme")).toEqual(
      "full-ssi"
    );
    fireEvent.click(navOnlyThemeImage!);

    await waitFor(
      () =>
        // getByRole throws an error if it cannot find an element
        container
          .querySelector("img[active-theme]")!
          .getAttribute("active-theme") === "nav-only"
    );
  });
});
