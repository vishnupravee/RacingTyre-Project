import React, { useEffect } from "react";
import { OverlayTrigger } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { ChevronUp } from "feather-icons-react/build/IconComponents";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { renderTooltip } from "../../../redux/helper";
const Report3 = ({ data = [], handleClose }) => {
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
    
    const lineHeight = 9; // Space between lines
    let y = 20; // Starting Y-position
    const pageHeight = doc.internal.pageSize.height; // Get the height of the page
  
    doc.setFontSize(16);
    doc.text("Tyre Rejection Report", 20, y);
    y += 20; // Add space after the title
  
    data.forEach((val, index) => {
      // Check if we need to add a new page
      if (y + 60 > pageHeight) {
        doc.addPage(); // Create a new page
        y = 20; // Reset Y-position for the new page
      }
  
      // Use a smaller font for content
      doc.setFontSize(12);
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
  
      // Adding Tyre details
      Object.keys(val)
        .filter(key => key.startsWith('tyre') && key !== 'tyreGuId')
        .forEach((key, idx) => {
          if (y + lineHeight > pageHeight) {
            doc.addPage(); // Add a new page if there's no space left
            y = 20; // Reset Y-position for the new page
          }
          doc.text(`${key}: ${val[key]}`, 20, y);
          y += lineHeight;
        });
  
      // Add some space before the next entry
      y += 5;
    });
  
    // Save the PDF document
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
                    <h4>Tyre Rejection Report</h4>
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
                <button onClick={generatePDF}   className="btn btn-link bg-white rounded-lg border border-silver" >
                    <ImageWithBasePath
                      src="assets/img/icons/pdf.svg"
                      alt="img"
                    />
                  </button>
                </OverlayTrigger>
              </li>
              
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip("Print")}>
                <button onClick={printReport}   className="btn btn-link bg-white rounded-lg border border-silver">
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
        <table className="table table-bordered table-dark ">
        <thead className="table-light align-middle text-center">
                                    <tr>
                                      <th colSpan={2}>Tyre Information</th>
                                    </tr>
                                  </thead>
          <tbody>
            {Array.from({ length: 16 }, (_, i) => (
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

export default Report3;