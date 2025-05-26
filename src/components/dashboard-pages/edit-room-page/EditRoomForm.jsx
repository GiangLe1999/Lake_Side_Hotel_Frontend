import { useCallback, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { editRoom, getRoom, getRoomTypes } from "../../../service/room-service";
import { Loading } from "../../common/Loading";
import { roomSchema } from "../../../utils/room-form-schema";
import {
  getMultiplePublicS3Urls,
  getPublicS3Url,
} from "../../../utils/get-s3-url";
import { urlToFile } from "../../../utils/url-to-file";
import { createFileList } from "../../../utils/create-file-list";

const EditRoomForm = ({ id }) => {
  const { data: roomTypes, isLoading: getRoomTypesLoading } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: getRoomTypes,
    select: (res) => res.data.data,
  });

  const { data: room, isLoading: getRoomLoading } = useQuery({
    queryKey: ["room", id],
    queryFn: () => getRoom(id),
    select: (res) => res.data.data,
  });

  // Original data reference để so sánh
  // useRef giữ được giá trị qua các lần render, nhưng không kích hoạt render lại khi giá trị thay đổi,
  // nên nó phù hợp cho việc lưu trạng thái ẩn, mốc so sánh, hoặc các giá trị chỉ dùng nội bộ logic.
  // nếu dùng useState, mỗi lần bạn cập nhật dữ liệu gốc thì component sẽ re-render
  const originalDataRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [changedFields, setChangedFields] = useState(new Set());

  // Edit room mutation
  const { mutate: editRoomMutation, isPending: editRoomPending } = useMutation({
    mutationFn: ({ id, data }) => editRoom({ id, data }),
    onSuccess: ({ data }) => {
      if (data.status === 200) {
        toast.success("Edit room successfully No. " + data.data);
        // Reset change tracking
        setHasChanges(false);
        setChangedFields(new Set());
        // Update original data reference
        originalDataRef.current = getCurrentFormData();

        // Clean up URLs if any
        cleanupImageUrls();
      } else {
        toast.error("Failed to edit room", data.message);
      }
    },
    onError: (err) => {
      toast.error("Failed to edit room," + err.message);
    },
  });

  // Image handling state
  const [imageState, setImageState] = useState({
    thumbnailPreview: null,
    imagesPreview: [],
    isCustomType: false,
    loadingImages: false,
    // Tracking original image data
    originalThumbnailKey: null,
    originalImageKeys: [],
  });

  // Form state
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm({
    resolver: yupResolver(roomSchema),
    defaultValues: {
      type: "",
      customType: "",
      thumbnail: null,
      images: null,
      price: "",
    },
  });

  // Watch form values để detect changes
  const watchedValues = watch();

  // Utility functions
  const cleanupUrls = useCallback((urls) => {
    urls.forEach((url) => {
      if (url && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
  }, []);

  const cleanupImageUrls = useCallback(() => {
    const allUrls = [
      imageState.thumbnailPreview,
      ...imageState.imagesPreview,
    ].filter(Boolean);
    cleanupUrls(allUrls);
  }, [imageState, cleanupUrls]);

  // Get current form data for comparison
  const getCurrentFormData = useCallback(() => {
    const values = getValues();
    return {
      type: values.type === "new" ? values.customType : values.type,
      price: values.price,
      thumbnail: values.thumbnail,
      images: values.images,
    };
  }, [getValues]);

  // Compare thumbnail files
  const compareThumbnailFiles = useCallback((current, original) => {
    // If both are null/undefined
    if (!current && !original) return true;

    // If one is null and other isn't
    if (!current || !original) return false;

    // If current is FileList, get first file
    const currentFile = current.length ? current[0] : current;
    const originalFile = original.length ? original[0] : original;

    // Compare file properties
    if (!currentFile || !originalFile) return false;

    return (
      currentFile.name === originalFile.name &&
      currentFile.size === originalFile.size &&
      currentFile.type === originalFile.type &&
      currentFile.lastModified === originalFile.lastModified
    );
  }, []);

  // Compare image files arrays
  const compareImageFiles = useCallback((current, original) => {
    // If both are null/undefined
    if (!current && !original) return true;

    // If one is null and other isn't
    if (!current || !original) return false;

    // Convert FileList to Array if needed
    const currentArray = Array.from(current);
    const originalArray = Array.from(original);

    // Compare lengths
    if (currentArray.length !== originalArray.length) return false;

    // Compare each file
    for (let i = 0; i < currentArray.length; i++) {
      const currentFile = currentArray[i];
      const originalFile = originalArray[i];

      if (
        currentFile.name !== originalFile.name ||
        currentFile.size !== originalFile.size ||
        currentFile.type !== originalFile.type ||
        currentFile.lastModified !== originalFile.lastModified
      ) {
        return false;
      }
    }

    return true;
  }, []);

  // Detect changes in form data
  const detectChanges = useCallback(() => {
    if (!originalDataRef.current) return;

    const currentData = getCurrentFormData();
    const originalData = originalDataRef.current;
    const newChangedFields = new Set();

    // Compare basic fields
    if (currentData.type !== originalData.type) {
      newChangedFields.add("type");
    }

    if (currentData.price !== originalData.price) {
      newChangedFields.add("price");
    }

    // Compare thumbnail
    if (!compareThumbnailFiles(currentData.thumbnail, originalData.thumbnail)) {
      newChangedFields.add("thumbnail");
    }

    // Compare images
    if (!compareImageFiles(currentData.images, originalData.images)) {
      newChangedFields.add("images");
    }

    setChangedFields(newChangedFields);
    setHasChanges(newChangedFields.size > 0);
  }, [getCurrentFormData, compareThumbnailFiles, compareImageFiles]);

  // Effect to detect changes when form values change
  // watchedValues là object được lấy từ watch() của react-hook-form.
  // Khi người dùng thay đổi một field, watchedValues sẽ có tham chiếu mới, khiến useEffect chạy lại — vì tham chiếu thay đổi
  // useEffect chỉ kiểm tra xem có phải là một tham chiếu khác so với lần trước hay không.
  useEffect(() => {
    detectChanges();
  }, [
    watchedValues.type,
    watchedValues.customType,
    watchedValues.price,
    watchedValues.thumbnail,
    watchedValues.images,
    detectChanges,
  ]);

  // Check if specific field has changed
  const isFieldChanged = useCallback(
    (fieldName) => {
      return changedFields.has(fieldName);
    },
    [changedFields]
  );

  // Handle thumbnail change
  const handleThumbnailChange = useCallback((e) => {
    const file = e.target.files[0];

    setImageState((prev) => {
      // Cleanup old URL
      if (prev.thumbnailPreview && prev.thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(prev.thumbnailPreview);
      }

      return {
        ...prev,
        thumbnailPreview: file ? URL.createObjectURL(file) : null,
      };
    });
  }, []);

  // Handle multiple images change
  const handleImagesChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files);

      setImageState((prev) => {
        // Cleanup old URLs
        cleanupUrls(
          prev.imagesPreview.filter((url) => url.startsWith("blob:"))
        );

        const previews =
          files.length > 0
            ? files.map((file) => URL.createObjectURL(file))
            : [];

        return {
          ...prev,
          imagesPreview: previews,
        };
      });
    },
    [cleanupUrls]
  );

  // Remove single image preview
  const removeImagePreview = useCallback(
    (index) => {
      setImageState((prev) => {
        const urlToRemove = prev.imagesPreview[index];
        if (urlToRemove && urlToRemove.startsWith("blob:")) {
          URL.revokeObjectURL(urlToRemove);
        }

        const newPreviews = prev.imagesPreview.filter((_, i) => i !== index);

        return {
          ...prev,
          imagesPreview: newPreviews,
        };
      });

      // Reset form images if no previews left
      if (imageState.imagesPreview.length === 1) {
        setValue("images", null);
      }
    },
    [imageState.imagesPreview.length, setValue]
  );

  // Remove thumbnail preview
  const removeThumbnailPreview = useCallback(() => {
    setImageState((prev) => {
      if (prev.thumbnailPreview && prev.thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(prev.thumbnailPreview);
      }

      return {
        ...prev,
        thumbnailPreview: null,
      };
    });

    setValue("thumbnail", null);
  }, [setValue]);

  // Load images from S3 keys
  const loadImagesFromS3 = useCallback(
    async (thumbnailKey, imageKeys) => {
      setImageState((prev) => ({
        ...prev,
        loadingImages: true,
        originalThumbnailKey: thumbnailKey,
        originalImageKeys: imageKeys || [],
      }));

      try {
        // Load thumbnail
        if (thumbnailKey) {
          const thumbnailUrl = getPublicS3Url(thumbnailKey);

          try {
            const thumbnailFile = await urlToFile(thumbnailUrl, thumbnailKey);
            const thumbnailFileList = createFileList([thumbnailFile]);
            setValue("thumbnail", thumbnailFileList, { shouldValidate: true });

            setImageState((prev) => ({
              ...prev,
              thumbnailPreview: thumbnailUrl,
            }));
          } catch (error) {
            console.error("Error loading thumbnail:", error);
            setImageState((prev) => ({
              ...prev,
              thumbnailPreview: thumbnailUrl,
            }));
          }
        }

        // Load multiple images
        if (imageKeys && imageKeys.length > 0) {
          const urlsData = getMultiplePublicS3Urls(imageKeys);

          try {
            const imageFiles = await Promise.all(
              urlsData.map(({ key, url }) => urlToFile(url, key))
            );

            const imagesFileList = createFileList(imageFiles);
            setValue("images", imagesFileList, { shouldValidate: true });

            setImageState((prev) => ({
              ...prev,
              imagesPreview: urlsData,
            }));
          } catch (error) {
            console.error("Error loading images:", error);
            setImageState((prev) => ({
              ...prev,
              imagesPreview: urlsData,
            }));
          }
        }
      } catch (error) {
        console.error("Error loading images from S3:", error);
        toast.error("Failed to load images: " + error.message);
      } finally {
        setImageState((prev) => ({ ...prev, loadingImages: false }));
      }
    },
    [setValue]
  );

  // Reset form and cleanup
  const handleReset = useCallback(() => {
    cleanupImageUrls();

    // Reset to original data
    if (originalDataRef.current && room) {
      setValue("type", room.type);
      setValue("price", room.price);

      const isCustom = roomTypes && !roomTypes.includes(room.type);
      if (isCustom) {
        setValue("type", "new");
        setValue("customType", room.type);
      }

      // Reload original images
      loadImagesFromS3(room.thumbnailKey, room.imageKeys);
    }

    // Reset change tracking
    setHasChanges(false);
    setChangedFields(new Set());
  }, [room, roomTypes, setValue, loadImagesFromS3, cleanupImageUrls]);

  // Form submit - only send changed fields
  const onSubmit = useCallback(
    (data) => {
      if (!hasChanges) {
        toast.info("No changes detected");
        return;
      }

      const payload = {};

      if (isFieldChanged("type")) {
        payload.type = data.type === "new" ? data.customType : data.type;
      }

      if (isFieldChanged("price")) {
        payload.price = data.price;
      }

      if (isFieldChanged("thumbnail")) {
        payload.thumbnail = data.thumbnail?.[0] || null;
      }

      if (isFieldChanged("images")) {
        payload.images = data.images ? Array.from(data.images) : [];
      }

      editRoomMutation({ id, data: payload });
    },
    [hasChanges, isFieldChanged, editRoomMutation, id]
  );

  // Load initial data và set original reference
  useEffect(() => {
    if (room && !getRoomLoading) {
      setValue("type", room.type);
      setValue("price", room.price);

      const isCustom = roomTypes && !roomTypes.includes(room.type);
      setImageState((prev) => ({ ...prev, isCustomType: isCustom }));

      if (isCustom) {
        setValue("type", "new");
        setValue("customType", room.type);
      }

      // Load images
      loadImagesFromS3(room.thumbnailKey, room.imageKeys);

      // Set original data reference sau khi load xong
      setTimeout(() => {
        originalDataRef.current = getCurrentFormData();
      }, 1000); // Delay để đảm bảo images đã load xong
    }
  }, [
    room,
    roomTypes,
    getRoomLoading,
    setValue,
    loadImagesFromS3,
    getCurrentFormData,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupImageUrls();
    };
  }, [cleanupImageUrls]);

  // Show loading while fetching data
  if (getRoomLoading || getRoomTypesLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center h-64">
          <Loading />
          <span className="ml-2">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Room</h2>
          {hasChanges && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded">
                {changedFields.size} field(s) modified
              </span>
            </div>
          )}
        </div>

        {/* Changed fields indicator */}
        {changedFields.size > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            Modified: {Array.from(changedFields).join(", ")}
          </div>
        )}
      </div>

      <div className="space-y-6 p-6">
        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room type <span className="text-red-500">*</span>
          </label>
          <select
            {...register("type")}
            onChange={(e) => {
              const value = e.target.value;
              setImageState((prev) => ({
                ...prev,
                isCustomType: value === "new",
              }));
              register("type").onChange(e);
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.type
                ? "border-red-500"
                : isFieldChanged("type")
                ? "border-orange-300 bg-orange-50"
                : "border-gray-300"
            }`}
          >
            <option value="">-- Choose room type --</option>
            {roomTypes?.map((type) => (
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
        {imageState.isCustomType && (
          <div>
            <input
              type="text"
              {...register("customType", {
                required: "Please enter a new room type",
              })}
              placeholder="Enter new room type"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.customType
                  ? "border-red-500"
                  : isFieldChanged("type")
                  ? "border-orange-300 bg-orange-50"
                  : "border-gray-300"
              }`}
            />
            {errors.customType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customType.message}
              </p>
            )}
          </div>
        )}

        {/* Thumbnail */}
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
              errors.thumbnail
                ? "border-red-500"
                : isFieldChanged("thumbnail")
                ? "border-orange-300 bg-orange-50"
                : "border-gray-300"
            }`}
          />
          {errors.thumbnail && (
            <p className="mt-1 text-sm text-red-600">
              {errors.thumbnail.message}
            </p>
          )}

          {/* Thumbnail Preview */}
          {imageState.thumbnailPreview && (
            <div className="mt-3">
              <div className="relative inline-block group">
                <img
                  src={imageState.thumbnailPreview}
                  alt="Thumbnail preview"
                  className={`w-32 h-32 object-cover rounded-lg border-2 ${
                    isFieldChanged("thumbnail")
                      ? "border-orange-300"
                      : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={removeThumbnailPreview}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Multiple Images */}
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
              errors.images
                ? "border-red-500"
                : isFieldChanged("images")
                ? "border-orange-300 bg-orange-50"
                : "border-gray-300"
            }`}
          />
          {errors.images && (
            <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
          )}

          {/* Images Preview */}
          {imageState.loadingImages && (
            <div className="mt-3 flex items-center text-gray-600">
              <Loading />
              <span className="ml-2">Loading...</span>
            </div>
          )}

          {imageState.imagesPreview.length > 0 && (
            <div className="mt-3 flex items-center gap-3">
              {imageState.imagesPreview.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className={`w-32 h-32 aspect-square object-cover rounded-lg border-2 ${
                      isFieldChanged("images")
                        ? "border-orange-300"
                        : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => removeImagePreview(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
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
                errors.price
                  ? "border-red-500"
                  : isFieldChanged("price")
                  ? "border-orange-300 bg-orange-50"
                  : "border-gray-300"
              }`}
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={editRoomPending || !hasChanges}
            className={`flex-1 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              editRoomPending || !hasChanges
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editRoomPending ? (
              <Loading />
            ) : hasChanges ? (
              "Update Room"
            ) : (
              "No Changes"
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={editRoomPending || !hasChanges}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoomForm;
