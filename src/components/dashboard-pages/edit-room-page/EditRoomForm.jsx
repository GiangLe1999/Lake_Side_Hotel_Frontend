import { useCallback, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  editRoom,
  getRoomForAdmin,
  getRoomTypes,
} from "../../../service/room-service";
import { Loading } from "../../common/Loading";
import { roomSchema } from "../../../utils/room-form-schema";
import {
  getMultiplePublicS3Urls,
  getPublicS3Url,
} from "../../../utils/get-s3-url";
import { urlToFile } from "../../../utils/url-to-file";
import { createFileList } from "../../../utils/create-file-list";
import {
  compareFilesVsFiles,
  compareFileVsFile,
  compareSimpleArrays,
} from "../../../utils/compare";

const EditRoomForm = ({ id }) => {
  const { data: roomTypes, isLoading: getRoomTypesLoading } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: getRoomTypes,
    select: (res) => res.data.data,
  });

  const { data: room, isLoading: getRoomLoading } = useQuery({
    queryKey: ["room-for-admin", id],
    queryFn: () => getRoomForAdmin(id),
    select: (res) => res.data.data,
  });

  // Original data reference để so sánh
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

  const [amenities, setAmenities] = useState([""]);
  const [features, setFeatures] = useState([""]);

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
      name: "",
      type: "",
      customType: "",
      summary: "",
      description: "",
      area: "",
      beds: "",
      occupancy: "",
      amenities: [""],
      features: [""],
      totalRooms: "",
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
      name: values.name,
      type: values.type === "new" ? values.customType : values.type,
      summary: values.summary,
      description: values.description,
      area: values.area,
      beds: values.beds,
      occupancy: values.occupancy,
      amenities: values.amenities,
      features: values.features,
      price: values.price,
      totalRooms: values.totalRooms,
      thumbnail: values.thumbnail,
      images: values.images,
    };
  }, [getValues]);

  // Detect changes in form data
  const detectChanges = useCallback(() => {
    if (!originalDataRef.current) return;

    const currentData = getCurrentFormData();
    const originalData = originalDataRef.current;
    const newChangedFields = new Set();

    // Compare basic fields
    if (currentData.name !== originalData.name) {
      newChangedFields.add("name");
    }

    if (currentData.type !== originalData.type) {
      newChangedFields.add("type");
    }

    if (currentData.summary !== originalData.summary) {
      newChangedFields.add("summary");
    }

    if (currentData.description !== originalData.description) {
      newChangedFields.add("description");
    }

    if (currentData.area !== originalData.area) {
      newChangedFields.add("area");
    }

    if (currentData.beds !== originalData.beds) {
      newChangedFields.add("beds");
    }

    if (currentData.occupancy !== originalData.occupancy) {
      newChangedFields.add("occupancy");
    }

    if (currentData.totalRooms !== originalData.totalRooms) {
      newChangedFields.add("totalRooms");
    }

    if (!compareSimpleArrays(currentData.amenities, originalData.amenities)) {
      newChangedFields.add("amenities");
    }

    if (!compareSimpleArrays(currentData.features, originalData.features)) {
      newChangedFields.add("features");
    }

    if (currentData.price !== originalData.price) {
      newChangedFields.add("price");
    }

    // Compare thumbnail
    if (!compareFileVsFile(currentData.thumbnail, originalData.thumbnail)) {
      newChangedFields.add("thumbnail");
    }

    // Compare images
    if (!compareFilesVsFiles(currentData.images, originalData.images)) {
      newChangedFields.add("images");
    }

    setChangedFields(newChangedFields);
    setHasChanges(newChangedFields.size > 0);
  }, [getCurrentFormData]);

  // Effect to detect changes when form values change
  useEffect(() => {
    detectChanges();
  }, [
    watchedValues.name,
    watchedValues.type,
    watchedValues.customType,
    watchedValues.summary,
    watchedValues.description,
    watchedValues.area,
    watchedValues.beds,
    watchedValues.occupancy,
    watchedValues.amenities,
    watchedValues.features,
    watchedValues.totalRooms,
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

  const handleAddAmenity = useCallback(() => {
    const newAmenities = [...amenities, ""];
    setAmenities(newAmenities);
    setValue("amenities", newAmenities);
  }, [amenities, setValue]);

  const handleAddFeature = useCallback(() => {
    const newFeatures = [...features, ""];
    setFeatures(newFeatures);
    setValue("features", newFeatures);
  }, [features, setValue]);

  const handleRemoveAmenity = useCallback(
    (index) => {
      const newAmenities = amenities.filter((_, i) => i !== index);
      setAmenities(newAmenities);
      setValue("amenities", newAmenities);
    },
    [amenities, setValue]
  );

  const handleRemoveFeature = useCallback(
    (index) => {
      const newFeatures = features.filter((_, i) => i !== index);
      setFeatures(newFeatures);
      setValue("features", newFeatures);
    },
    [features, setValue]
  );

  const handleAmenityChange = useCallback(
    (index, value) => {
      const newAmenities = [...amenities];
      newAmenities[index] = value;
      setAmenities(newAmenities);
      setValue("amenities", newAmenities);
    },
    [amenities, setValue]
  );

  const handleFeatureChange = useCallback(
    (index, value) => {
      const newFeatures = [...features];
      newFeatures[index] = value;
      setFeatures(newFeatures);
      setValue("features", newFeatures);
    },
    [features, setValue]
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
        detectChanges();

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

      // Cập nhật form images
      const currentFiles = getValues("images");
      if (currentFiles && currentFiles.length > 0) {
        // Tạo array mới từ FileList hiện tại, loại bỏ file tại index
        const filesArray = Array.from(currentFiles);
        const newFilesArray = filesArray.filter((_, i) => i !== index);

        if (newFilesArray.length === 0) {
          // Nếu không còn file nào, set về null
          setValue("images", null);
        } else {
          // Tạo FileList mới từ array
          // Tại sao không set luôn setValue("images", newFilesArray) mà phải dùng DataTransfer để tạo FileList mới?
          // Vì FileList là một đối tượng readonly, không thể gán trực tiếp bằng Array<File>,
          // và các input HTML dạng <input type="file"> chỉ nhận FileList, không nhận Array<File>.
          const dataTransfer = new DataTransfer();
          newFilesArray.forEach((file) => {
            dataTransfer.items.add(file);
          });
          setValue("images", dataTransfer.files);
        }
      }
    },
    [setValue, getValues, detectChanges]
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
              urlsData.map((url, index) => urlToFile(url, imageKeys[index]))
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
      setValue("name", room.name);
      setValue("type", room.type);
      setValue("summary", room.summary || "");
      setValue("description", room.description || "");
      setValue("area", room.area || "");
      setValue("beds", room.beds || "");
      setValue("occupancy", room.occupancy || "");
      setValue("totalRooms", room.totalRooms || "");
      setValue("price", room.price);

      // Reset amenities
      const roomAmenities = room.amenities || [""];
      setAmenities(roomAmenities);
      setValue("amenities", roomAmenities);

      // Reset features
      const roomFeatures = room.features || [""];
      setFeatures(roomFeatures);
      setValue("features", roomFeatures);

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

      if (isFieldChanged("name")) {
        payload.name = data.name;
      }

      if (isFieldChanged("type")) {
        payload.type = data.type === "new" ? data.customType : data.type;
      }

      if (isFieldChanged("summary")) {
        payload.summary = data.summary;
      }

      if (isFieldChanged("description")) {
        payload.description = data.description;
      }

      if (isFieldChanged("area")) {
        payload.area = parseFloat(data.area);
      }

      if (isFieldChanged("beds")) {
        payload.beds = data.beds;
      }

      if (isFieldChanged("occupancy")) {
        payload.occupancy = data.occupancy;
      }

      if (isFieldChanged("totalRooms")) {
        payload.totalRooms = parseInt(data.totalRooms);
      }

      if (isFieldChanged("amenities")) {
        payload.amenities = data.amenities.filter(
          (amenity) => amenity.trim() !== ""
        );
      }

      if (isFieldChanged("features")) {
        payload.features = data.features.filter(
          (feature) => feature.trim() !== ""
        );
      }

      if (isFieldChanged("price")) {
        payload.price = parseFloat(data.price);
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
      setValue("name", room.name);
      setValue("type", room.type);
      setValue("summary", room.summary || "");
      setValue("description", room.description || "");
      setValue("area", room.area || "");
      setValue("beds", room.beds || "");
      setValue("occupancy", room.occupancy || "");
      setValue("totalRooms", room.totalRooms || "");
      setValue("price", room.price);

      const roomAmenities = room.amenities || [""];
      setAmenities(roomAmenities);
      setValue("amenities", roomAmenities);

      const roomFeatures = room.features || [""];
      setFeatures(roomFeatures);
      setValue("features", roomFeatures);

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="Brief name of the room"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name
                ? "border-red-500"
                : isFieldChanged("name")
                ? "border-orange-300 bg-orange-50"
                : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Maximum 255 characters</p>
        </div>

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
          <p className="mt-1 text-xs text-gray-500">
            Maximum 255 characters - Choose or create a new one
          </p>
        </div>

        {/* Custom Type Input */}
        {imageState.isCustomType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New room type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("customType")}
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

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Summary <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("summary")}
            placeholder="Brief summary of the room"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.summary
                ? "border-red-500"
                : isFieldChanged("summary")
                ? "border-orange-300 bg-orange-50"
                : "border-gray-300"
            }`}
          />
          {errors.summary && (
            <p className="mt-1 text-sm text-red-600">
              {errors.summary.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">Maximum 255 characters</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("description")}
            placeholder="Detailed description of the room"
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description
                ? "border-red-500"
                : isFieldChanged("description")
                ? "border-orange-300 bg-orange-50"
                : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">Maximum 2500 characters</p>
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area (m²) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("area")}
            placeholder="e.g., 25 or 25.5"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.area
                ? "border-red-500"
                : isFieldChanged("area")
                ? "border-orange-300 bg-orange-50"
                : "border-gray-300"
            }`}
          />
          {errors.area && (
            <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
          )}
        </div>

        {/* Beds */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bed Information <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("beds")}
            placeholder="e.g., 1 King bed, 2 Single beds"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.beds
                ? "border-red-500"
                : isFieldChanged("beds")
                ? "border-orange-300 bg-orange-50"
                : "border-gray-300"
            }`}
          />
          {errors.beds && (
            <p className="mt-1 text-sm text-red-600">{errors.beds.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Maximum 100 characters</p>
        </div>

        {/* Occupancy */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Occupancy <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("occupancy")}
            placeholder="e.g., 1 or 10"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.occupancy
                ? "border-red-500"
                : isFieldChanged("occupancy")
                ? "border-orange-300 bg-orange-50"
                : "border-gray-300"
            }`}
          />
          {errors.occupancy && (
            <p className="mt-1 text-sm text-red-600">
              {errors.occupancy.message}
            </p>
          )}
        </div>

        {/* Total Rooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Rooms <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("totalRooms")}
            placeholder="e.g., 1 or 10"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.totalRooms
                ? "border-red-500"
                : isFieldChanged("totalRooms")
                ? "border-orange-300 bg-orange-50"
                : "border-gray-300"
            }`}
          />
          {errors.totalRooms && (
            <p className="mt-1 text-sm text-red-600">
              {errors.totalRooms.message}
            </p>
          )}
        </div>

        {/* Amenities */}
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
                      : isFieldChanged("amenities")
                      ? "border-orange-300 bg-orange-50"
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
            Maximum 50 characters per amenity
          </p>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Features <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.features && errors.features[index]
                      ? "border-red-500"
                      : isFieldChanged("features")
                      ? "border-orange-300 bg-orange-50"
                      : "border-gray-300"
                  }`}
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-xs"
            >
              Add Feature
            </button>
          </div>
          {errors.features && (
            <p className="mt-1 text-sm text-red-600">
              {errors.features.message ||
                (errors.features[0] && errors.features[0].message)}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Maximum 50 characters per feature
          </p>
        </div>

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
      </form>
    </div>
  );
};

export default EditRoomForm;
