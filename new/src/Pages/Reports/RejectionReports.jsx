
import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { exportreportExcel, exportreportPDF, printreportReport } from "../../core/utils/MainReportUtils";
import { renderTooltip } from "../../redux/helper";
import { format } from 'date-fns';
import {
    
    Calendar,
  ChevronUp,

  
  RotateCcw,

  
  
} from "feather-icons-react/build/IconComponents";
// import { setToogleHeader } from "../../core/redux/action";
// import { useDispatch, useSelector } from "react-redux";
import Table from "../../core/pagination/datatable";
import { DatePicker, Select } from "antd";
import { getRejectionReportList, getRejectionTyreSubReportguid } from "../../core/services/ReportApiServices";
import { useDispatch, useSelector } from "react-redux";
import { fetchcategory } from "../../redux/masterfetch";
import Report3 from "./AddViewReports/Report3";
const RejectionReports = () => {
  const[viewData,setViewData] = useState("")
  const[tyreReportData,setTyreReportData] = useState()
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fullname, setfullname] = useState(null);
  const [racerNo, setracerNo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const dispatch = useDispatch()
const { formatedCategoryList } = useSelector((state) => state.master);
const [sortDirection, setSortDirection] = useState("asc");
const toggleSortOrder = () => {
  setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
};
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  useEffect(() => {
    handleRejectionReportList();
    dispatch(fetchcategory())
  }, []);
  const modifiedList = Array.isArray(tyreReportData)
  ? tyreReportData?.filter((value) =>
      value.racerName?.toLowerCase().includes(searchText?.toLowerCase())
    )
  : [];

  const handleFilter=()=>{
    handleRejectionReportList()
  }

  function handleReset() {
   
    setSelectedCategory(null);
    
    setSearchText("");
    setfullname(""),
    setracerNo("")
  }

  const handleRejectionReportList = async () => {
    setIsLoading(true); // Set loader to true before fetching data
    try {
      const response = await getRejectionReportList(selectedCategory,fullname,racerNo);
      if (Array.isArray(response.listTyreVerificationReport)) {
        const sortedEvents = response.listTyreVerificationReport.sort((a, b) =>
          sortDirection === "asc"
            ? a.racerNumber.localeCompare(b.racerNumber)
            : b.racerNumber.localeCompare(a.racerNumber)
        );
        setTyreReportData(sortedEvents);
      } else {
        setTyreReportData([]);
      }
    } catch (error) {
      console.log(error?.response?.data?.Message || "Something went wrong");
      setTyreReportData([]);
    }finally {
      setIsLoading(false); // Set loader to false after fetching data
    }
  };
  // const getActiveTabData = () => {

  //   let fieldMapping = {};
  
  //   // Function to create the field mapping between column titles and dataIndex values
  //   const createfieldMapping = (columns) => {
  //     const mappings = {};
  //     columns.forEach((col) => {
  //       mappings[col.title] = col.dataIndex; // Map title to dataIndex
  //     });
  //     return mappings;
  //   };
  
  //   // Generate the field mapping for the current columns
  //   fieldMapping = createfieldMapping(columns);
    
  //   console.log("fieldMapping of first table:", fieldMapping);         
  //   console.log("salesData of  table:", tyreReportData);         
  
  //   // Return the filtered data, columns, and field mapping
  //   return { data: tyreReportData, columns: columns, fieldMapping };
  // };
  const getActiveTabData = () => {
    let fieldMapping = {};
  
    // Function to create the field mapping between column titles and dataIndex values
    const createFieldMapping = (columns) => {
      const mappings = {};
      columns.forEach((col) => {
        mappings[col.title] = col.dataIndex; // Map title to dataIndex
      });
      return mappings;
    };
  
    // Function to format date fields
    const formatDate = (date) => {
      if (!date) return ""; // Handle empty or null dates
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };
  
    // Apply date formatting to the data if needed
    const formattedData = tyreReportData.map((record) => {
      const updatedRecord = { ...record };
      Object.keys(updatedRecord).forEach((key) => {
        // Check if the field is a date field (customize the condition based on your data structure)
        if (key.toLowerCase().includes("date") && updatedRecord[key]) {
          updatedRecord[key] = formatDate(updatedRecord[key]);
        }
      });
      return updatedRecord;
    });
  
    // Generate the field mapping for the current columns
    fieldMapping = createFieldMapping(columns);
  
    console.log("fieldMapping of first table:", fieldMapping);
    console.log("salesData of table:", formattedData);
  
    // Return the filtered data, columns, and field mapping
    return { data: formattedData, columns, fieldMapping };
  };
  
  const handleVeiwClick = async (guid) => {
    console.log(guid);
    
    try {
      const response = await getRejectionTyreSubReportguid(guid);
      console.log(response.listTyreVerificationReport,"reeeeeeep");
      
      setViewData(response.listTyreVerificationReport); // Set the data for editing
       // Set the modal mode to 'edit'
       setModalOpen(true); // Open the modal
    } catch (error) {
      console.error(
        "Error fetching Tyre by GUID:",
        error?.response?.data?.Message || "something went wrong"
      );
    }
  };
  
  const handleRefresh = () => {
    handleRejectionReportList()// Reset the data to initialEventData
  };
  const columns = [
    {
      title: "Date",
      dataIndex: "createdDate",
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
      render: (date) => format(new Date(date), 'MM/dd/yyyy'),
    },
    {
      title: "Race No",
      dataIndex: "racerNumber",
      sorter: (a, b) => a.racerNumber.length - b.racerNumber.length,
    },
    {
      title: "Name",
      dataIndex: "racerName", 
      sorter: (a, b) => a.racerName.length - b.racerName.length,
    },
    {
      title: "category",
      dataIndex: "categoryName",
      sorter: (a, b) => a.categoryName.length - b.categoryName.length,
    },
   
    {
      title: "Remarks",
      dataIndex: "remarks",
      sorter: (a, b) => a.remarks.length - b.remarks.length,
    },
    {
      title: " ",
      dataIndex: "",
      render: (_, record) => (
        <div key={record.id}>
            <button className="btn btn-submit"
            onClick={() => handleVeiwClick(record.tyreGuId)}
          >
            View
          </button>
          {/* <input type="checkbox" onChange={()=>handleSelectSection(record.guid)} checked={record.guid==sectionId} /> */}
        </div>
      )
    },
  
  ];
  // const dispatch = useDispatch();
  // const data = useSelector((state) => state.toggle_header);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };
 


 

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header transfer">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Rejection Reports</h4>
                <h6>Manage your Reports</h6>
              </div>
            </div>
            <ul className="table-top-head">
            <li>
                <OverlayTrigger placement="top" overlay={renderTooltip("PDF")}>
                <button onClick={() => exportreportPDF(getActiveTabData)}  className="btn btn-link bg-white rounded-lg border border-silver" >
                    <ImageWithBasePath
                      src="assets/img/icons/pdf.svg"
                      alt="img"
                    />
                  </button>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top"  overlay={renderTooltip("Excel")}>
                <button onClick={() => exportreportExcel(getActiveTabData)} className="btn btn-link bg-white rounded-lg border border-silver">
                    <ImageWithBasePath
                      src="assets/img/icons/excel.svg"
                      alt="excel-icon"
                    />
                  </button>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip("Print")}>
                <button onClick={() => printreportReport(getActiveTabData)}  className="btn btn-link bg-white rounded-lg border border-silver">
                    <i data-feather="printer" className="feather-printer" />
                  </button>
                </OverlayTrigger>
              </li>
             
             
            </ul>
          
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-top">
                <div className="search-set">
                  <div className="search-input">
                    <Link to="#" className="btn btn-searchset">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-search"
                      >
                        <circle cx={11} cy={11} r={8} />
                        <line x1={21} y1={21} x2="16.65" y2="16.65" />
                      </svg>
                    </Link>
                    <div
                      id="DataTables_Table_0_filter"
                      className="dataTables_filter"
                    >
                      <label>
                        {" "}
                        <input
                          type="search"
                          className="form-control form-control-sm"
                          placeholder="Search"
                          aria-controls="DataTables_Table_0"
                          value={searchText}
                          onChange={handleSearch}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                
                
              </div>
              {/* /Filter */}
              <div
                className={`card${isFilterVisible ? " visible" : ""}`}
                id="filter_inputs"
                style={{ display: isFilterVisible ? "block" : "none" }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-4 col-sm-6 col-12 ms-auto">
                      <div className="input-blocks">
                        <Link className="btn btn-filters ms-auto">
                          {" "}
                          <i
                            data-feather="search"
                            className="feather-search"
                          />{" "}
                          Search{" "}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary d-flex align-items-center position-absolute top-0 end-0 p-2 m-2" 
              onClick={handleRefresh}> 
              <RotateCcw />
              </button>
              <div className="card-body pb-0">
  <div className="row m-2">
  <div className="col-lg-2 col-sm-6 col-12 ml-3">
      <div className="input-blocks">
        <label>Category</label>
        <div className="input-groupicon ">
                        <Select
                          className="img-select"
                          options={formatedCategoryList}
                          value={selectedCategory}
                          onChange={setSelectedCategory}
                          classNamePrefix="react-select"
                          placeholder="Category"
                          style={{ height: "38px", width: "100%" }}
                        />
                      </div>
      </div>
    </div>
  <div className="col-lg-2 col-sm-6 col-12">
      <div className="input-blocks">
        <label>Name</label>
        <div>
          <input
          type="text"
            className="form-control" // Ensure consistent height
            value={fullname}
            onChange={(e)=>setfullname(e.target.value)}
            placeholder="Enter Name"
           
          />
         
          
        </div>
      </div>
    </div>
    
    <div className="col-lg-2 col-sm-6 col-12">
      <div className="input-blocks">
        <label>Race No</label>
        <div>
        <input
          type="text"
            className="form-control" // Ensure consistent height
            value={racerNo}
            onChange={(e)=>setracerNo(e.target.value)}
            placeholder="Enter Racer Number"
           
          />
          
        </div>
      </div>
    </div>
    <div className="col-lg-6 col-sm-12 col-12">
      <div className="input-blocks">
      <div className="input-blocks">
                    <button
                      className="btn btn-reset w-25"
                      onClick={handleReset}
                    >
                      <i
                        data-feather="refresh-cw"
                        className="feather-refresh-cw"
                      />{" "}
                      Reset
                    </button>
                  </div>
      
      <button
    type="submit" className="btn btn-submit w-25"
     onClick={handleFilter}>
      Search
    </button>
    
      </div>
    </div>
    
   
                
 </div>
</div>

              {/* /Filter */}
              {/* <div className="table-responsive product-list">
                <Table columns={columns}  dataSource={modifiedList}/>
              </div> */}
               {isLoading ? ( // Display loader when data is loading
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <div className="table-responsive product-list">
                  <Table columns={columns} dataSource={modifiedList} />
                </div>
              )}
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      {/* <RacerModal /> */}
      {modalOpen && (
        <Report3
           
          data={viewData}
           handleClose={() => setModalOpen(false)}
          
        />
      )}
    </div>
  );
};

export default RejectionReports;