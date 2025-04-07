
import React, { useEffect } from "react";
import { addNewEvent, editEvent } from "../core/services/MasterApiServices";
import toast from "react-hot-toast";
import {useForm} from 'react-hook-form'
// import { addNewTax, editTax } from "../../../services/MasterApiServices";
// import toast from "react-hot-toast";
// import { TaxClass } from "../../../core/json/TaxClass";
// import { useSelector } from "react-redux";

const EventModal = ({mode,data,handleClose, handleRefresh}) => {
  const {  handleSubmit,register,setValue,reset } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  console.log(data,"daaaata");
  
  // Get user from redux
//   const { userId } = useSelector((state) => state.userauth);

  function resetmodal() {
    if (mode === "edit" && data) {
      setValue("name", data.name);
      setValue("remarks", data.remarks);
      setValue("isActive", data.isActive); // Populate form with data for editing
    } else {
      reset();
    }
  }

  useEffect(() => {
    resetmodal();
  }, [data, mode, setValue]);

  // Handle form submission for adding or editing a tax
  const handleFormSubmit = async (formData) => {
    const objevent = {
      name : formData.name,
      remarks:formData.remarks,
      isActive:formData.isActive,
       updatedUser: "00000000-0000-0000-0000-000000000000",
        updatedDate: "2024-11-14T09:30:46.71",
      createdDate: "2024-11-14T09:30:46.71"
    };
     //"{9b57619d-63c8-4e27-9a59-639f0c80e4a1}";
    if (mode === "edit") {
      objevent.guid = data.guid;
      objevent.id = data.id;
    }

    try {
      const response =
        mode === "edit" ? await editEvent(objevent) : await addNewEvent(objevent);

      //   if (response) {
      //     console.log(response,"updatttttttt");
          
      //     if (response.data.statusCode === 200) {
      //         toast.success(response.data.statusMessage);
      //     } else {
      //         toast.info("Something was processed, but not fully successful.");
      //     }
      //     handleRefresh();
      //     handleClose();
      // } else {
      //     toast.error("Failed to process the request.");
      // }
      if (response) {
        console.log(response);
    
        
    
        // Handle specific error code (551)
        if (response.data.ErrorCode === 551) {
            toast.error("Data already exist");
        } 
        // Handle successful response (statusCode 200)
        else if (response.data.statusCode === 200) {
            toast.success(response.data.statusMessage);  // Success case
        } 
        // Handle partial success or unexpected status
        else {
            toast.info("Something was processed, but not fully successful.");  // Partial success
        }
    
        // Refresh UI or data and close any open dialogs
        handleRefresh();
        handleClose();
    } else {
        // Handle failure when there is no response
        toast.error("Failed to process the request.");  // Error case if no response
    }

    }
    
    catch (error) {
      if (error.response.data.ErrorCode === 551) {
        toast.error("Data already exist");
    } else{

      toast.error( "something went wrong");
    }
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
                  <h4>{mode === "edit" ? "Edit Event" : "Add Event"}</h4>
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
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="input-blocks">
                          <label>
                            Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Name"
                            {...register("name")}
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
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-check">
  <input className="form-check-input" type="checkbox" {...register("isActive")} />
  <label className="form-check-label" >
    Is Active
  </label>
</div>
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

export default EventModal;