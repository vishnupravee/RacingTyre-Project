
import { Tooltip } from "antd";

import { ChevronUp,RotateCcw } from "feather-icons-react/build/IconComponents";
import React, { useEffect, useState } from "react";
import { OverlayTrigger } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchcategory, fetchevents, fetchracer } from "../../redux/masterfetch";
import { addNewTyreRegistration, getTyreRegistrationRacerist } from "../../core/services/TransactionApiServices";
import { useForm ,Controller} from "react-hook-form";
import Select from "react-select";

const TyreRegistration = () => {
  const [TyreRacerData ,setTyreRacerData] = useState("");
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState("");
  const {  handleSubmit,register,setValue,control ,reset} = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  const { racerList,categoryList,eventList ,formatedracerList} = useSelector((state) => state.master);
  
const resetModal = () => {
  reset({
    fullName: "",
    idCardNo: "",
    mobile: "",
    vehicleRegNumber: "",
    event: "",
    category: "",
    tyre1: "",
    tyre2: "",
    tyre3: "",
    tyre4: "",
    remarks: "",
  });
  setSearchText(""); // Reset any additional state
};


console.log(TyreRacerData,"fffffff");

 

const handleTyreRegistrationList = async (fname) => {
  try {
    const response = await getTyreRegistrationRacerist(fname);
    if (Array.isArray(response.listTyreRegistration)) {
      setTyreRacerData(response.listTyreRegistration);
      console.log(response,"response");
     } else {
      setTyreRacerData([]); // If response is not an array, reset to an empty array
    }
  } catch (error) {
    console.log(error?.response?.data?.Message || "something went wrong");
    setTyreRacerData([]);
  }
};

useEffect(() => {
 
  dispatch(fetchracer());
  dispatch(fetchcategory());
  dispatch(fetchevents())
}, []);
  const handleFormSubmit = async (formData) => {
    const objtyre = {
      eventRegGUID:formData.eventid ,
  categoryGUID:formData.categoryid,
  racerRegGUID:formData.fullName ,
      // fullName : formData.fullName,
      vehicleRegNumber:formData.vehicleRegNumber,
      tyre1:formData.tyre1,
      tyre2:formData.tyre2,
      tyre3:formData.tyre3,
      tyre4:formData.tyre4,
      remarks:formData.remarks,
      isActive:formData.isActive,
      createdDate: "2024-11-14T09:30:46.71"
    };

    try {
      const response = await addNewTyreRegistration(objtyre);
      if (response) {
        console.log(response);
        
        if (response.data.statusCode === 200) {
            toast.success(response.data.statusMessage);
        } else {
            toast.info("Something was processed, but not fully successful.");
        }
        // handleRefresh();
        resetModal()
    } else {
        toast.error("Failed to process the request.");
    }
    } catch (error) {
      toast.error(error?.response?.data?.Message);
      console.error("Error handling :", error);
    }
  };


const renderTooltip = (props) => (
  <Tooltip id="pdf-tooltip" {...props}>
    Pdf
  </Tooltip>
);
const renderExcelTooltip = (props) => (
  <Tooltip id="excel-tooltip" {...props}>
    Excel
  </Tooltip>
);
const renderPrinterTooltip = (props) => (
  <Tooltip id="printer-tooltip" {...props}>
    Printer
  </Tooltip>
);
const renderRefreshTooltip = (props) => (
  <Tooltip id="refresh-tooltip" {...props}>
    Refresh
  </Tooltip>
);
const renderCollapseTooltip = (props) => (
  <Tooltip id="refresh-tooltip" {...props}>
    Collapse
  </Tooltip>
);
const [isFilterVisible, setIsFilterVisible] = useState(false);
const toggleFilterVisibility = () => {
  setIsFilterVisible((prevVisibility) => !prevVisibility);
};
const handleracer= async(val)=>{
  setValue('fullName',val.value)
  const selectedracer = await getTyreRegistrationRacerist(val.label)
  console.log(selectedracer);
  
  setValue('idCardNo',selectedracer?.racerEvent?.idCardNumber)
  setValue('mobile',selectedracer?.racerEvent?.mobile)
  setValue('Email',selectedracer?.racerEvent?.email)
  setValue('vehicleRegNumber',selectedracer?.racerEvent?.vehicleRegNumber)
  setValue('category',selectedracer?.racerEvent?.categoryName)
  setValue('categoryid',selectedracer?.racerEvent?.categoryGUID)
  setValue('event',selectedracer?.racerEvent?.eventName)
  setValue('eventid',selectedracer?.racerEvent?.eventRegGUID)
}

  return (
    <div>
       <div className="page-wrapper">
        <div className="content">
          <div className="page-header transfer">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Tyre Registration</h4>
                <h6>Manage your registration</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip}>
                  <Link>
                    <ImageWithBasePath
                      src="assets/img/icons/pdf.svg"
                      alt="img"
                    />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <ImageWithBasePath
                      src="assets/img/icons/excel.svg"
                      alt="img"
                    />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <i data-feather="printer" className="feather-printer" />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <RotateCcw />
                  </Link>
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
              {/* /Filter */}
              <div
        // className="modal fade"
        //  id="event-reg"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
               
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            FullName <span className="text-danger">*</span>
                          </label>
                          
                        </div>
                        <Controller
                                control={control}
                                name={`fullName`}
                                render={({ field: { onChange, value } }) => (
                                  <Select
                                    classNamePrefix="react-select"
                                    options={formatedracerList}
                                    value={formatedracerList?.find(
                                      (paymentType) =>
                                        paymentType?.value === value)||null}
                                    onChange={(selectedOption) =>
                                      {onChange(selectedOption?.value|| null);
                                      handleracer(selectedOption);}
                                    }
                                    styles={{
                                      menu: (provided) => ({
                                        ...provided,
                                        zIndex: 9999,
                                      }),
                                    }}
                                    required
                                  />
                                )}
                              />
                      </div>
                    
                    
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            ID Card Number <span className="text-danger">*</span>
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("idCardNo")}
                            required
                          />
                        </div>
                      </div>
                    
                   
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            Mobile<span className="text-danger">*</span>
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("mobile")}
                            required
                          />
                        </div>
                      </div>
                  
                   
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            Vehicle Reg.No <span className="text-danger">*</span>
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("vehicleRegNumber")}
                            required
                          />
                        </div>
                      </div>
                    
                 
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            Event<span className="text-danger">*</span>
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("event")}
                            required
                          />
                        </div>
                      </div>
                  
                    
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            Category <span className="text-danger">*</span>
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("category")}
                            required
                          />
                        </div>
                      </div>
                    
                   
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                              Tyre 1<span className="text-danger">*</span>
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("tyre1")}
                            required
                          />
                        </div>
                      </div>
                    
                   
                    
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                              Tyre 2<span className="text-danger">*</span>
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("tyre2")}
                            required
                          />
                        </div>
                      </div>
                    
                    
                      <div className="col-lg-6 ">
                        <div className="input-blocks">
                          <label>
                              Tyre 3<span className="text-danger">*</span>
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("tyre3")}
                            required
                          />
                        </div>
                      </div>
                    <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                              Tyre 4<span className="text-danger">*</span>
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("tyre4")}
                            required
                          />
                        </div>
                      </div>
                     <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            Remarks
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("remarks")}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="modal-footer-btn">
                        <button
                          type="button"
                          className="btn btn-cancel me-2"
                          onClick={() => resetModal()}
                        >
                          Reset
                        </button>
                        <button type="submit" className="btn btn-submit">
                          {/* {mode === "edit" ? "Save Changes" : "save"} */}
                          save
                        </button>
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
          </div>
          {/* /product list */}
        </div>
      </div>
  
    </div>
  );
};

export default TyreRegistration;