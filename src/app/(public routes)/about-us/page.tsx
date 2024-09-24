import React from "react";

const AboutUsPage: React.FC = (): React.JSX.Element => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Company Introduction */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Welcome to Kwanso, where we strive to deliver the best services and
          products to our customers. With a commitment to innovation and
          quality, our team works tirelessly to bring your ideas to life.
        </p>
      </section>

      {/* Mission and Vision */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to empower our clients by providing exceptional
              solutions tailored to their needs. We believe in delivering
              results that exceed expectations and help our clients achieve
              their goals.
            </p>
          </div>

          {/* Vision */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our vision is to be a leader in our industry, recognized for our
              commitment to excellence and innovation. We aim to create a
              sustainable future by embracing change and continuously improving
              our services.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="text-center">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member 1"
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">John Doe</h3>
            <p className="text-gray-600">CEO & Founder</p>
          </div>

          {/* Team Member 2 */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member 2"
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Jane Smith</h3>
            <p className="text-gray-600">Chief Operating Officer</p>
          </div>

          {/* Team Member 3 */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member 3"
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">
              David Johnson
            </h3>
            <p className="text-gray-600">Head of Development</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(AboutUsPage);
