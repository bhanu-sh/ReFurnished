import { useFormik } from "formik";
import React from "react";
import Swal from "sweetalert2";
import UseAppContext from "../AppContext";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const { setLoggedin } = UseAppContext();

  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    onSubmit: async (values) => {
      console.log(values);

      const res = await fetch('http://localhost:5000/user/authenticate', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type' : 'application/json'
        }
      });

      console.log(res.status);

      if(res.status === 200){
        Swal.fire({
          icon: "success",
          title: "Login Successful",
        })

        .then((result) => {
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
        });

        const data = await res.json();

        console.log(data);

        sessionStorage.setItem('user', JSON.stringify(data));

        setLoggedin(true);

      }else if(res.status === 401){
        Swal.fire({
          icon: "error",
          title:"Invalid Credentials",
          text: "Email or password is incorrect"
        })
      }else{
        Swal.fire({
          icon: "error",
          title:'Error Occured!',
          text: "SOmething went wrong"
        })
      }

    },
  });

  return (
    <div className="py-5 vh-100 bg-body-secondary">
      <div className="col-md-3 mx-auto">
        <div className="card">
          <div className="card-body">
            <form onSubmit={loginForm.handleSubmit}>
              <h2 className="text-center my-5">Login Here</h2>

              <label>Email</label>
              <input
                id="email"
                onChange={loginForm.handleChange}
                value={loginForm.values.email}
                type="email"
                className="form-control mb-4"
              />
              <label>Password</label>
              <input
                id="password"
                onChange={loginForm.handleChange}
                value={loginForm.values.password}
                type="password"
                className="form-control mb-4"
              />

              <button type="submit" className="btn btn-primary w-100 mt-4">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;