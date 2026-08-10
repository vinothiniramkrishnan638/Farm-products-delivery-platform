import { useDeliveryAuth } from "../../context/DeliveryAuthContext";

const DeliveryProfile = () => {
  const { partner } = useDeliveryAuth();

  return (
    <div className="page-fade-in">
      <p className="text-xl font-extrabold text-gray-800 font-heading mb-5">Profile</p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-md space-y-4 text-sm premium-card animate-fade-up">
        <p><span className="text-gray-400">Partner ID:</span> <span className="font-semibold text-gray-800">{partner?.partner_id}</span></p>
        <p><span className="text-gray-400">Name:</span> <span className="font-semibold text-gray-800">{partner?.name}</span></p>
        <p><span className="text-gray-400">Mobile Number:</span> <span className="font-semibold text-gray-800">{partner?.mobile_number}</span></p>
        <p><span className="text-gray-400">Email:</span> <span className="font-semibold text-gray-800">{partner?.email}</span></p>
      </div>
    </div>
  );
};

export default DeliveryProfile;