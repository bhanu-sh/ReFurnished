import { useFormik } from "formik";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useState } from "react";
import { motion } from "framer-motion";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, "Min. 4 characters req.")
    .required("Name is Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  admincode: Yup.string().required("Admin Code Required"),
});

const AdminSignup = () => {
  const navigate = useNavigate();

  const [selFile, setSelFile] = useState("");
  const [uploading, setUploading] = useState(false);

  // initialize the formik
  const signupForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      avatar: "",
      isAdmin: false,
    },
    onSubmit: async (values, { setSubmitting }) => {
      values.avatar = selFile;
      if (values.admincode === process.env.REACT_APP_ADMIN_CODE) {
        values.isAdmin = true;
        setSubmitting(true);

        setTimeout(() => {
          console.log(values);
          setSubmitting(false);
        }, 3000);

        // send the data to the server

        const res = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/user/add",
          {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(res.status);

        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Nice",
            text: "You have signed up successfully",
          })
            .then((result) => {
              navigate("/login");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops!!",
            text: "Something went wrong",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!!",
          text: "Admin Code is wrong",
        }).then((result) => {
          navigate("/adminsignup");
        });
      }
    },
    validationSchema: SignupSchema,
  });

  const uploadFile = async (e) => {
    try {
      setUploading(true);
      if (!e.target.files) return;

      const file = e.target.files[0];
      console.log(file.name);

      const fd = new FormData();
      fd.append("myfile", file);

      const res = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/util/uploadfile",
        {
          method: "POST",
          body: fd,
        }
      );

      const data = await res.json();

      if (res.status === 200) {
        setSelFile(data.fileUrl);
        console.log(data.fileUrl);
      } else {
        console.error("File upload failed");
      }
      console.log(res.status);
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      style={{ height: "100vh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="col-md-4 mx-auto mt-5">
        <div className="card shadow">
          <div className="card-body ">
            <form onSubmit={signupForm.handleSubmit}>
              <h3 className="text-center">Signup Form</h3>
              <div className="row text-center mb-4">
                <Link
                  to={"/signup"}
                  className="text-decoration-none col-md-6 text-black"
                >
                  <div>
                    <h5>User</h5>
                  </div>
                </Link>
                <Link
                  to={"/adminsignup"}
                  className="text-decoration-none col-md-6 border-bottom border-danger border-4 text-danger"
                >
                  <div>
                    <h5>Admin</h5>
                  </div>
                </Link>
              </div>

              <label>Admin Code</label>
              <span
                style={{
                  fontSize: "0.8em",
                  color: "red",
                  marginLeft: 20,
                }}
              >
                {signupForm.touched.admincode && signupForm.errors.admincode}
              </span>
              <input
                type="text"
                className="form-control"
                name="admincode"
                onChange={signupForm.handleChange}
                value={signupForm.values.admincode}
              />

              <label>Name</label>
              <span style={{ fontSize: "0.8em", color: "red", marginLeft: 20 }}>
                {signupForm.touched.name && signupForm.errors.name}
              </span>
              <input
                type="text"
                className="form-control mb-4"
                name="name"
                onChange={signupForm.handleChange}
                value={signupForm.values.name}
              />

              <label>Email</label>
              <span style={{ fontSize: "0.8em", color: "red", marginLeft: 20 }}>
                {signupForm.touched.email && signupForm.errors.email}
              </span>
              <input
                className="form-control mb-4"
                name="email"
                onChange={signupForm.handleChange}
                value={signupForm.values.email}
              />

              <label>Password</label>
              <span style={{ fontSize: "0.8em", color: "red", marginLeft: 20 }}>
                {signupForm.errors.password}
              </span>
              <input
                type="password"
                className="form-control mb-4"
                name="password"
                onChange={signupForm.handleChange}
                value={signupForm.values.password}
              />

              <label>Upload Profile Picture</label>
              <input
                className="form-control mb-4"
                type="file"
                onChange={uploadFile}
              />

              <button
                disabled={signupForm.isSubmitting || uploading}
                type="submit"
                className="btn btn-danger mt-5 w-100"
              >
                {signupForm.isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                    ></span>
                    <span>Loading ...</span>
                  </>
                ) : (
                  <>{uploading ? "Uploading..." : "Submit"}</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSignup;
