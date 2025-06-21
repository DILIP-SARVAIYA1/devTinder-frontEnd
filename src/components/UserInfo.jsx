import React from "react";

const UserInfo = () => {
  return (
    <div className="flex-1/4">
      <div>
        <div className="navbar shadow-sm py-5 bg-gradient-to-tr from-pink-600  to-yellow-700">
          <div className="flex gap-2">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <a className="btn btn-ghost text-xl text-white drop-shadow">
              DILIP
            </a>
          </div>
        </div>
        massage
      </div>
    </div>
  );
};

export default UserInfo;
