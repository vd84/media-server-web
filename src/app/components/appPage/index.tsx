import React from "react";

const AppPage = ({
  children,
  title,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-10">{title}</h1>
      {children}
    </div>
  );
};

export default AppPage;
