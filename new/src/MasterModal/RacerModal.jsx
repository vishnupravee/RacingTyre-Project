
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import {useForm} from 'react-hook-form';
import { addNewRacer, editRacer } from "../core/services/MasterApiServices";
// import { addNewTax, editTax } from "../../../services/MasterApiServices";
// import toast from "react-hot-toast";
// import { TaxClass } from "../../../core/json/TaxClass";
// import { useSelector } from "react-redux";

const RacerModal = ({mode,data,handleClose, handleRefresh}) => {
  const {handleSubmit,register,setValue,reset} = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  // Get user from redux
//   const { userId } = useSelector((state) => state.userauth);

  function resetmodal() {
    if (mode === "edit" && data) {
      setValue("name", data.name);
      setValue("percentage", data.percentage); // Populate form with data for editing
    } else {
      reset();
    }
  }

  useEffect(() => {
    resetmodal();
  }, [data, mode, setValue]);

  // Handle form submission for adding or editing a tax
  const handleFormSubmit = async (formData) => {
    const objracer = {
      fullName : formData.fullName,
      idCardNumber:formData.idCardNumber,
      mobile:formData.mobile,
      email:formData.email,
      address1:formData.address1,
      address2:formData.address2,
      address3:formData.address3,
      drivingLicenceNo:formData.drivingLicenceNo,
      remarks:formData.remarks,
      isActive:formData.isActive,
      createdDate: "2024-11-14T09:30:46.71"
    };
    if (mode === "edit") {
      objracer.guid = data.guid;
      objracer.id = data.id;
    }

    try {
      const response =
        mode === "edit" ? await editRacer(objracer) : await addNewRacer(objracer);

        if (response) {
          console.log(response);
          
          if (response.data.statusCode === 200) {
              toast.success(response.data.statusMessage);
          } else {
              toast.info("Something was processed, but not fully successful.");
          }
          handleRefresh();
          handleClose();
      } else {
          toast.error("Failed to process the request.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || "something went wrong");
      console.error(
        "Error handling category:",
        error?.response?.data?.Message || "something went wrong"
      );
    }
  };

  return (
    <div>
      <div
       className="modal fade show"
       style={{ display: "block" }}
       tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                  <h4>{mode === "edit" ? "Edit Racer" : "Add Racer"}</h4>
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
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            Full Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Name"
                            {...register("fullName")}
                            required
                          />
                        </div>
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
                            {...register("idCardNumber")}
                            required
                          />
                        </div>
                      </div>
                    
                  
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            Mobile <span className="text-danger">*</span>
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
                            Email <span className="text-danger">*</span>
                          </label>
                          <input
                          className="form-control"
                            type="email"
                            placeholder=""
                            {...register("email")}
                            required
                          />
                        </div>
                      </div>
                      
                    
                   
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            Address 1 
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("address1")}
                            
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            Address 2 
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("address2")}
                            
                          />
                        </div>
                      </div>
                    
                   
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            Address 3 
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("address3")}
                            
                          />
                        </div>
                      </div>
                    
                    
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            Driving License No <span className="text-danger">*</span>
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("drivingLicenceNo")}
                            required
                          />
                        </div>
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="input-blocks">
                          <label>
                            Remarks 
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("remarks")}
                          
                          />
                        </div>
                      </div>
                    </div>
                    
                    
                      <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-check">
  <input className="form-check-input" type="checkbox" {...register("isActive")} />
  <label className="form-check-label" >
    Is Active
  </label>
</div>
                      </div>
                    
                    <div className="col-lg-12">
                      <div className="modal-footer-btn">
                        <button
                          type="button"
                          className="btn btn-cancel me-2"
                          onClick={() => resetmodal()}
                        >
                          Reset
                        </button>
                        <button type="submit" className="btn btn-submit">
                          {mode === "edit" ? "Save Changes" : "save"}
                         
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
  );
};

export default RacerModal;