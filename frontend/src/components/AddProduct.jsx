import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { motion } from "framer-motion";

const AddProduct = () => {
  const navigate = useNavigate();
  const [selFile, setSelFile] = useState("");
  const [uploading, setUploading] = useState(false);

  const ProductSchema = Yup.object().shape({
    title: Yup.string()
      .min(4, "Min. 4 characters required")
      .required("Product Name is Required"),
    type: Yup.string().required("Type of Furniture is Required"),
    description: Yup.string()
      .min(4, "Min. 4 characters required")
      .required("Product Description is Required"),
    year: Yup.number()
      .typeError("Year must be a valid number")
      .required("Year of Purchase is Required")
      .integer("Year must be a whole number (no decimals)")
      .positive("Year must be a positive number")
      .min(4, "Year should be a 4-digit number")
      .test("valid-year", "Please enter a valid year", (value) => {
        return value >= 1950 && value <= 2023;
      }),
  });

  const productForm = useFormik({
    initialValues: {
      title: "",
      type: "",
      description: "",
      year: "",
      image: "",
      price: "",
      user_id: JSON.parse(sessionStorage.user)._id,
      user_name: JSON.parse(sessionStorage.user).name,
    },
    onSubmit: async (values, { setSubmitting }) => {
      values.image = selFile;
      setSubmitting(true);

      setTimeout(() => {
        console.log(values);
        setSubmitting(false);
      }, 3000);

      // send the data to the server

      const res = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/product/add",
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
          text: "Your Product is added successfully",
        })
          .then((result) => {
            navigate("/myproducts");
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
    },
    validationSchema: ProductSchema,
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
      className="py-5"
      style={{ height: "100vh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="col-md-4 mx-auto">
        <div className="card shadow">
          <div className="card-body ">
            <form className="" onSubmit={productForm.handleSubmit}>
              <h3 className="text-center">Add Furniture</h3>
              <label>Product Name</label>
              <span style={{ fontSize: "0.8em", color: "red", marginLeft: 20 }}>
                {productForm.touched.title && productForm.errors.title}
              </span>
              <input
                className="form-control"
                type="text"
                name="title"
                onChange={productForm.handleChange}
                value={productForm.values.title}
              />
              <label>Type of Furniture:</label>
              <span style={{ fontSize: "0.8em", color: "red", marginLeft: 20 }}>
                {productForm.touched.type && productForm.errors.type}
              </span>
              <select
                className="form-control"
                name="type"
                onChange={productForm.handleChange}
                value={productForm.values.type}
              >
                <option value="">Select</option>
                <option value="Sofa">Sofa</option>
                <option value="Bed">Bed</option>
                <option value="Table">Table</option>
                <option value="Chair">Chair</option>
              </select>
              <label>Product Description:</label>
              <span style={{ fontSize: "0.8em", color: "red", marginLeft: 20 }}>
                {productForm.touched.description &&
                  productForm.errors.description}
              </span>
              <textarea
                className="form-control"
                name="description"
                id="desc"
                cols="30"
                rows="5"
                onChange={productForm.handleChange}
                value={productForm.values.description}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const currentValue = productForm.values.description || "";
                    const cursorPosition = e.target.selectionStart;
                    const newValue =
                      currentValue.substring(0, cursorPosition) +
                      "\n" +
                      currentValue.substring(cursorPosition);
                    productForm.setFieldValue("description", newValue);
                  }
                }}
              ></textarea>
              <label>Purchased in Year:</label>
              <span style={{ fontSize: "0.8em", color: "red", marginLeft: 20 }}>
                {productForm.touched.year && productForm.errors.year}
              </span>
              <input
                className="form-control"
                type="number"
                name="year"
                onChange={productForm.handleChange}
                value={productForm.values.year}
              />
              {sessionStorage.user &&
              JSON.parse(sessionStorage.user).isAdmin ? (
                <>
                  <label>Price:</label>
                  <input
                    className="form-control"
                    type="number"
                    name="price"
                    onChange={productForm.handleChange}
                    value={productForm.values.price}
                  />
                </>
              ) : null}
              <label>Upload Furniture Picture</label>
              <input
                className="form-control"
                name="image"
                type="file"
                onChange={uploadFile}
              />
              <button
                disabled={productForm.isSubmitting || uploading}
                type="submit"
                className="btn btn-primary mt-5 w-100"
              >
                {productForm.isSubmitting ? (
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

export default AddProduct;
