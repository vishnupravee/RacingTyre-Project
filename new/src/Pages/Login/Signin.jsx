import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from '../../core/img/QMMF.png'
// import { setuserId } from "../../redux/userdetails";
import { getUserLogin } from "../../core/services/UserMasterApiServices";
import { setuserDetail } from "../../redux/userdetail";

const SignIn = () => {
  useEffect(() => {
    sessionStorage.setItem("signin", "false");
  }, [])
  
    const {
        register,
        formState: { errors },
        handleSubmit,
      } = useForm({
        mode: "onChange",
        reValidateMode: "onChange",
      });
      const [isPasswordVisible, setPasswordVisible] = useState(false);
     

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
      };
      const handleSetFlag = () => {
        sessionStorage.setItem("signin", "true");
      };
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
      const handleLogin = async (formData) => {
      
        try {
          // Call AuthenticateUser API
          const response = await getUserLogin({username:formData.UserName, password: formData.Password});
          console.log(response,"loooogin");
      
          // if (response) {
          //   const userId = response;
      
          //   // Validate userId is in UUID format
          //   if (uuidRegex.test(userId)) {
              
          //     toast.success("Login Success");
      
          //     // Set flag (if necessary)
          //     handleSetFlag();
      
          //     // Fetch branches by user ID and then call handleBranch after dispatch is resolved
            
      
          //     // Navigate to the dashboard after setting branch
          //     navigate('/Home/BranchDashboard');
      
          //   } else {
          //     toast.error("Invalid Username or Password");
          //   }
          // } else {
          //   toast.error("Authentication failed");
          // }
          if (response) {
            
            if (response.statusCode === 200) {
                toast.success(response.statusMessage);
                dispatch(setuserDetail(response))
                handleSetFlag();
                navigate('/event');
            } else {
                toast.info("Something was processed, but not fully successful.");
            }
           
        } else {
            toast.error("Failed to process the request.");
        }
        } catch (error) {
          console.log('Error:', error);
          toast.error(error?.message || "An unexpected error occurred");
        }
      };

      return (
        <div className="main-wrapper">
          <div className="account-content">
            <div className="login-wrapper bg-img">
              <div className="login-content">
                <div className="login-userset">
                  <div className="login-logo logo-normal">
                    <img className="rounded"
                     src={logo}
                    />
                  </div>
    
                  <div className="login-userheading">
                    <h3 style={{color:"silver"}}>Sign In</h3>
                  </div>
                  <form onSubmit={handleSubmit(handleLogin)}>
                    <div className="form-login mb-3">
                      <label className="form-label"style={{color:"silver"}}>User Name</label>
                      <div className="form-addons">
                        <input
                          type="text"
                          className="form-control"
                          {...register("UserName", { required: true })}
                        />
                      </div>
                      {errors.UserName?.type === "required" && (
                        <span className="error text-danger">User name is required</span>
                      )}
                    </div>
                    <div className="form-login mb-3">
                      <label className="form-label" style={{color:"silver"}}>Password</label>
                      <div className="pass-group">
                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          className="pass-input form-control"
                          {...register("Password", { required: true })}
                        />
                        <span
                          className={`fas toggle-password ${
                            isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                          }`}
                          onClick={togglePasswordVisibility}
                        ></span>
                      </div>
                      {errors.Password?.type === "required" && (
                        <span className="error text-danger">Password is required</span>
                      )}
                    </div>
    
                    <div className="form-login">
                      <button type="submit" className="btn btn-login">
                        Sign In
                      </button>
                    </div>
                  </form>
    
                  <div className="form-sociallink">
                    <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                      <p style={{color:"silver"}}>
                        Copyright © {new Date().getFullYear()} Axobis. All rights
                        reserved
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default SignIn