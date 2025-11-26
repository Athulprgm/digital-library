import React, { useEffect, useState } from "react";

function ProfileToastNotification({ profile }) {
  const requiredFields = ["fullName", "email", "phone", "gender", "address"];

  // Calculate missing fields and percentage
  const getMissingFields = () => {
    return requiredFields.filter(
      (field) => !profile[field] || profile[field].trim() === ""
    );
  };

  const missing = getMissingFields();
  const completePercent = Math.round(
    ((requiredFields.length - missing.length) / requiredFields.length) * 100
  );

  const [show, setShow] = useState(false);
  const [lastPercent, setLastPercent] = useState(0);

  useEffect(() => {
    // Check if profile completeness changed
    if (completePercent !== lastPercent) {
      setLastPercent(completePercent);

      // Only show if incomplete (not 100%)
      if (completePercent < 100) {
        setShow(true);

        // Auto-hide after 5 seconds
        const timer = setTimeout(() => setShow(false), 5000);
        return () => clearTimeout(timer);
      } else {
        // Hide immediately when 100%
        setShow(false);
      }
    }
  }, [profile.fullName, profile.email, profile.phone, profile.gender, profile.address, completePercent, lastPercent]);

  // Don't render if hidden or complete
  if (!show || completePercent === 100) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-[slideIn_0.3s_ease-out]">
      <div className="bg-white border-l-4 border-red-600 shadow-lg rounded-lg p-4 w-80">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-bold text-black text-lg">
              ⚠️ Profile Incomplete ({completePercent}%)
            </h3>

            <p className="text-gray-700 text-sm mt-1">
              Missing:
              <span className="font-semibold text-red-600">
                {" "}
                {missing.join(", ")}
              </span>
            </p>

            <div className="mt-3 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-2 bg-red-600 rounded-full transition-all duration-500"
                style={{ width: `${completePercent}%` }}
              ></div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setShow(false)}
            className="ml-2 text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileToastNotification;