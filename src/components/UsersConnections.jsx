import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const UsersConnections = () => {
  const [connections, setConnections] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchConnections = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/usersConnections?page=${page}&limit=${pagination.limit}`,
        { withCredentials: true }
      );
      setConnections(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections(pagination.page);
    // eslint-disable-next-line
  }, [pagination.page]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Connections</h2>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : connections.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No connections available.
        </div>
      ) : (
        <ul className="space-y-4">
          {connections.map((conn) => (
            <li
              key={conn._id}
              className="flex items-center gap-4 bg-white/10 rounded-xl p-4 shadow"
            >
              <img
                src={conn.connectionUser.profilePic}
                alt={conn.connectionUser.firstName}
                className="w-14 h-14 rounded-full object-cover border-2 border-pink-400"
              />
              <div>
                <div className="font-semibold text-lg text-white">
                  {conn.connectionUser.firstName} {conn.connectionUser.lastName}
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {conn.connectionUser.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-pink-600/20 text-pink-400 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            className="px-3 py-1 rounded bg-gray-800 text-white disabled:opacity-50"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1 || loading}
          >
            Prev
          </button>
          <span className="text-white">
            Page {pagination.page} of{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-800 text-white disabled:opacity-50"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={
              pagination.page >=
                Math.ceil(pagination.total / pagination.limit) || loading
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersConnections;
