


import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  ChevronUp,

  
  PlusCircle,
  RotateCcw,
  
  
} from "feather-icons-react/build/IconComponents";
// import { setToogleHeader } from "../../core/redux/action";
// import { useDispatch, useSelector } from "react-redux";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import UserModal from "../../core/UserAdministrationModal/UserModal";
import { deleteUser, getUserguid, getUserList } from "../../core/services/UserMasterApiServices";
import { renderTooltip } from "../../redux/helper";
import { exportreportExcel, exportreportPDF, printreportReport } from "../../core/utils/MainReportUtils";


const UserList = () => {
  
  const [searchText, setSearchText] = useState("");
  const[userData,setUserData] = useState()
  const [updateData, setUpdateData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [sortDirection, setSortDirection] = useState("asc");

  const toggleSortOrder = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    handleUserList();
    
  }, []);
  const modifiedList = Array.isArray(userData)
  ? userData?.filter((value) =>
      value.userName?.toLowerCase().includes(searchText?.toLowerCase())
    )
  : [];
  const handleUserList = async () => {
    try {
      const response = await getUserList();
      if (Array.isArray(response.listUserMaster)) {
        const sortedEvents = response.listUserMaster.sort((a, b) =>
          sortDirection === "asc"
            ? a.userName.localeCompare(b.userName)
            : b.userName.localeCompare(a.userName)
        );
        setUserData(sortedEvents);
      } else {
        setUserData([]);
      }
    } catch (error) {
      console.log(error?.response?.data?.Message || "Something went wrong");
      setUserData([]);
    }
  };

  const handleEditClick = async (guid) => {
    try {
      const response = await getUserguid(guid);
      console.log(response.userMaster,"responsedataaaaaa");
      
      setUpdateData(response.userMaster); // Set the data for editing
      setModalMode("edit"); // Set the modal mode to 'edit'
      setModalOpen(true); // Open the modal
    } catch (error) {
      console.error(
        "Error fetching event by GUID:",
        error?.response?.data?.Message || "something went wrong"
      );
    }
  };
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
          const response = await deleteUser(guid);
          if (response) {
            MySwal.fire({
              title: "Deleted!",
              text: "The User has been deleted.",
              icon: "success",
              confirmButtonColor: "#00ff00",
              confirmButtonText: "OK",
            }).then(() => {
              handleUserList(); // Refresh the list
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
  console.log(updateData,"mmmmmm");
  
  const columns = [
    {
      title: "User Name",
      dataIndex: "userName",
      sorter: (a, b) => a.supplierName.length - b.supplierName.length,
    },
    {
      title: "Contact Number",
      dataIndex: "mobile",
      sorter: (a, b) => a.reference.length - b.reference.length,
    },

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

  const showConfirmationAlert = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          className: "btn btn-success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      } else {
        MySwal.close();
      }
    });
  };
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
    console.log("salesData of  table:", userData);         
  
    // Return the filtered data, columns, and field mapping
    return { data: userData, columns: columns, fieldMapping };
  };
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header transfer">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Users</h4>
                <h6>Manage your User</h6>
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
              {/* /Filter */}
              <div className="table-responsive product-list">
                <Table columns={columns} dataSource={modifiedList}/>
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      {modalOpen && (
        <UserModal
           mode={modalMode}
           data={modalMode === "edit" ? updateData : {}}
           handleClose={() => setModalOpen(false)}
           handleRefresh={() => {
            handleUserList(); // Refresh the list
            // Clear the search text
          }}
        />
      )}
    
    </div>
  );
};

export default UserList;