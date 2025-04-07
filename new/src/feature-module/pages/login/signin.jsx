
import React, { useState } from "react";




const Signin = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  
 
  return (
    <div className="main-wrapper">
    <div className="account-content">
      <div className="login-wrapper bg-img">
        <div className="login-content">
          <div className="login-userset">
            <div className="login-logo logo-normal">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpvufdQcTzvRfoE5lb3e1uxjnoEqkDbtFb-g&s"              
                alt="img"
              />
            </div>

            <div className="login-userheading">
              <h3>Sign In</h3>
            </div>

            <form>
              <div className="form-login mb-3">
                <label className="form-label">User Name</label>
                <div className="form-addons">
                  <input
                    type="text"
                    className="form-control"
                    // {...register("UserName", { required: true })}
                  />
                </div>
                
                  <span className="error text-danger">User name is required</span>
              
              </div>
              <div className="form-login mb-3">
                <label className="form-label">Password</label>
                <div className="pass-group">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    className="pass-input form-control"
                    // {...register("Password", { required: true })}
                  />
                  <span
                    className={`fas toggle-password ${
                      isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                    }`}
                    onClick={togglePasswordVisibility}
                  ></span>
                </div>
                
                  <span className="error text-danger">Password is required</span>
              
              </div>

              <div className="form-login">
                <button type="submit" className="btn btn-login">
                  Sign In
                </button>
              </div>
            </form>

            <div className="form-sociallink">
              <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                <p>
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
};

export default Signin;
