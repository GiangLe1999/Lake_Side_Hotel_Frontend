import { useAuth } from "./useAuth";
import { useMutation } from "@tanstack/react-query";
import { userLogout } from "../service/auth-service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { mutate: logoutMutation, isPending: logoutPending } = useMutation({
    mutationFn: userLogout,
    onSuccess: (res) => {
      if (res?.status === 200) {
        logout();
        navigate("/");
      } else {
        toast.error("Logout failed");
      }
    },
    onError: (error) => {
      toast.error("Logout failed: " + error.message);
    },
  });

  return { logoutMutation, logoutPending };
};

export default useLogout;
