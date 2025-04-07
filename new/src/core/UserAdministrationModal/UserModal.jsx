
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { addNewUser, editUser } from "../services/UserMasterApiServices";

// import { addNewTax, editTax } from "../../../services/MasterApiServices";
// import toast from "react-hot-toast";
// import { TaxClass } from "../../../core/json/TaxClass";
// import { useSelector } from "react-redux";

const UserModal = ({mode,data,handleClose, handleRefresh}) => {
  const {  handleSubmit,setValue,reset,register,formState: { errors } } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  // Get user from redux
//   const { userId } = useSelector((state) => state.userauth);
   console.log(data,"Userrrrdata");
   
  function resetmodal() {
    if (mode === "edit" && data) {
      setValue("userName", data.userName);
      setValue("userPassword", data.userPassword);
      setValue("mobile", data.mobile);
       // Populate form with data for editing
    } else {
      reset();
    }
  }

  useEffect(() => {
    resetmodal();
  }, [data, mode, setValue]);

  
  const handleFormSubmit = async (formData) => {
    const objuser = {
      userName : formData.userName,
      userPassword : formData.userPassword,
      mobile:formData.mobile,
      isActive:formData.isActive,
      updatedUser: "00000000-0000-0000-0000-000000000000",
      updatedDate: "2024-11-14T09:30:46.71",
      createdDate: "2024-11-14T09:30:46.71"
    };
    if (mode === "edit") {
      objuser.guid = data.guid;
      objuser.id = data.id;
    }

    try {
      const response =
        mode === "edit" ? await editUser(objuser) : await addNewUser(objuser);

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
                  <h4>{mode === "edit" ? "Edit User" : "Add User"}</h4>
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
                  <form onSubmit={handleSubmit(handleFormSubmit)} autoComplete="off">
                    <div className="row">
                    <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            User Name<span className="text-danger">*</span>
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("userName")}
                            required
                            autoComplete="off"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
  <div className="input-blocks">
    <label>
      Password
      {errors.userPassword && <span className="text-danger">*</span>}
    </label>
    <input
      className="form-control"
      type="password"
      placeholder=""
      {...register("userPassword", { required: true })}
      autoComplete="off"
    />
    {errors.userPassword && (
      <small className="text-danger">Password is required.</small>
    )}
  </div>
</div>

                      {/* <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            Mobile Number<span className="text-danger">*</span>
                          </label>
                          <input
                          className="form-control"
                            type="text"
                            placeholder=""
                            {...register("mobile")}
                            required
                            autoComplete="off"
                          />
                        </div>
                      </div> */}
                      <div className="col-lg-6">
  <div className="input-blocks">
    <label>
      Mobile Number<span className="text-danger">*</span>
    </label>
    <input
      className="form-control"
      type="text"
      placeholder="Enter Mobile Number"
      {...register("mobile", {
        required: "Mobile number is required",
        pattern: {
          value: /^[0-9]+$/, // Ensures only numbers are allowed
          message: "Mobile number must contain only digits",
        },
      })}
      inputMode="numeric" // Mobile keyboard opens in numeric mode
      onInput={(e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Prevents non-numeric input
      }}
      autoComplete="off"
    />
    {errors.mobile && (
      <span className="text-danger small mt-1">{errors.mobile.message}</span>
    )}
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

export default UserModal;