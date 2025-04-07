
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { addNewEventRegistration, editEventRegistrationGuid } from "../services/TransactionApiServices";
import { getcategoryList, getEventList, getRacerList } from "../services/MasterApiServices";
import { useSelector } from "react-redux";

// import { addNewTax, editTax } from "../../../services/MasterApiServices";
// import toast from "react-hot-toast";
// import { TaxClass } from "../../../core/json/TaxClass";
// import { useSelector } from "react-redux";

const EventRegistrationModal = ({ mode, data, handleClose, handleRefresh }) => {
  const { handleSubmit, register, setValue, reset } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  // Get user from redux
  //   const { userId } = useSelector((state) => state.userauth);
  const [eventData, setEventData] = useState()

  const { racerList, categoryList } = useSelector((state) => state.master);

  // const[categoryData,setCategoryData] = useState();

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

  useEffect(() => {

    handleEventList();
  }, []);


  const handleFormSubmit = async (formData) => {
    const objeventreg = {
      eventGUID: formData.event,
      categoryGUID: formData.category,
      racerRegGUID: formData.fullName,
      // fullName : formData.fullName,
      vehicleRegNumber: formData.vehicleRegNumber,
      address1: formData.address1,
      address2: formData.address2,
      remarks: formData.remarks,
      isActive: formData.isActive,
      createdDate: "2024-11-14T09:30:46.71"
    };

    if (mode === "edit") {
      objeventreg.guid = data.guid;
      objeventreg.id = data.id;
    }

    try {
      const response =
        mode === "edit" ? await editEventRegistrationGuid(objeventreg) : await addNewEventRegistration(objeventreg);
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
  const handleEventList = async () => {
    try {
      const response = await getEventList();
      if (Array.isArray(response.listEvents)) {
        setEventData(response.listEvents);
        console.log(response, "response");

      } else {
        setEventData([]); // If response is not an array, reset to an empty array
      }
    } catch (error) {
      console.log(error?.response?.data?.Message || "something went wrong");
      setEventData([]);
    }
  };
  // const handleCategoryList = async () => {
  //   try {
  //     const response = await getcategoryList();
  //     if (Array.isArray(response.listCategory)) {
  //       setCategoryData(response.listCategory);
  //       console.log(response,"response");

  //     } else {
  //       setCategoryData([]); // If response is not an array, reset to an empty array
  //     }
  //   } catch (error) {
  //     console.log(error?.response?.data?.Message || "something went wrong");
  //     setCategoryData([]);
  //   }
  // };

  console.log(categoryList, "fddfgfg");

  const handleracer = (val) => {
    setValue('fullName', val)

    const selectedracer = racerList?.find(e => e.guid == val)
    setValue('idCardNo', selectedracer.idCardNumber)
    setValue('mobile', selectedracer.mobile)
    setValue('Email', selectedracer.email)
    setValue('address1', selectedracer.address1)
    setValue('address2', selectedracer.address2)
  }
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
                    <h4>{mode === "edit" ? "Edit Event Registration" : "Add Registration"}</h4>
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
                            Event <span className="text-danger">*</span>
                          </label>
                          <select
                            {...register("event")}

                            className=" form-control"
                            required
                          >
                            <option value="" >
                              Select Event
                            </option>
                            {eventData?.map((category) => (
                              <option key={category.guid} value={category.guid}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>


                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            Category <span className="text-danger">*</span>
                          </label>
                          <select
                            {...register("category", { required: "Category is required" })}

                            className=" form-control"
                            required
                          >
                            <option value="" >
                              Select Category
                            </option>
                            {categoryList?.map((category) => (
                              <option key={category.guid} value={category.guid}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>


                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            Full Name<span className="text-danger">*</span>
                          </label>
                          <select
                            {...register("fullName", { required: "Category is required" })}
                            onChange={(e) => handleracer(e.target.value)}
                            className=" form-control"
                            required
                          >
                            <option value="" >
                              Select racer
                            </option>
                            {racerList?.map((category) => (
                              <option key={category.guid} value={category.guid}>
                                {category.fullName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>


                      <div className="col-lg-6 ">
                        <div className="input-blocks">
                          <label>
                            ID Card No <span className="text-danger">*</span>
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
                      <div className="col-lg-6 ">
                        <div className="input-blocks">
                          <label>
                            Email <span className="text-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder=""
                            {...register("Email")}
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
                            required
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
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>
                            Vehicle Reg.No<span className="text-danger">*</span>
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
                          <input className="form-check-input" type="checkbox"  {...register("isActive")} />
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

export default EventRegistrationModal;

