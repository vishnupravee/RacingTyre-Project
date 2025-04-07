// /src/core/utils/reportUtils.js
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
// import dayjs from "dayjs";

// Utility function to generate table headers
const generateTableHeaders = (columns) => {
  return columns
    ?.map((col) => col.title)
    ?.filter((header) => header !== "Actions" && header !== "Sl No");
};

// Utility function to generate table body rows
const generateTableBody = (data, tableHeaders, fieldMapping) => {
  return data?.map((item) => {
    return tableHeaders?.map((header) => {
      const field = fieldMapping[header];
      let value = field?.includes(".")
        ? field.split(".").reduce((obj, key) => obj && obj[key], item)
        : item[field];

        if (field === "createdDate") {
          value = dayjs(value).format("DD-MM-YY hh:mm A"); // Format the date
        }
      return value;
    });
  });
};

// PDF Export
export const exportreportPDF = (getActiveTabData) => {
  const { data, columns, fieldMapping } = getActiveTabData();

  // Set orientation based on the number of columns (e.g., more than 5 columns -> landscape)
  const orientation = columns?.length > 10 ? "landscape" : "portrait";

  // Initialize jsPDF with the dynamic orientation
  const doc = new jsPDF({
    orientation: orientation,
  });

  // Generate table headers and body
  const tableHeaders = generateTableHeaders(columns);
  const tableBody = generateTableBody(data, tableHeaders, fieldMapping);

  // Use autoTable to export the table
  autoTable(doc, {
    head: [tableHeaders],
    body: tableBody,
  });

  // Save the PDF
  doc.save("report.pdf");
};

// Excel Export
export const exportreportExcel = (getActiveTabData) => {
  const { data, columns, fieldMapping } = getActiveTabData();

  // Generate headers and body
  const tableHeaders = generateTableHeaders(columns);
  const tableBody = generateTableBody(data, tableHeaders, fieldMapping) || [];

  // Debugging logs
  console.log("Table Headers:", tableHeaders);
  console.log("Table Body:", tableBody);

  if (!Array.isArray(tableBody)) {
    console.error("Table Body is not iterable. Ensure generateTableBody returns a 2D array.");
    return;
  }

  const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableBody]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  XLSX.writeFile(workbook, "report.xlsx");
};

// Printable format
export const printreportReport = (getActiveTabData) => {
  const { data, columns, fieldMapping } = getActiveTabData();
  const printWindow = window.open("", "_blank");

  // Prepare the document for printing
  printWindow.document.write("<html><head><title>Print Report</title>");
  printWindow.document.write("<style>");
  printWindow.document.write(`
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    `);
  printWindow.document.write("</style></head><body>");
  printWindow.document.write("<h1>Report</h1>");

  const tableHeaders = generateTableHeaders(columns);
  let tableHTML = "<table><thead><tr>";
  tableHeaders.forEach((header) => {
    tableHTML += `<th>${header}</th>`;
  });
  tableHTML += "</tr></thead><tbody>";

  const tableBody = generateTableBody(data, tableHeaders, fieldMapping);
  tableBody.forEach((row) => {
    tableHTML += "<tr>";
    row.forEach((cell) => {
      tableHTML += `<td>${cell}</td>`;
    });
    tableHTML += "</tr>";
  });
  tableHTML += "</tbody></table>";

  printWindow.document.write(tableHTML);
  printWindow.document.write("</body></html>");

  printWindow.document.close();
  printWindow.print();
};
