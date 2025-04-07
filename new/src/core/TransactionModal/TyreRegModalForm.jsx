

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { addNewTyreRegistration, editTyreRegistration } from "../services/TransactionApiServices";
import { getbarcode, getEventList } from "../services/MasterApiServices";
import { useSelector } from "react-redux";

const TyreRegModalForm = ({ mode, data, handleClose, handleRefresh }) => {
  const { register, handleSubmit, setValue, getValues, setError, reset, formState: { errors } } = useForm({ mode: "onChange" });
  const { categoryList, eventList } = useSelector((state) => state.master);

  const [eventData, setEventData] = useState([]);
  const [tyreFields, setTyreFields] = useState(["Tyre1", "Tyre2", "Tyre3", "Tyre4"]);
  const [showMore, setShowMore] = useState(false);
  const [tyreStatus, setTyreStatus] = useState({}); // Store validation status for tyres.
  const { userDetail } = useSelector((state) => state.user);
  console.log(userDetail);
  
  // Load data when editing
  useEffect(() => {
    if (mode === "edit" && data) {
      setValue("fullname", data.fullname);
      setValue("racernumber", data.racernumber);
      setValue("remarks", data.remarks);
      setValue("event", data.eventGuID);
      setValue("category", data.categoryGUID);

      const tyreKeys = Object.keys(data).filter((key) => key.startsWith("tyre"));
      tyreKeys.forEach((key) => setValue(key, data[key]));

      if (tyreKeys.length > 4) {
        // const extraFields = Array.from({ length: tyreKeys.length - 4 }, (_, index) => `Tyre${index + 5}`);
        // setTyreFields(["Tyre1", "Tyre2", "Tyre3", "Tyre4", ...extraFields]);
        const nextFields = Array.from({ length: 0 }, (_, index) => `Tyre${index + 5}`);
        setTyreFields((prevFields) => [...prevFields, ...nextFields]);
      }
    } else {
      reset();
    }
  }, [data, mode, setValue, reset]);

  // Fetch event data
  useEffect(() => {
    const fetchEventList = async () => {
      try {
        const response = await getEventList();
        setEventData(response?.listEvents || []);
      } catch (error) {
        toast.error("Failed to load events.");
      }
    };
    fetchEventList();
  }, []);

  // Tyre validation
  const handlevarifytyre = async (e, tyreKey) => {
    const tyreValue = e.target.value
    if (!tyreValue) return;

    try {
      const response = await getbarcode(tyreValue); // Adjust the payload format to match your API.
      const isSuccess = response?.data?.statusCode === 200;
      console.log(isSuccess);

      if (isSuccess) {
        setValue(`tyre${tyreKey + 1}`, '')

        setError(`tyre${tyreKey + 1}`, {
          message: response?.data?.statusMessage,
        });
      }
      setTyreStatus((prev) => ({
        ...prev,
        [tyreKey]: !isSuccess ? "valid" : "invalid",
      }));
    } catch (error) {
      toast.error("Something went wrong during tyre verification.");
      setTyreStatus((prev) => ({
        ...prev,
        [tyreKey]: "invalid",
      }));
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    const tyreData = tyreFields.reduce((acc, tyre, index) => ({
      ...acc,
      [`tyre${index + 1}`]: formData[`tyre${index + 1}`] || "",
    }), {});

    const payload = {
      fullname: formData.fullname,
      racernumber: formData.racernumber,
      remarks: formData.remarks,
      categoryGUID: formData.category,
      eventGuID: formData.event,
      createdDate: mode === "edit"? data.createdDate: new Date(),
      updatedUser: userDetail?.userMaster?.guid,
      createdUser: userDetail?.userMaster?.guid,
      updatedDate: new Date(),
      ...(mode === "edit" && { id: data.id, guid: data.guid }),
      ...tyreData,
    };

    try {
      const response = mode === "edit"
        ? await editTyreRegistration(payload)
        // ? await addNewTyreRegistration(payload)
        : await addNewTyreRegistration(payload);

      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.statusMessage || "Operation successful");
        handleRefresh();
        handleClose();
      } else {
        toast.error(response?.data?.statusMessage || "Failed to process the request.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || "Something went wrong");
    }
  };

  // Toggle tyre fields
  const toggleTyreFields = () => {
    if (showMore) {
      setTyreFields(["Tyre1", "Tyre2", "Tyre3", "Tyre4"]);
    } else {
      const nextFields = Array.from({ length: 28 }, (_, index) => `Tyre${index + 5}`);
      setTyreFields((prevFields) => [...prevFields, ...nextFields]);
    }
    setShowMore((prev) => !prev);
  };
  const [lastKeyPressTime, setLastKeyPressTime] = useState(0);

  // Handle the keydown event to detect barcode scanner input
  const handleInputChange = (e, index) => {
    const value = e.target.value;  // Get the input value from the barcode scanner
    setValue(`tyre${index + 1}`, value); // Update the value in react-hook-form state
    // You can also add logic to validate the input or change its status (e.g., "valid" or "invalid")
    setTyreStatus(prevState => ({
      ...prevState,
      [`tyre${index + 1}`]: value ? "valid" : "invalid", // Example logic to manage input status
    }));
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission when Enter is pressed (common for barcode scanners)

      // Find the next input field and focus on it
      const nextInput = document.querySelector(`#tyre${index + 2}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  const resetForm = () => {
    reset(); // Resets all fields using react-hook-form
    setTyreFields(["Tyre1", "Tyre2", "Tyre3", "Tyre4"]); // Resets to the default 4 tyre fields
    setShowMore(false); // Reset the "Show More" toggle
    setTyreStatus({}); // Clears the tyre validation statuses
  };
  const checktyre = (ind) => {
    if (data[`tyre${ind}`]) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered custom-modal-two">
        <div className="modal-content">
          <div className="modal-header border-0 custom-modal-header">
            <h4>{mode === "edit" ? "Edit Tyre Registration" : "Add Tyre Registration"}</h4>
            <button type="button" className="close" onClick={handleClose}>×</button>
          </div>
          <div className="modal-body custom-modal-body">
            <form onSubmit={handleSubmit(handleFormSubmit)} autoComplete="off">
              <div className="row">
                {/* Event Dropdown */}
                <div className="col-lg-6">
                  <div className="input-blocks">
                    <label>Event <span className="text-danger">*</span></label>
                    <select
                      {...register("event", { required: "Event is required" })}
                      className="form-control"
                    >

                      {eventList?.map((event) => (
                        <option key={event.guid} value={event.guid}>{event.name}</option>
                      ))}
                    </select>
                    {errors.event && <p className="text-danger">{errors.event.message}</p>}
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="col-lg-6">
                  <div className="input-blocks">
                    <label>Category <span className="text-danger">*</span></label>
                    <select
                      {...register("category", { required: "Category is required" })}
                      className="form-control"
                        autoComplete="off"
                    >
                      <option value="">Select Category</option>
                      {categoryList?.map((category) => (
                        <option key={category.guid} value={category.guid}>{category.name}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-danger">{errors.category.message}</p>}
                  </div>
                </div>

                {/* Full Name */}
                <div className="col-lg-6">
                  <div className="input-blocks">
                    <label>Full Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("fullname", { required: "Full Name is required" })}
                      autoComplete="off"  
                    />
                    {errors.fullname && <p className="text-danger">{errors.fullname.message}</p>}
                  </div>
                </div>

                {/* Race Number */}
                <div className="col-lg-6">
                  <div className="input-blocks">
                    <label>Race Number <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("racernumber", { required: "Race Number is required" })}
                      autoComplete="off"
                        
                    />
                    {errors.racernumber && <p className="text-danger">{errors.racernumber.message}</p>}
                  </div>
                </div>

                {/* Remarks */}
                <div className="col-lg-12">
                  <div className="input-blocks">
                    <label>Remarks</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("remarks")}
                       autoComplete="off"
                    />
                  </div>
                </div>

                {/* Tyre Fields */}
              
                {tyreFields.map((field, index) => (
                  <div className="col-lg-6" key={index}>
                    <div className="input-blocks">
                      <label>Tyre {index + 1}</label>
                      <input
  id={`tyre${index + 1}`} // Assign a unique ID to each field
  type="text"
  className={`form-control mb-2`}
  disabled={mode === "edit" && checktyre(index+1)} // Disable logic
  {...register(`tyre${index + 1}`, {
    validate: (value) => {
      const selectedTyres = tyreFields
        .map((_, idx) => getValues(`tyre${idx + 1}`))
        .filter((val) => val.trim() !== ""); // Exclude empty values
      const isDuplicate = selectedTyres.filter((val) => val === value).length > 1;
      return !isDuplicate || "Duplicate tyre detected!";
    },
  })}
  onBlur={(e) => handlevarifytyre(e, index)} // Tyre validation
  onInput={(e) => handleInputChange(e, index)} // Barcode input handling
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = document.getElementById(`tyre${index + 2}`);
      if (nextInput) {
        nextInput.focus(); // Focus on the next input field
      } else if (index + 1 === tyreFields.length) {
        // If it's the last field, loop back to the first field
        document.getElementById("tyre1")?.focus();
      }
    }
  }}
  autoComplete="off" 
/>

                      {errors[`tyre${index + 1}`] && (
                        <span className="text-danger small mt-1">
                          {errors[`tyre${index + 1}`].message}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Buttons */}
                <div className="col-lg-12">
                  <div className="mt-3">
                    <button type="button" className="btn btn-link" onClick={toggleTyreFields}>
                      {showMore ? "Show Less" : "Show More"}
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {mode === "edit" ? "Update" : "Submit"}
                    </button>
                    <button
        type="button"
        className="btn btn-secondary m-2"
        onClick={resetForm} // Calls the resetForm function
      >
        Reset
      </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TyreRegModalForm;
