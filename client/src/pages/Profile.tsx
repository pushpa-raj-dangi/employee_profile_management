import { useQuery } from "@apollo/client";
import EmployeeProfileForm from "../components/ProfileForm";
import { GET_PROFILE_QUERY } from "../graphql/queries/employeeQueries";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { loading, error, data } = useQuery(GET_PROFILE_QUERY, {
    variables: { userId: id || user?.id },
  });

  useEffect(() => {
    if (data) {
      console.log("Profile data:", data.getProfile);
    }
  }, [data, id, user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <EmployeeProfileForm initialData={data.getProfile} />
    </div>
  );
};

export default Profile;
