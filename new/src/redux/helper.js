import { Tooltip } from "react-bootstrap";
import React, { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useReactToPrint } from "react-to-print";

export function renderTooltip(message) {
  return <Tooltip id="pdf-tooltip">{message}</Tooltip>;
}

const removedProps = (obj, propsArray) => {
  propsArray.forEach((prop) => delete obj[prop]);
  return obj;
};
const propsToDelete = [
  "id",
  "guid",
  "version",
  "isDeleted",
  "createdUser",
  "createdDate",
  "updatedUser",
  "updatedDate",
];

export function exportPDF(datatoexport, exportfilename) {
  if (!datatoexport || datatoexport?.length === 0) {
    console.error("No data to export to PDF.");
    return;
  }

  const tableData = datatoexport?.map((row) => removedProps(row, propsToDelete));

  const doc = new jsPDF();
  doc.text(exportfilename, 10, 10);

  const header = Object.keys(tableData[0]);
  const objBody = tableData?.map((row) => header?.map((key) => row[key]));

  autoTable(doc, {
    head: [header],
    body: objBody,
  });

  doc.save(`${exportfilename}.pdf`);
}

export function exportExcel(datatoexport, exportfilename) {
  if (!datatoexport || datatoexport?.length === 0) {
    console.error("No data to export to Excel.");
    return;
  }

  const tableData = datatoexport?.map((row) => removedProps(row, propsToDelete));

  const ws = XLSX.utils.json_to_sheet(tableData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, exportfilename);
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, `${exportfilename}.xlsx`);
}

export function HandlePrint({ datatoPrint = [], printfilename = "Document" }) {
  // Ensure datatoPrint is an array and handle cases where it might be null or undefined
  const tableData = (Array.isArray(datatoPrint) ? datatoPrint : [])?.map(
    (row) => {
      return removedProps(row, propsToDelete);
    }
  );

  useReactToPrint({
    content: () => tableData,
    documentTitle: printfilename,
  });
}