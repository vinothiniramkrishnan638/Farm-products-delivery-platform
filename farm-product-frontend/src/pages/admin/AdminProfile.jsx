import { useAdminAuth } from "../../context/AdminAuthContext";

const AdminProfile = () => {
  const { admin } = useAdminAuth();

  return (
    <div>
      <p className="text-xl font-extrabold text-gray-800 font-heading mb-5">Profile</p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 max-w-md space-y-3 text-sm">
        <p><span className="text-gray-400">Admin ID:</span> <span className="font-semibold text-gray-800">{admin?.admin_id}</span></p>
        <p><span className="text-gray-400">Full Name:</span> <span className="font-semibold text-gray-800">{admin?.full_name}</span></p>
        <p><span className="text-gray-400">Mobile Number:</span> <span className="font-semibold text-gray-800">{admin?.mobile_number}</span></p>
      </div>
    </div>
  );
};

export default AdminProfile;