import AdminSkeleton from "@/components/AdminSkeleton";

const Loading = () => {
  return (
    <div className="container mx-auto p-6 mt-24 mb-16">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 tracking-wide">
        Loading Admin Panel...
      </h1>
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-4 px-6 text-left font-semibold tracking-wider">
                ID
              </th>
              <th className="py-4 px-6 text-left font-semibold tracking-wider">
                Name
              </th>
              <th className="py-4 px-6 text-left font-semibold tracking-wider">
                Email
              </th>
              <th className="py-4 px-6 text-left font-semibold tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {[1, 2, 3, 4, 5].map((n) => (
              <tr key={n}>
                <td colSpan={5}>
                  <AdminSkeleton />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Loading;
