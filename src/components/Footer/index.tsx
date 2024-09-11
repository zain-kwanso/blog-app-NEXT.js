import React from "react";

const Footer: React.FC = (): React.JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 text-white py-4 px-4 md:px-8 lg:px-12 sticky bottom-0">
      <div className="max-w-3xl mx-auto flex justify-center items-center">
        <p>&copy; {currentYear} Blog Application. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
