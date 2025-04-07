import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { OverlayTrigger, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  Calendar,
  ChevronUp,
  RotateCcw,
} from "feather-icons-react/build/IconComponents";
import Table from "../../core/pagination/datatable";
import { DatePicker, Select } from "antd";
import { getTyreIssueReportList, getTyreSubReportguid } from "../../core/services/ReportApiServices";
import { useDispatch, useSelector } from "react-redux";
import { fetchcategory } from "../../redux/masterfetch";
import { exportreportExcel, exportreportPDF, printreportReport } from "../../core/utils/MainReportUtils";
import { renderTooltip } from "../../redux/helper";
import Report1 from "./AddViewReports/Report1";
import { getTyreRegistrationList } from "../../core/services/TransactionApiServices";
const TyreRegisterReport = () => {
  const [tyreReportData, setTyreReportData] = useState()
  const [searchText, setSearchText] = useState("");
  const [viewData, setViewData] = useState("")
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fullname, setfullname] = useState(null);
  const [racerNo, setracerNo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
  // const [selectedColumns, setSelectedColumns] = useState();
  const dispatch = useDispatch()
  const { formatedCategoryList } = useSelector((state) => state.master);
  const toggleSortOrder = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  

  useEffect(() => {
    handleTyreReportList();
    dispatch(fetchcategory())
  }, []);
  const modifiedList = Array.isArray(tyreReportData)
    ? tyreReportData?.filter((value) =>
      value.fullname?.toLowerCase().includes(searchText?.toLowerCase())
    )
    : [];
    const normalizeDate = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0); // Reset time to 00:00:00
        return d;
      };
  const handleTyreReportList = async () => {
    setIsLoading(true); // Set loader to true before fetching data
    try {
      const response = await getTyreRegistrationList();
      if (Array.isArray(response.listTyreRegistration)) {
        const filteredData = response.listTyreRegistration?.filter((entry) => {
            console.log("Current Entry:", entry);
            const matchesRaceNo = racerNo
            ? entry.racernumber?.toString().includes(racerNo)
            : true;
            const categoryMatch =!selectedCategory || entry.categoryGUID === selectedCategory;
          const matchesName = fullname
            ? entry.fullname?.toLowerCase().includes(fullname.toLowerCase())
            : true;
            const fromDateNormalized = fromDate ? normalizeDate(fromDate) : null;
            const toDateNormalized = toDate ? normalizeDate(toDate) : null;
            const entryDateNormalized = normalizeDate(entry.createdDate);
            
            const fromDateMatch = !fromDateNormalized || entryDateNormalized >= fromDateNormalized;
            const toDateMatch = !toDateNormalized || entryDateNormalized <= toDateNormalized;
            console.log(fromDateNormalized,entryDateNormalized,toDateNormalized,fromDateMatch,toDateMatch,'date');
      
            return  categoryMatch&& fromDateMatch && toDateMatch &&matchesRaceNo &&matchesName  ;
          });
        const sortedEvents = filteredData.sort((a, b) =>
          sortDirection === "asc"
            ? a.fullname.localeCompare(b.fullname)
            : b.fullname.localeCompare(a.fullname)
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

  const handleVeiwClick = async (guid) => {
    console.log(guid);

    try {
      const response = await getTyreSubReportguid(guid);
      console.log(response.listTyreReport, "reeeeeeep");

      setViewData(response.listTyreReport); // Set the data for editing
      // Set the modal mode to 'edit'
      setModalOpen(true); // Open the modal
    } catch (error) {
      console.error(
        "Error fetching Tyre by GUID:",
        error?.response?.data?.Message || "something went wrong"
      );
    }
  };

 // Generate dynamic tyre columns
const tyreColumns = Array.from({ length: 32 }, (_, i) => ({
    title: `Tyre ${i + 1}`,
    dataIndex: `tyre${i + 1}`,
  }));
  
  // Define the full columns array
  const columns = [
    {
      title: "Race No",
      dataIndex: "racernumber",
      sorter: (a, b) => a.racernumber - b.racernumber,
    },
    {
      title: "Date",
      dataIndex: "createdDate",
      render: (text) => {
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        };
        return <span>{formatDate(text)}</span>;
      },
    },
    {
      title: "Name",
      dataIndex: "fullname",
      sorter: (a, b) => a.fullname.length - b.fullname.length,
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      sorter: (a, b) => a.categoryName.length - b.categoryName.length,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      sorter: (a, b) => a.remarks.length - b.remarks.length,
    },
    // Dynamically added tyre columns
    ...tyreColumns,
    {
      title: " ",
      dataIndex: "",
      render: (_, record) => (
        <div key={record.id}>
          <button
            className="btn btn-submit"
            onClick={() => handleVeiwClick(record.guid)}
          >
            View
          </button>
        </div>
      ),
    },
  ];
  
  // const dispatch = useDispatch();
  // const data = useSelector((state) => state.toggle_header);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  function handleReset() {

    setSelectedCategory(null);

    setSearchText("");
    setfullname(""),
      setracerNo("")
  }


  const handleFilter = () => {
    handleTyreReportList()
  }
  const getActiveTabData = () => {
    let fieldMapping = {};

    // Function to create the field mapping between column titles and dataIndex values
    const createfieldMapping = (columns) => {
      const mappings = {};
      columns.forEach((col) => {
        mappings[col.title] = col.dataIndex; // Map title to dataIndex
      });
      return mappings;
    };

    // Generate the field mapping for the current columns
    fieldMapping = createfieldMapping(columns);

    console.log("fieldMapping of first table:", fieldMapping);
    console.log("salesData of  table:", tyreReportData);

    // Return the filtered data, columns, and field mapping
    return { data: tyreReportData, columns: columns, fieldMapping };
  };
  // const handletogglehead = () => {
  //   dispatch(setheadertoggle(!togglehead));
  // };
  const handleRefresh = () => {
    handleTyreReportList()// Reset the data to initialEventData
  };
  const handleFromDateChange = (date) => {
    console.log(date, "from date");
    setFromDate(date);
 
    setToDate(null); // reset to date when from date changes
  };
  const handleToDateChange = (date) => {
    setToDate(date);
    console.log(date, "to date");
  };
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header transfer">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Tyre Registration Reports</h4>
                <h6>Manage your Reports</h6>
              </div>

            </div>
            <ul className="table-top-head">
              {/* <li>
                <OverlayTrigger placement="top" overlay={renderTooltip("PDF")}>
                  <button onClick={() => exportreportPDF(getActiveTabData)} className="btn btn-link bg-white rounded-lg border border-silver" >
                    <ImageWithBasePath
                      src="assets/img/icons/pdf.svg"
                      alt="img"
                    />
                  </button>
                </OverlayTrigger>
              </li> */}
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip("Excel")}>
                  <button onClick={() => exportreportExcel(getActiveTabData)} className="btn btn-link bg-white rounded-lg border border-silver">
                    <ImageWithBasePath
                      src="assets/img/icons/excel.svg"
                      alt="excel-icon"
                    />
                  </button>
                </OverlayTrigger>
              </li>
              {/* <li>
                <OverlayTrigger placement="top" overlay={renderTooltip("Print")}>
                  <button onClick={() => printreportReport(getActiveTabData)} className="btn btn-link bg-white rounded-lg border border-silver">
                    <i data-feather="printer" className="feather-printer" />
                  </button>
                </OverlayTrigger>
              </li> */}
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
                   
                    <div className="d-flex justify-content-end">
                      {/* {isFilterVisible && ( */}
                      <div className="input-blocks me-2">
                        <button
                          className="btn btn-filters btn-sm rounded-2 h-100"
                          onClick={handleFilter}
                        >
                          <i data-feather="search" className="feather-search" />{" "}
                          Search
                        </button>
                      </div>
                      {/* )} */}

                      <div className="input-blocks">
                        <button
                          className="btn btn-reset  btn-sm  rounded-2 "
                        // onClick={handleReset}
                        >
                          <i
                            data-feather="refresh-cw"
                            className="feather-refresh-cw"
                          />{" "}
                          Reset
                        </button>
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
                      <label htmlFor="from-date">From Date</label>
                      <div className="input-groupicon calender-input">
                        <Calendar className="info-img" />
                        <DatePicker
                          className="datetimepicker"
                          id="from-date"
                          placeholderText="From Date"
                          selected={fromDate}
                          value={fromDate}
                          onChange={handleFromDateChange}
                          startDate={fromDate}
                          selectsStart
                        dateFormat="dd/MM/yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6 col-12 ml-3">
                    <div className="input-blocks mr-2">
                      <label htmlFor="to-date">To Date</label>
                      <div className="input-groupicon calender-input">
                        <Calendar className="info-img" />
                        <DatePicker
                          id="to-date"
                          placeholderText="To Date"
                        selected={toDate}
                        value={toDate}
                        onChange={handleToDateChange}
                        minDate={fromDate}
                        startDate={fromDate}
                        selectsEnd
                        disabled={!fromDate} 
                        dateFormat="dd/MM/yyyy"
                        className='form-control'
                        />
                      </div>
                    </div>
                  </div>
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
                          onChange={(e) => setfullname(e.target.value)}
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
                          onChange={(e) => setracerNo(e.target.value)}
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
      {/* <Report1 data={viewData} /> */}
      {modalOpen && (
        <Report1

          data={viewData}
          handleClose={() => setModalOpen(false)}

        />
      )}

    </div>
  );
};

export default TyreRegisterReport;