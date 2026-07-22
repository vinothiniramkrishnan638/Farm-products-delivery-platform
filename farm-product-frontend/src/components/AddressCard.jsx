const AddressCard = ({ address, selected, onSelect, onDeselect, onEdit, onDelete, onSetDefault }) => {
  return (
    <div
      onClick={() => onSelect(address.id)}
      className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
        selected ? "border-green-600 bg-green-50" : "border-gray-100 bg-white hover:border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-gray-800">{address.full_name}</p>
            {address.is_default && (
              <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                DEFAULT
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{address.mobile_number}</p>
          <p className="text-sm text-gray-600 mt-1">
            {address.address}, {address.village}
          </p>
          <p className="text-sm text-gray-600">
            {address.district}, {address.state} - {address.pincode}
          </p>
          {address.landmark && (
            <p className="text-xs text-gray-400 mt-1">Landmark: {address.landmark}</p>
          )}
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            selected ? "border-green-600" : "border-gray-300"
          }`}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(address);
          }}
          title="Edit Address"
          className="w-8 h-8 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 flex items-center justify-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(address.id);
          }}
          title="Delete Address"
          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
        {selected && onDeselect ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeselect();
            }}
            className="text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-2.5 py-1.5 rounded-lg transition-colors ml-auto"
          >
            Deselect
          </button>
        ) : (
          !address.is_default && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetDefault(address);
              }}
              className="text-xs font-bold text-gray-500 hover:text-green-700 bg-gray-100 hover:bg-green-50 px-2.5 py-1.5 rounded-lg transition-colors ml-auto"
            >
              Default
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default AddressCard;