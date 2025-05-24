import React, { useState } from "react";
import formatPriceUSD from "../../../utils/format-price";
import formatDate from "../../../utils/format-date";
import CommonModal from "../../common/CommonModal";
import { deleteRoom } from "../../../service/room-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Loading } from "../../common/Loading";

const RoomsTableRow = ({ room, filteredRoomType, pageNo }) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutate: deleteRoomMutation, isPending: deleteRoomPending } =
    useMutation({
      mutationFn: deleteRoom,
      onSuccess: ({ data }) => {
        if (data.status === 200) {
          toast.success("Delete room successfully No. " + data.data);

          // Invalidate queries liên quan
          queryClient.invalidateQueries({
            queryKey: ["roomsByType", filteredRoomType, pageNo],
          });

          queryClient.invalidateQueries({
            queryKey: ["roomTypes"],
          });

          setOpen(false);
        } else {
          toast.error("Failed to delete room", data.message);
        }
      },
      onError: (err) => {
        toast.error("Failed to add room," + err.message);
      },
    });

  return (
    <>
      <tr key={room?.id} className="border-t border-gray-100">
        <td className="py-3 text-sm text-gray-900">#00{room?.id}</td>
        <td className="py-3 text-sm text-gray-900">{room?.type}</td>
        <td className="py-3 text-sm text-gray-600">
          {formatPriceUSD(room?.price || null)}
        </td>
        <td className="py-3 text-sm text-gray-600">
          {formatDate(room?.createdAt || "", "dd/MM/yyyy")}
        </td>
        <td className="py-3 flex gap-2 justify-center text-xs font-semibold">
          <button
            // onClick={() => handleEdit(room.id)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => setOpen(true)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </td>
      </tr>

      <CommonModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete Room"
      >
        <p>
          Are you sure you want to delete this room? This action cannot be
          undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => deleteRoomMutation(room?.id || "")}
            disabled={deleteRoomPending}
            className={`px-4 py-2 rounded-md text-white ${
              deleteRoomPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {deleteRoomPending ? <Loading /> : "Confirm"}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </CommonModal>
    </>
  );
};

export default RoomsTableRow;
