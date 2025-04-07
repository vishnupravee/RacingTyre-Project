


import React, { useState,useEffect } from "react";
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
import CategoryModal from "../../MasterModal/CategoryModal";
import { deleteCategory, getCategoryguid, getcategoryList } from "../../core/services/MasterApiServices";
import { exportreportExcel, exportreportPDF, printreportReport } from "../../core/utils/MainReportUtils";
import { renderTooltip } from "../../redux/helper";


const CategoryMaster = () => {
  
  const [searchText, setSearchText] = useState("");
  const[categoryData,setCategoryData] = useState();
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
    handleCategoryList()
    
  }, []);
  const modifiedList = Array.isArray(categoryData)
  ? categoryData?.filter((value) =>
      value.name?.toLowerCase().includes(searchText?.toLowerCase())
    )
  : [];
  
  const  handleCategoryList= async () => {
    try {
      const response = await getcategoryList();
      if (Array.isArray(response.listCategory)) {
        const sortedEvents = response.listCategory.sort((a, b) =>
          sortDirection === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        );
        setCategoryData(sortedEvents);
      } else {
        setCategoryData([]);
      }
    } catch (error) {
      console.log(error?.response?.data?.Message || "Something went wrong");
      setCategoryData([]);
    }
  };
  const handleEditClick = async (guid) => {
    try {
      const response = await getCategoryguid(guid)
      console.log(response,"resssss");
      
      setUpdateData(response.data.category); // Set the data for editing
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
          const response = await deleteCategory(guid);
          if (response) {
            MySwal.fire({
              title: "Deleted!",
              text: "The Category has been deleted.",
              icon: "success",
              confirmButtonColor: "#00ff00",
              confirmButtonText: "OK",
            }).then(() => {
              handleCategoryList(); // Refresh the list
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
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      sorter: (a, b) => a.remarks.length - b.remarks.length,
    },

    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive) => (isActive ? "Active" : "Inactive"),
      sorter: (a, b) => a.isActive - b.isActive, // Boolean sort for true/false values
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
    console.log("salesData of  table:", categoryData);         
  
    // Return the filtered data, columns, and field mapping
    return { data: categoryData, columns: columns, fieldMapping };
  };
  
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header transfer">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Category Master</h4>
                <h6>Manage your Master</h6>
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
              {/* <li>
                <OverlayTrigger placement="top" >
                <Link
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    id="collapse-header"
                    // className={togglehead ? "active" : ""}
                    // onClick={handletogglehead}
                  >
                    <ChevronUp />
                    </Link>
                </OverlayTrigger>
              </li> */}
              
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
                <Table columns={columns}   dataSource={modifiedList} />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      {modalOpen && (
        <CategoryModal
          mode={modalMode}
          data={modalMode === "edit" ? updateData : {}}
          handleClose={() => setModalOpen(false)}
          handleRefresh={() => {
            handleCategoryList(); // Refresh the list
            // Clear the search text
          }}
        />
      )}
      
    </div>
  );
};

export default CategoryMaster;