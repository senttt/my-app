import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  auth,
  createUserWithEmailAndPassword,
} from "../../../backend/firebase";
import { useState } from "react";
import { updateProfile } from "firebase/auth";

const Register = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    setErrorMessage(""); // Reset previous errors
    try {
      // Creating a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // Update the user's profile with their full name
      await updateProfile(userCredential.user, {
        displayName: values.fullName,
      });

      console.log("Registration successful!");
      resetForm();
    } catch (error) {
      console.error("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage(
          "The email address is already in use by another account."
        );
      } else {
        setErrorMessage(
          "An error occurred during registration. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box m="20px">
      <Typography variant="h4">Register</Typography>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns={isNonMobile ? "repeat(4, 1fr)" : "1fr"}
              sx={{
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              {/* Full Name Field */}
              <TextField
                fullWidth
                variant="filled"
                label="Full Name"
                name="fullName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fullName}
                error={!!touched.fullName && !!errors.fullName}
                helperText={touched.fullName && errors.fullName}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Email Field */}
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Password Field */}
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            {/* Display Error Message */}
            {errorMessage && (
              <Box mt={2} textAlign="center">
                <Typography color="error" variant="body2">
                  {errorMessage}
                </Typography>
              </Box>
            )}

            <Box display="flex" justifyContent="center" mt="20px" gap="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  minWidth: "120px",
                  padding: "10px 20px",
                }}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// Initial Values
const initialValues = {
  fullName: "",
  email: "",
  password: "",
};

// Validation Schema
const checkoutSchema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
});

export default Register;
