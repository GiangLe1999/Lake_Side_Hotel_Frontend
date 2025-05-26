import React from "react";
import EditRoomForm from "../../components/dashboard-pages/edit-room-page/EditRoomForm";
import { useParams } from "react-router-dom";

const DashboardEditRoomPage = () => {
  let { id } = useParams();
  return <EditRoomForm id={id} />;
};

export default DashboardEditRoomPage;
