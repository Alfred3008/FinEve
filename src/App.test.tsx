import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import * as XLSX from "xlsx";
import App from "./App";

function buildTestFile(rows: (string | number)[][]): File {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
  return new File([buffer], "test-financials.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

describe("App — main workflow", () => {
  it("renders the upload panel on initial load", () => {
    render(<App />);
    expect(screen.getByText(/upload financial data/i)).toBeInTheDocument();
    expect(screen.getByText(/drop a file here/i)).toBeInTheDocument();
  });

  it("runs the full pipeline end to end for the worked example and displays every required field", async () => {
    render(<App />);

    const file = buildTestFile([
      ["Line Item", "FY2023", "FY2024"],
      ["Total Revenue", 100, 120],
      ["Debtors", 20, 40],
      ["Cash Flow from Operations", 15, 2],
    ]);

    const fileInput = screen.getByLabelText(/choose file/i, { selector: "input" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(await screen.findByText(/selected: test-financials\.xlsx/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/earlier period/i), { target: { value: "FY2023" } });
    fireEvent.change(screen.getByLabelText(/later period/i), { target: { value: "FY2024" } });

    fireEvent.click(screen.getByRole("button", { name: /run analysis/i }));

    // Mapping panel should show mapped items
    await waitFor(() => {
      expect(screen.getByText(/2\. parameter mapping/i)).toBeInTheDocument();
    });
    const mappingSection = screen.getByText(/2\. parameter mapping/i).closest("section")!;
    expect(within(mappingSection).getByText("Total Revenue")).toBeInTheDocument();
    expect(within(mappingSection).getByText(/trade receivables/i)).toBeInTheDocument();

    // Changes panel should show previous/current/abs/%/direction
    const changesSection = screen.getByText(/3\. detected changes/i).closest("section")!;
    expect(within(changesSection).getByText("100")).toBeInTheDocument(); // previous
    expect(within(changesSection).getByText("120")).toBeInTheDocument(); // current
    expect(
      within(changesSection).getByText((_, element) => element?.textContent === "+20%")
    ).toBeInTheDocument();
    expect(within(changesSection).getAllByText("↑").length).toBeGreaterThan(0);
    expect(within(changesSection).getAllByText("↓").length).toBeGreaterThan(0);

    // Relationships panel should auto-select the first change (Revenue,
    // which matches two relationships: R_001 to Receivables and R_003 to
    // Margin) and show explanations, evidence, and investigation path
    // for each matched relationship.
    await waitFor(() => {
      expect(screen.getAllByText(/possible explanations/i).length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText(/evidence to check/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/investigation path/i).length).toBeGreaterThan(0);
    expect(screen.getByText("R_001")).toBeInTheDocument();
  });

  it("shows unmapped items when a line item has no matching parameter", async () => {
    render(<App />);

    const file = buildTestFile([
      ["Line Item", "FY2023", "FY2024"],
      ["Total Revenue", 100, 120],
      ["Completely Unknown Line Item", 5, 6],
    ]);

    fireEvent.change(screen.getByLabelText(/choose file/i, { selector: "input" }), {
      target: { files: [file] },
    });
    await screen.findByText(/selected: test-financials\.xlsx/i);

    fireEvent.change(screen.getByLabelText(/earlier period/i), { target: { value: "FY2023" } });
    fireEvent.change(screen.getByLabelText(/later period/i), { target: { value: "FY2024" } });
    fireEvent.click(screen.getByRole("button", { name: /run analysis/i }));

    await waitFor(() => {
      expect(screen.getByText(/unmapped \(/i)).toBeInTheDocument();
    });
    const mappingSection = screen.getByText(/2\. parameter mapping/i).closest("section")!;
    expect(within(mappingSection).getByText("Completely Unknown Line Item")).toBeInTheDocument();
  });

  it("disables Run analysis until a file is selected and both periods are filled in", async () => {
    render(<App />);
    expect(screen.getByRole("button", { name: /run analysis/i })).toBeDisabled();

    const file = buildTestFile([
      ["Line Item", "FY2023", "FY2024"],
      ["Total Revenue", 100, 120],
    ]);
    fireEvent.change(screen.getByLabelText(/choose file/i, { selector: "input" }), {
      target: { files: [file] },
    });
    await screen.findByText(/selected: test-financials\.xlsx/i);

    // File selected but periods empty — still disabled
    expect(screen.getByRole("button", { name: /run analysis/i })).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/earlier period/i), { target: { value: "FY2023" } });
    fireEvent.change(screen.getByLabelText(/later period/i), { target: { value: "FY2024" } });

    expect(screen.getByRole("button", { name: /run analysis/i })).toBeEnabled();
  });

  it("lets the user select a different row and updates the relationships panel", async () => {
    render(<App />);

    const file = buildTestFile([
      ["Line Item", "FY2023", "FY2024"],
      ["Total Revenue", 100, 120],
      ["Debtors", 20, 40],
    ]);
    fireEvent.change(screen.getByLabelText(/choose file/i, { selector: "input" }), {
      target: { files: [file] },
    });
    await screen.findByText(/selected: test-financials\.xlsx/i);
    fireEvent.change(screen.getByLabelText(/earlier period/i), { target: { value: "FY2023" } });
    fireEvent.change(screen.getByLabelText(/later period/i), { target: { value: "FY2024" } });
    fireEvent.click(screen.getByRole("button", { name: /run analysis/i }));

    await waitFor(() => expect(screen.getByText("R_001")).toBeInTheDocument());

    // Click the Receivables row in the changes table specifically
    const changesSection = screen.getByText(/3\. detected changes/i).closest("section")!;
    const receivablesRow = within(changesSection).getByText("Trade Receivables").closest("tr")!;
    fireEvent.click(receivablesRow);

    await waitFor(() => {
      // R_002 (Receivables -> CFO) should now be shown
      expect(screen.getByText("R_002")).toBeInTheDocument();
    });
  });
});
