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
    // "R_001" now legitimately appears in both the FRF Relationships panel
    // and the AI Hypothesis panel below it — scope to the relationships
    // section specifically.
    const relationshipsSection = screen
      .getByText(/4\. frf relationships/i)
      .closest("section")!;
    expect(within(relationshipsSection).getByText("R_001")).toBeInTheDocument();
  });

  it("renders the on-device reasoning demo panel with labeled Observation/hypothesis/evidence for the selected parameter", async () => {
    render(<App />);

    const file = buildTestFile([
      ["Line Item", "FY2023", "FY2024"],
      ["Total Revenue", 100, 120],
      ["Debtors", 20, 40],
      ["Cash Flow from Operations", 15, 2],
    ]);

    fireEvent.change(screen.getByLabelText(/choose file/i, { selector: "input" }), {
      target: { files: [file] },
    });
    await screen.findByText(/selected: test-financials\.xlsx/i);
    fireEvent.change(screen.getByLabelText(/earlier period/i), { target: { value: "FY2023" } });
    fireEvent.change(screen.getByLabelText(/later period/i), { target: { value: "FY2024" } });
    fireEvent.click(screen.getByRole("button", { name: /run analysis/i }));

    // The panel should appear, clearly labeled as a prototype, and show
    // the three required labels for the auto-selected Revenue parameter
    // (which matches R_001 and R_003 in the seed set).
    await waitFor(() => {
      expect(screen.getByText(/5\. on-device reasoning demo/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/prototype/i)).toBeInTheDocument();

    const aiSection = screen.getByText(/5\. on-device reasoning demo/i).closest("section")!;
    expect(within(aiSection).getAllByText(/^observation$/i).length).toBeGreaterThan(0);
    expect(within(aiSection).getAllByText(/^possible hypothesis$/i).length).toBeGreaterThan(0);
    expect(within(aiSection).getAllByText(/^evidence to verify$/i).length).toBeGreaterThan(0);

    // Confirms it is explicitly disclosed as not a prediction.
    expect(within(aiSection).getByText(/not a stock prediction/i)).toBeInTheDocument();

    // Content should reflect the actual observed change (Revenue +20%),
    // proving this reads real pipeline output, not placeholder text.
    // "Revenue from Operations" appears twice within this section (once
    // per matched relationship: R_001 and R_003), which is itself proof
    // the panel is rendering per-relationship data, not a single static
    // block.
    expect(within(aiSection).getAllByText(/revenue from operations/i).length).toBe(2);
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

  it("regression: mapped parameters are not skipped when the file's period header has a trailing space", async () => {
    render(<App />);

    const file = buildTestFile([
      ["Line Item", "FY2023 ", "FY2024"], // trailing space on FY2023, mirrors the originally reported bug
      ["Total Revenue", 100, 120],
      ["Debtors", 20, 40],
      ["Cash Flow from Operations", 15, 2],
    ]);

    fireEvent.change(screen.getByLabelText(/choose file/i, { selector: "input" }), {
      target: { files: [file] },
    });
    await screen.findByText(/selected: test-financials\.xlsx/i);

    fireEvent.change(screen.getByLabelText(/earlier period/i), { target: { value: "FY2023" } });
    fireEvent.change(screen.getByLabelText(/later period/i), { target: { value: "FY2024" } });
    fireEvent.click(screen.getByRole("button", { name: /run analysis/i }));

    const changesSection = await screen.findByText(/3\. detected changes/i).then((el) => el.closest("section")!);
    // All three mapped parameters should show up as computed changes,
    // not be reported as skipped.
    expect(within(changesSection).getByText("Revenue from Operations")).toBeInTheDocument();
    expect(within(changesSection).getByText("Trade Receivables")).toBeInTheDocument();
    expect(within(changesSection).getByText("Operating Cash Flow")).toBeInTheDocument();
    expect(within(changesSection).queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows a diagnostic message (not a generic one) when the entered period doesn't match any column in the file", async () => {
    render(<App />);

    const file = buildTestFile([
      ["Line Item", "FY23", "FY24"], // different naming convention than what will be typed below
      ["Total Revenue", 100, 120],
    ]);

    fireEvent.change(screen.getByLabelText(/choose file/i, { selector: "input" }), {
      target: { files: [file] },
    });
    await screen.findByText(/selected: test-financials\.xlsx/i);

    fireEvent.change(screen.getByLabelText(/earlier period/i), { target: { value: "FY2023" } });
    fireEvent.change(screen.getByLabelText(/later period/i), { target: { value: "FY2024" } });
    fireEvent.click(screen.getByRole("button", { name: /run analysis/i }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toMatch(/match any column header/i);
    expect(alert.textContent).toContain("FY23");
    expect(alert.textContent).toContain("FY24");
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

    // "R_001" appears in both the FRF Relationships panel and the AI
    // Hypothesis panel — scope to the relationships section specifically.
    const getRelationshipsSection = () =>
      screen.getByText(/4\. frf relationships/i).closest("section")!;
    await waitFor(() => expect(within(getRelationshipsSection()).getByText("R_001")).toBeInTheDocument());

    // Click the Receivables row in the changes table specifically
    const changesSection = screen.getByText(/3\. detected changes/i).closest("section")!;
    const receivablesRow = within(changesSection).getByText("Trade Receivables").closest("tr")!;
    fireEvent.click(receivablesRow);

    await waitFor(() => {
      // R_002 (Receivables -> CFO) should now be shown in the relationships panel
      expect(within(getRelationshipsSection()).getByText("R_002")).toBeInTheDocument();
    });
  });
});
