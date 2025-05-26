import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { roomSchema } from "../../../utils/room-form-schema";
import { addRoom, getRoomTypes } from "../../../service/room-service";

// Validation schema using Yup

const AddRoomForm = () => {
  // Get room types query
  const { data: roomTypes, isLoading: getRoomTypesLoading } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: getRoomTypes,
    select: (res) => res.data.data, // chỉ lấy phần data từ response
  });

  // Add room mutation
  const { mutate: addRoomMutation, isPending: addRoomPending } = useMutation({
    mutationFn: addRoom,
    onSuccess: ({ data }) => {
      if (data.status === 201) {
        toast.success("Add room successfully No. " + data.data);
        reset();

        // Giải phóng URL preview
        URL.revokeObjectURL(thumbnailPreview);
        imagesPreview.forEach((url) => URL.revokeObjectURL(url));
        setThumbnailPreview(null);
        setImagesPreview([]);
        setIsCustomType(false);
      } else {
        toast.error("Failed to add room", data.message);
      }
    },
    onError: (err) => {
      toast.error("Failed to add room," + err.message);
    },
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [isCustomType, setIsCustomType] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(roomSchema),
    defaultValues: {
      type: "",
      thumbnail: null,
      images: null,
      price: "",
    },
  });

  // URL.createObjectURL(file) sẽ tạo ra một URL tạm để trình duyệt sử dụng cho việc hiển thị (preview) file ảnh.
  // Tuy nhiên, nó chiếm bộ nhớ, và không được giải phóng tự động.
  // Bạn nên gọi URL.revokeObjectURL() để giải phóng URL tạm mỗi khi không dùng nữa, ví dụ: khi người dùng chọn ảnh mới, hoặc khi component unmount.

  // Xử lý thumbnail preview
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Giải phóng URL cũ trước khi tạo mới để tránh memory leak
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      setThumbnailPreview(null);
    }
  };

  // Xử lý images preview
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Giải phóng URL cũ trước khi tạo mới để tránh memory leak
      imagesPreview.forEach((url) => URL.revokeObjectURL(url));

      const previews = files.map((file) => URL.createObjectURL(file));
      setImagesPreview(previews);
    } else {
      // Giải phóng URL cũ khi không chọn file
      imagesPreview.forEach((url) => URL.revokeObjectURL(url));
      setImagesPreview([]);
    }
  };

  const onSubmit = (data) => {
    const roomType = data.type === "new" ? data.customType : data.type;
    addRoomMutation({
      type: roomType,
      thumbnail: data.thumbnail[0],
      images: Array.from(data.images),
      price: data.price,
    });
  };

  // Giải phóng URL khi component unmount
  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      imagesPreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Room</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Trường Type (Select) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room type <span className="text-red-500">*</span>
          </label>
          <select
            {...register("type")}
            onChange={(e) => {
              const value = e.target.value;
              setIsCustomType(value === "new");
              register("type").onChange(e);
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.type ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Choose room type --</option>
            {!getRoomTypesLoading &&
              roomTypes &&
              roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            <option value="new">-- Add new room type --</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        {isCustomType && (
          <div className="mt-2">
            <input
              type="text"
              {...register("customType", {
                required: "Please enter a new room type",
              })}
              placeholder="Enter new room type"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.customType ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.customType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customType.message}
              </p>
            )}
          </div>
        )}

        {/* Trường Thumbnail (Single File) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room thumbnail <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("thumbnail")}
            onChange={(e) => {
              register("thumbnail").onChange(e);
              handleThumbnailChange(e);
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.thumbnail ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.thumbnail && (
            <p className="mt-1 text-sm text-red-600">
              {errors.thumbnail.message}
            </p>
          )}

          {/* Thumbnail Preview */}
          {thumbnailPreview && (
            <div className="mt-3">
              <div className="relative inline-block group">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setThumbnailPreview(null);
                    URL.revokeObjectURL(thumbnailPreview);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Trường Images (Multiple Files) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room images <span className="text-red-500">*</span>
            <span className="text-gray-500 text-xs ml-1">(Tối đa 5 ảnh)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            {...register("images")}
            onChange={(e) => {
              register("images").onChange(e);
              handleImagesChange(e);
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.images ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.images && (
            <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
          )}

          {/* Images Preview */}
          {imagesPreview.length > 0 && (
            <div className="mt-3 flex items-center gap-3">
              {imagesPreview.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 aspect-square object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // Xóa preview tại index này
                      URL.revokeObjectURL(preview);
                      setImagesPreview((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trường Price (String to BigDecimal) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
              $
            </span>
            <input
              type="text"
              {...register("price")}
              placeholder="Eg: 1500000"
              className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        {/* Nút Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={addRoomPending}
            className={`cursor-pointer quicksand-semibold w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              addRoomPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {addRoomPending ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Add Room"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoomForm;
