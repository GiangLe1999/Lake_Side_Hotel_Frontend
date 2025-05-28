import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { roomSchema } from "../../../utils/room-form-schema";
import { addRoom, getRoomTypes } from "../../../service/room-service";
import { Loading } from "../../common/Loading";

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
        setAmenities([""]);
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
  const [amenities, setAmenities] = useState([""]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(roomSchema),
    defaultValues: {
      type: "",
      customType: "",
      summary: "",
      description: "",
      area: "",
      beds: "",
      amenities: [""],
      thumbnail: null,
      images: null,
      price: "",
    },
  });

  // Watch type field để handle custom type
  const watchType = watch("type");

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

  // Xử lý amenities
  const handleAddAmenity = () => {
    const newAmenities = [...amenities, ""];
    setAmenities(newAmenities);
    setValue("amenities", newAmenities);
  };

  const handleRemoveAmenity = (index) => {
    const newAmenities = amenities.filter((_, i) => i !== index);
    setAmenities(newAmenities);
    setValue("amenities", newAmenities);
  };

  const handleAmenityChange = (index, value) => {
    const newAmenities = [...amenities];
    newAmenities[index] = value;
    setAmenities(newAmenities);
    setValue("amenities", newAmenities);
  };

  const onSubmit = (data) => {
    const roomType = data.type === "new" ? data.customType : data.type;
    addRoomMutation({
      type: roomType,
      summary: data.summary,
      description: data.description,
      area: parseFloat(data.area),
      beds: data.beds,
      amenities: data.amenities.filter((amenity) => amenity.trim() !== ""), // Lọc bỏ amenities rỗng
      thumbnail: data.thumbnail[0],
      images: Array.from(data.images),
      price: parseFloat(data.price),
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

  // Update isCustomType khi type thay đổi
  useEffect(() => {
    setIsCustomType(watchType === "new");
  }, [watchType]);

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

        {/* Custom Type Input */}
        {isCustomType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New room type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("customType")}
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

        {/* Trường Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Summary <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("summary")}
            placeholder="Brief summary of the room"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.summary ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.summary && (
            <p className="mt-1 text-sm text-red-600">
              {errors.summary.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">Maximum 255 characters</p>
        </div>

        {/* Trường Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("description")}
            placeholder="Detailed description of the room"
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">Maximum 1000 characters</p>
        </div>

        {/* Trường Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area (m²) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("area")}
            placeholder="e.g., 25 or 25.5"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.area ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.area && (
            <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
          )}
        </div>

        {/* Trường Beds */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bed Information <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("beds")}
            placeholder="e.g., 1 King bed, 2 Single beds"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.beds ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.beds && (
            <p className="mt-1 text-sm text-red-600">{errors.beds.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Maximum 100 characters</p>
        </div>

        {/* Trường Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amenities <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={amenity}
                  onChange={(e) => handleAmenityChange(index, e.target.value)}
                  placeholder={`Amenity ${index + 1}`}
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.amenities && errors.amenities[index]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {amenities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAmenity}
              className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-xs"
            >
              Add Amenity
            </button>
          </div>
          {errors.amenities && (
            <p className="mt-1 text-sm text-red-600">
              {errors.amenities.message ||
                (errors.amenities[0] && errors.amenities[0].message)}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Maximum 100 characters per amenity
          </p>
        </div>

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
          <p className="mt-1 text-xs text-gray-500">Maximum file size: 5MB</p>

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
            <span className="text-gray-500 text-xs ml-1">
              (Maximum 5 images)
            </span>
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
          <p className="mt-1 text-xs text-gray-500">
            Maximum file size per image: 5MB
          </p>

          {/* Images Preview */}
          {imagesPreview.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
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

        {/* Trường Price */}
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
              placeholder="e.g., 1500000 or 1500000.00"
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
            {addRoomPending ? <Loading /> : "Add Room"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoomForm;
