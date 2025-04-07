import React, { useEffect } from "react";
import { OverlayTrigger } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { ChevronUp } from "feather-icons-react/build/IconComponents";

import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { renderTooltip } from "../../../redux/helper";
const Report2 = ({ data = [], handleClose }) => {
  const { register, setValue, reset, handleSubmit } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Reset form values with provided data
  const resetmodal = () => {
    if (data) {
      reset(data);
    } else {
      reset();
    }
  };

  useEffect(() => {
    resetmodal();
  }, [data, reset]);

  // Form submission handler
  const onSubmit = (formData) => {
    console.log("Form Submitted: ", formData);
  };
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [210, 390] // A custom height of 350mm
    });
    
    let y = 10; // Start position for text
    const lineHeight = 9; // Line height for each text
    const pageHeight = doc.internal.pageSize.height; // Height of the page
  
    doc.setFontSize(16);
    doc.text("Tyre Scanning Report", 20, y);
    y += 10;
  
    data.forEach((val, index) => {
      if (y + 50 > pageHeight) {
        // If content exceeds page height, add a new page
        doc.addPage();
        y = 10; // Reset Y position
      }
  
      doc.setFontSize(12);
      doc.text(`Entry ${index + 1}`, 20, y);
      y += lineHeight;
  
      doc.setFontSize(10);
      doc.text(`Date: ${val.createdDate}`, 20, y);
      y += lineHeight;
      doc.text(`Racer Name: ${val.racerName}`, 20, y);
      y += lineHeight;
      doc.text(`Event: ${val.eventName}`, 20, y);
      y += lineHeight;
      doc.text(`Race No: ${val.racerNumber}`, 20, y);
      y += lineHeight;
      doc.text(`Category: ${val.category}`, 20, y);
      y += lineHeight;
      doc.text(`Remarks: ${val.remarks}`, 20, y);
      y += lineHeight;
  
      // Add tyre details
      Object.keys(val)
      .filter(key => key.startsWith('tyre') && key !== 'tyreGuId') // Exclude 'tyreGuId'
      .forEach((key, idx) => {
        if (y + lineHeight > pageHeight) {
          doc.addPage();
          y = 20;
        }
        doc.text(`${key}: ${val[key]}`, 20, y);
        y += lineHeight;
      });

     
  
     
    });
  
    doc.save("report.pdf");
  };
  

  // Generate Excel
  
 

  const printReport = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write("<html><head><title>Tyre Issue Report</title></head><body>");
    printWindow.document.write("<h1>Tyre Issue Report</h1>");
    data.forEach((val, index) => {
      printWindow.document.write(`<p><strong>Racer Name:</strong> ${val.racerName}</p>`);
      printWindow.document.write(`<p><strong>Event:</strong> ${val.eventName}</p>`);
      printWindow.document.write(`<p><strong>Race No:</strong> ${val.racerNumber}</p>`);
      printWindow.document.write(`<p><strong>Category:</strong> ${val.category}</p>`);
      printWindow.document.write(`<p><strong>Remarks:</strong> ${val.remarks}</p>`);
      Object.keys(val).filter(key => key.startsWith('tyre') && key !== 'tyreGuId').forEach((key) => {
        printWindow.document.write(`<p><strong>${key}:</strong> ${val[key]}</p>`);
      });
      printWindow.document.write("<hr>");
    });
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };
  
  return (
    <div>
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Tyre Scanning Report</h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    aria-label="Close"
                    onClick={handleClose}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="">
                <ul className="table-top-head">
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip("PDF")}>
                <button onClick={generatePDF}  className="btn btn-link bg-white rounded-lg border border-silver" >
                    <ImageWithBasePath
                      src="assets/img/icons/pdf.svg"
                      alt="img"
                    />
                  </button>
                </OverlayTrigger>
              </li>
             
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip("Print")}>
                <button onClick={printReport}  className="btn btn-link bg-white rounded-lg border border-silver">
                    <i data-feather="printer" className="feather-printer" />
                  </button>
                </OverlayTrigger>
              </li>
              
              
            </ul>
            </div>
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                    <div className="col-lg-12">
                    <div className="input-blocks">
  {data &&
    Array.isArray(data) &&
    data.map((val, index) => (
      <div key={index} className="racer-info">
        <p>Racer Name: {val.racerName}</p>
        <p>Event: {val.eventName}</p>
        <p>Race No: {val.racerNumber}</p>
        <p>Category: {val.category}</p>
        <p>Status: {val.remarks}</p>
        <table className="table table-bordered table-dark">
        <thead className="table-light align-middle text-center">
                                    <tr>
                                      <th colSpan={2}>Tyre Information</th>
                                    </tr>
                                  </thead>
          <tbody>
            {Array.from({ length: 2 }, (_, i) => (
              <tr key={i}>
                <td>{`Tyre ${i * 2 + 1} = ${val[`tyre${i * 2 + 1}`] || 'N/A'}`}</td>
                <td>{`Tyre ${i * 2 + 2} = ${val[`tyre${i * 2 + 2}`] || 'N/A'}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
</div>

</div>
                     
                      
                     
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report2;
