import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [otpSent, setOtpSent] = useState(false);

  // Redirect if Super Admin already exists
  useEffect(() => {
    if (localStorage.getItem("superAdminCreated")) {
      alert("Super Admin already created. Redirecting to Login.");
      navigate("/sig-in");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Partial errors object
    let fieldError: Partial<FormErrors> = {};

    switch (name) {
      case "fullName":
        if (!/^[A-Za-z ]*$/.test(value)) {
          fieldError.fullName = "Please enter only alphabets";
        } else if (value.length > 0 && value.length < 3) {
          fieldError.fullName = "Please enter at least 3 characters long";
        } else {
          fieldError.fullName = "";
        }
        break;

      case "email":
        if (!value) {
          fieldError.email = "This field is required";
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          fieldError.email = "Please enter a valid email";
        } else {
          fieldError.email = "";
        }
        break;

      case "phone":
        if (!/^[0-9]*$/.test(value)) {
          fieldError.phone = "Only numbers are allowed";
        } else if (value.length > 0 && value.length !== 10) {
          fieldError.phone = "Phone number must be 10 digits";
        } else {
          fieldError.phone = "";
        }
        break;

      case "password":
        if (!value) {
          fieldError.password = "This field is required";
        } else if (!/^(?=.*[A-Z]).{8,}$/.test(value)) {
          fieldError.password =
            "Password must be at least 8 characters and contain 1 uppercase letter";
        } else {
          fieldError.password = "";
        }

        // Validate confirmPassword as well
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          fieldError.confirmPassword = "Passwords do not match";
        } else {
          fieldError.confirmPassword = "";
        }
        break;

      case "confirmPassword":
        if (!value) {
          fieldError.confirmPassword = "This field is required";
        } else if (value !== formData.password) {
          fieldError.confirmPassword = "Passwords do not match";
        } else {
          fieldError.confirmPassword = "";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, ...fieldError }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if Super Admin already exists
    if (localStorage.getItem("superAdminCreated")) {
      alert("Super Admin already created");
      navigate("/login");
      return;
    }

    // Validation on submit
    let newErrors: Partial<FormErrors> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "This field is required";
    if (!formData.email.trim()) newErrors.email = "This field is required";
    if (!formData.phone.trim()) newErrors.phone = "This field is required";
    if (!formData.password.trim()) newErrors.password = "This field is required";
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "This field is required";

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors as FormErrors);

    if (Object.keys(newErrors).length === 0) {
      // Simulate OTP sending
      setOtpSent(true);
      // TODO: Replace with actual OTP service

      // Mark Super Admin as created in localStorage
      localStorage.setItem("superAdminCreated", "true");

      // Redirect to login after short delay
      setTimeout(() => {
        alert("Super Admin created successfully! Redirecting to Login.");
        navigate("/");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-15">
      <div className="w-[900px] max-w-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-black mb-6">
          Create Super Admin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-[18px]">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full h-[42px] rounded-lg border border-gray-300 px-3 text-[15px]"
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-[42px] rounded-lg border border-gray-300 px-3 text-[15px]"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Phone
            </label>
            <div className="flex">
              <select className="w-[120px] h-[42px] border border-gray-300 rounded-lg px-2 text-[15px] bg-white">
                <option value="+971">🇦🇪 +971</option>
                <option value="+92">🇵🇰 +92</option>
                <option value="+91">🇮🇳 +91</option>
              </select>

              <input
                type="text"
                name="phone"
                placeholder="55-123-4567"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                className="flex-1 ml-2 h-[42px] rounded-lg border border-gray-300 px-3 text-[15px]"
              />
            </div>
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-[42px] rounded-lg border border-gray-300 px-3 text-[15px]"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full h-[42px] rounded-lg border border-gray-300 px-3 text-[15px]"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {otpSent && (
            <p className="text-green-600 text-sm mt-1">
              OTP sent to phone and email (frontend simulation)
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-brand-500 text-white font-medium py-2.5 rounded-lg hover:opacity-90 transition"
          >
            Create Super Admin
          </button>



          {/* Sign Up link below submit button */}
          <p className="">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign In
            </button>
          </p>


        </form>
      </div>
    </div>
  );
}
