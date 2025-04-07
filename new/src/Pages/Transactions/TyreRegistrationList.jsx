
import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  Calendar,
  ChevronUp,


  PlusCircle,
  RotateCcw,


} from "feather-icons-react/build/IconComponents";
// import { setToogleHeader } from "../../core/redux/action";
// import { useDispatch, useSelector } from "react-redux";


import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import EventRegistrationModal from "../../core/TransactionModal/EventRegistrationModal";
import { getEventRegistrationList, editEventRegistrationGuid, deleteEventRegistration, getTyreRegistrationList, deleteTyreRegistration, getTyreRegistrationguid } from "../../core/services/TransactionApiServices";
import { useDispatch } from "react-redux";
import { fetchcategory, fetchevents, fetchracer } from "../../redux/masterfetch";
import TyreRegistrationModal from "./TyreRegistration";
import TyreRegModalForm from "../../core/TransactionModal/TyreRegModalForm";
import { exportreportExcel, exportreportPDF, printreportReport } from "../../core/utils/MainReportUtils";
import { renderTooltip } from "../../redux/helper";
import { DatePicker } from "antd";




const TyreRegistrationList = () => {
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState("");
  const [filterRaceNo, setFilterRaceNo] = useState("");
  const [filterName, setFilterName] = useState("");
  const [eventData, setEventData] = useState()
  const [updateData, setUpdateData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const toggleSortOrder = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };
  const handleSearch = (e) => {
    setSearchText(e.target.value);
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
  useEffect(() => {
    handleTyreRegistrationList();
    dispatch(fetchevents())
    dispatch(fetchcategory())
  }, []);


  
  const modifiedList = Array.isArray(eventData)
    ? eventData?.filter((value) =>
      value.racernumber && value.fullname?.toLowerCase().includes(searchText?.toLowerCase())
    )
    : [];
  



  const handleTyreRegistrationList = async () => {
    setIsLoading(true); // Set loader to true before fetching data
    try {
      const response = await getTyreRegistrationList();
      if (Array.isArray(response.listTyreRegistration)) {
        const sortedEvents = response.listTyreRegistration.sort((a, b) =>
          sortDirection === "asc"
            ? a.fullname.localeCompare(b.fullname)
            : b.fullname.localeCompare(a.fullname)
        );
        setEventData(sortedEvents);
      } else {
        setEventData([]);
      }
    } catch (error) {
      console.log(error?.response?.data?.Message || "Something went wrong");
      setEventData([]);
    } finally {
      setIsLoading(false); // Set loader to false after fetching data
    }
  };
  const handleEditClick = async (guid) => {
    try {
      const response = await getTyreRegistrationguid(guid);
      console.log(response.data.tyreRegistration, "tyredata");
      setUpdateData(response.data.tyreRegistration); // Set the data for editing
      setModalMode("edit"); // Set the modal mode to 'edit'
      setModalOpen(true); // Open the modal
    } catch (error) {
      console.error(
        "Error fetching event by GUID:",
        error?.response?.data?.Message || "something went wrong"
      );
    }
  };
  console.log(eventData, "ddddd");

  const handleDeleteClick = (guid) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      cancelButtonColor: "#ff0000",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      console.log(result);
      if (result.isConfirmed) {
        try {
          const response = await deleteTyreRegistration(guid);
          if (response) {
            MySwal.fire({
              title: "Deleted!",
              text: "The tyre registration has been deleted.",
              icon: "success",
              confirmButtonColor: "#00ff00",
              confirmButtonText: "OK",
            }).then(() => {
              handleTyreRegistrationList(); // Refresh the list
              // setSearchText(""); // Clear the search text
            });
          } else {
            MySwal.fire({
              title: "Error!",
              text: "Something went wrong.",
              icon: "error",
              confirmButtonColor: "#ff0000",
              confirmButtonText: "OK",
            });
          }
        } catch (error) {
          console.error(
            "Error deleting tax:",
            error?.response?.data?.Message || "something went wrong"
          );
          MySwal.fire({
            title: "Error!",
            text: error?.response?.data?.Message || "something went wrong",
            icon: "error",
            confirmButtonColor: "#ff0000",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // Reset time to 00:00:00
    return d;
  };
  const handleFilter = () => {
    const filteredList = Array.isArray(eventData)
      ? eventData.filter((value) => {


        const matchesRaceNo = filterRaceNo
          ? value.racernumber?.toString().includes(filterRaceNo)
          : true;

        const matchesName = filterName
          ? value.fullname?.toLowerCase().includes(filterName.toLowerCase())
          : true;
        
        return matchesRaceNo && matchesName ;
      })
      : [];

    setEventData(filteredList);
  };

  const handleRefresh = () => {
    handleTyreRegistrationList()// Reset the data to initialEventData
  };

  const columns = [
    {
      title: "Race No",
      dataIndex: "racernumber",
      sorter: (a, b) => a.racernumber.length - b.racernumber.length,
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
      // sorter: (a, b) => a.fullname.length - b.fullname.length,
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
    // {
    //   title: "Tyre1",
    //   dataIndex: "tyre1",
    //   sorter: (a, b) => a.tyre1 - b.tyre1,
    // },
    // {
    //     title: "Tyre2",
    //     dataIndex: "tyre2",

    //     sorter: (a, b) => a.tyre2 - b.tyre2,
    //   },
    //   {
    //     title: "Tyre3",
    //     dataIndex: "tyre3",
    //     sorter: (a, b) => a.tyre3 - b.tyre3,
    //   },
    //   {
    //     title: "Tyre4",
    //     dataIndex: "tyre4",
    //    sorter: (a, b) => a.tyre4 - b.tyre4,
    //   },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, obj) => (
        <div className="action-table-data">
          <div className="edit-delete-action">

            <Link
              className="me-2 p-2"
              to="#"
              onClick={() => handleEditClick(obj.guid)}
            >
              <i data-feather="edit" className="feather-edit"></i>
            </Link>
            <Link
              className="confirm-text p-2"
              to="#"
              onClick={() => handleDeleteClick(obj.guid)}
            >
              <i data-feather="trash-2" className="feather-trash-2"></i>
            </Link>
          </div>
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



  const MySwal = withReactContent(Swal);

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
    console.log("salesData of  table:", eventData);

    // Return the filtered data, columns, and field mapping
    return { data: eventData, columns: columns, fieldMapping };
  };



  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header transfer">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Tyre Registration</h4>
                <h6>Manage your Tyre</h6>
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
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip("Print")}>
                  <button onClick={() => printreportReport(getActiveTabData)} className="btn btn-link bg-white rounded-lg border border-silver">
                    <i data-feather="printer" className="feather-printer" />
                  </button>
                </OverlayTrigger>
              </li>

            </ul>
            <div className="d-flex purchase-pg-btn">
              <div className="page-btn">

                <Link
                  to="#"
                  className="btn btn-added"
                  onClick={() => {
                    setModalMode("add"); // Set the modal mode to 'add'
                    setModalOpen(true); // Open the modal
                  }}
                >
                  <PlusCircle className="me-2" />
                  New
                </Link>

              </div>

            </div>
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
                  {/* <div className="col-3">
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
                  <div className="col-3">
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
                  </div> */}
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <label>Name</label>
                      <div>
                        <input
                          type="text"
                          className="form-control" // Ensure consistent height
                          value={filterName}
                          onChange={(e) => setFilterName(e.target.value)}
                          placeholder="Enter Name"

                        />


                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <label>Race No</label>
                      <div>
                        <input
                          type="text"
                          className="form-control" // Ensure consistent height
                          value={filterRaceNo}
                          onChange={(e) => setFilterRaceNo(e.target.value)}
                          placeholder="Enter Racer Number"

                        />

                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-sm-6 col-12">
                    <div className="input-blocks">
                    <button
                        className="btn btn-reset w-25"
                        onClick={() => {
                          setSearchText("");
                          setFilterRaceNo("");
                          setFilterName("");
                        }}
                      >
                        <i
                          data-feather="refresh-cw"
                          className="feather-refresh-cw"

                        />
                        Reset
                      </button>

                    </div>
                    <div className="input-blocks">
                    <button
                        type="submit" className="btn btn-submit w-25"
                        onClick={handleFilter}
                      >
                        Search
                      </button>

                    </div>
                  </div>
                  



                </div>
              </div>
              {/* /Filter
              <div className="table-responsive product-list">
                <Table columns={columns} dataSource={modifiedList} />
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
      {modalOpen && (
        <TyreRegModalForm
          mode={modalMode}
          data={modalMode === "edit" ? updateData : {}}
          handleClose={() => setModalOpen(false)}
          handleRefresh={() => {
            handleTyreRegistrationList(); // Refresh the list
            // Clear the search text
          }}
        />
      )}

    </div>
  );
};

export default TyreRegistrationList;


