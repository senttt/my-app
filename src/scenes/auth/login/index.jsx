import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { auth, signInWithEmailAndPassword } from "../../../backend/firebase";
import { useState } from "react";

const Login = ({ onLoginSuccess }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to handle login
  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    setErrorMessage(""); // Reset previous errors
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      console.log("Login successful!");
      resetForm();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error.code === "auth/invalid-credential"
          ? "Invalid email or password"
          : "An error occurred during login. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="LOGIN" subtitle="Access your account" />

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
                {isSubmitting ? "Logging in..." : "Login"}
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
  email: "",
  password: "",
};

// Validation Schema
const checkoutSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default Login;
