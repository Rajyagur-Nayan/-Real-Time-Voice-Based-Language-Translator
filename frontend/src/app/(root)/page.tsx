import React from "react";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";

const page = () => {
  return (
    <div>
      <Home />
      <Toaster />
    </div>
  );
};

export default page;
