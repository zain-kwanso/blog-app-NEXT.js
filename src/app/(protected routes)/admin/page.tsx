import { getCurrentUser } from "@/app/actions/auth";
import { fetchUsersAction } from "@/app/actions/users";
import DeleteButton from "@/components/DeleteButton";
import { UserType } from "../../../../@types/user";

export default async function AdminPanel() {
  const result = await fetchUsersAction();
  const admin = await getCurrentUser();

  if (result.error) {
    return (
      <div className="container mx-auto p-6 mt-24 mb-16">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 tracking-wide">
          Admin Panel - User Data
        </h1>
        <div className="text-center text-red-500 py-4">{result.error}</div>
      </div>
    );
  }

  const users: Partial<UserType[]> = result.data;

  return (
    <div className="container mx-auto p-6 mt-24 mb-16">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 tracking-wide">
        Admin Panel - User Data
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
            {users.map((user) => (
              <tr
                key={user?.id}
                className="border-b hover:bg-gray-100 transition duration-150 ease-in-out"
              >
                <td className="py-4 px-6">{user?.id}</td>
                <td className="py-4 px-6">{user?.name}</td>
                <td className="py-4 px-6">{user?.email}</td>
                {!(admin?.id === user?.id) && (
                  <td className="py-4 px-6">
                    <DeleteButton userId={user?.id!} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const revalidate = 10;
