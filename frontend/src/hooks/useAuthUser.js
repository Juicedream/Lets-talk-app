import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  // using tanstack query and axios
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // run it once
  });

  return {
    isLoading: authUser.isLoading,
    authUser: authUser.data?.user,
  };
};
export default useAuthUser;
