import React from "react";

const PageContainer = ({ children, className = "" }) => {
  return <div className={`mx-auto w-full max-w-[1200px] ${className}`.trim()}>{children}</div>;
};

export default PageContainer;
