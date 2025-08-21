import { Outlet, Link } from "react-router-dom";

import React from "react";

const AppLayout = () => {
  return (
    <div className="flex">
      <div className="sidebar">
        <aside>
          <ul>
            <li>
              <img src="/images/logo.svg" alt="image" />
            </li>
            <li>
              <Link>Dashboard</Link>
            </li>
          </ul>
        </aside>
      </div>
      <Outlet />
    </div>
  );
};

export default AppLayout;
