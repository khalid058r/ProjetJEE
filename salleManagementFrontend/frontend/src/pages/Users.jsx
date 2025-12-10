import { useEffect, useState } from "react";
import {
  getUsersPage,
  activateUser,
  deactivateUser,
  deleteUser,
} from "../services/userService";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async (page = 0) => {
    try {
      setLoading(true);
      const res = await getUsersPage(page, 10);
      setUsers(res.data.content);
      setPageInfo(res.data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleActivate = async (id) => {
    await activateUser(id);
    loadUsers(pageInfo.number);
  };

  const handleDeactivate = async (id) => {
    await deactivateUser(id);
    loadUsers(pageInfo.number);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await deleteUser(id);
    loadUsers(0);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={() => navigate("/users/new")}
        >
          + Add User
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Username</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Active</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr className="border-t" key={u.id}>
              <td className="p-3">{u.id}</td>
              <td className="p-3">{u.username}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>

              <td className="p-3">
                {u.active ? (
                  <span className="text-green-600 font-semibold">Active</span>
                ) : (
                  <span className="text-red-500 font-semibold">Inactive</span>
                )}
              </td>

              <td className="p-3 flex gap-3">
                <button
                  className="text-blue-600"
                  onClick={() => navigate(`/users/${u.id}`)}
                >
                  Edit
                </button>

                {u.active ? (
                  <button
                    className="text-yellow-600"
                    onClick={() => handleDeactivate(u.id)}
                  >
                    Disable
                  </button>
                ) : (
                  <button
                    className="text-green-600"
                    onClick={() => handleActivate(u.id)}
                  >
                    Activate
                  </button>
                )}

                <button
                  className="text-red-600"
                  onClick={() => handleDelete(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={pageInfo.first}
          onClick={() => loadUsers(pageInfo.number - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <button
          disabled={pageInfo.last}
          onClick={() => loadUsers(pageInfo.number + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
