import * as yup from "yup";

const isImageFile = (file) => {
  // Check MIME type first
  if (file.type && file.type.startsWith("image/")) {
    return true;
  }

  // If MIME type is generic, check file extension
  if (file.type === "application/octet-stream" || !file.type) {
    const extension = file.name.toLowerCase().split(".").pop();
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "bmp",
      "svg",
      "ico",
      "tiff",
      "tif",
    ];
    return imageExtensions.includes(extension);
  }

  return false;
};

const validateImageFileList = (fileList) => {
  if (!fileList || fileList.length === 0) return false;

  for (let i = 0; i < fileList.length; i++) {
    if (!isImageFile(fileList[i])) {
      return false;
    }
  }
  return true;
};

export const roomSchema = yup.object().shape({
  type: yup.string().required("Please select a room type"),
  customType: yup.string().when("type", {
    is: "new",
    then: (schema) => schema.required("Please enter a new room type"),
  }),
  summary: yup
    .string()
    .required("Please enter a room summary")
    .max(255, "Summary must be at most 255 characters"),
  description: yup.string().required("Please enter a room description"),
  area: yup
    .string()
    .required("Please enter the room area")
    .matches(/^[0-9]+(\.[0-9]{1,2})?$/, "Area must be a valid number")
    .test("isPositive", "Area must be greater than 0", (value) => {
      return parseFloat(value) > 0;
    }),
  beds: yup
    .string()
    .required("Please enter bed information")
    .max(100, "Beds description must be at most 100 characters"),
  amenities: yup
    .array()
    .of(
      yup
        .string()
        .required("Amenity cannot be empty")
        .max(50, "Each amenity must be at most 50 characters")
    )
    .min(1, "Please add at least one amenity"),
  features: yup
    .array()
    .of(
      yup
        .string()
        .required("Feature cannot be empty")
        .max(50, "Each feature must be at most 50 characters")
    )
    .min(1, "Please add at least one feature"),
  totalRooms: yup
    .string()
    .required("Please enter the total rooms")
    .matches(/^\d+$/, "Total rooms must be a valid number")
    .test("isPositive", "Total rooms must be at least 1", (value) => {
      if (!value) return true; // Không nhập thì hợp lệ
      return parseInt(value, 10) >= 1;
    }),
  thumbnail: yup
    .mixed()
    .test("required", "Please select a thumbnail image", (value) => {
      return value && value.length > 0;
    })
    .test("fileType", "Please select a valid image file", (value) => {
      if (!value || !value.length) return false;
      return isImageFile(value[0]);
    })
    .test("fileSize", "File size must not exceed 5MB", (value) => {
      if (!value || !value[0]) return true;
      return value[0].size <= 5 * 1024 * 1024; // 5MB
    }),
  images: yup
    .mixed()
    .test("required", "Please select at least one detail image", (value) => {
      return value && value.length > 0;
    })
    .test("fileTypes", "All files must be valid image files", (value) => {
      if (!value || !value.length) return false;
      return validateImageFileList(value);
    })
    .test("fileSize", "Each file must not exceed 5MB", (value) => {
      if (!value || value.length === 0) return true;
      return Array.from(value).every((file) => file.size <= 5 * 1024 * 1024); // 5MB
    })
    .test("maxFiles", "You can upload up to 5 images only", (value) => {
      if (!value) return true;
      return value.length <= 5;
    }),
  price: yup
    .string()
    .required("Please enter the room price")
    .matches(
      /^[0-9]+(\.[0-9]{1,2})?$/,
      "Please enter a valid price (e.g., 1500000 or 1500000.00)"
    )
    .test("isPositive", "Price must be greater than 0", (value) => {
      return parseFloat(value) > 0;
    }),
});
