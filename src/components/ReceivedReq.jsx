import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ReceivedReq = () => {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/usersRequest/received?page=${page}&limit=${pagination.limit}`,
        { withCredentials: true }
      );
      setRequests(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(pagination.page);
    // eslint-disable-next-line
  }, [pagination.page]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleReview = async (status, reqId) => {
    setActionLoading(reqId + status);
    try {
      await axios.post(
        `${BASE_URL}/connectionRequests/review/${status}/${reqId}`,
        {},
        { withCredentials: true }
      );
      // Remove the reviewed request from the list
      setRequests((prev) => prev.filter((req) => req._id !== reqId));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (err) {
      alert(
        err.response?.data?.message ||
          `Failed to ${status} this request. Please try again.`
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Received Friend Requests</h2>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No connection requests available.
        </div>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li
              key={req._id}
              className="flex items-center gap-4 bg-white/10 rounded-xl p-4 shadow"
            >
              <img
                src={req.fromUserId.profilePic}
                alt={req.fromUserId.firstName}
                className="w-14 h-14 rounded-full object-cover border-2 border-pink-400"
              />
              <div className="flex-1">
                <div className="font-semibold text-lg text-white">
                  {req.fromUserId.firstName} {req.fromUserId.lastName}
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {req.fromUserId.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-pink-600/20 text-pink-400 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
                  disabled={actionLoading === req._id + "accepted"}
                  onClick={() => handleReview("accepted", req._id)}
                >
                  {actionLoading === req._id + "accepted"
                    ? "Accepting..."
                    : "Accept"}
                </button>
                <button
                  className="px-3 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
                  disabled={actionLoading === req._id + "rejected"}
                  onClick={() => handleReview("rejected", req._id)}
                >
                  {actionLoading === req._id + "rejected"
                    ? "Rejecting..."
                    : "Reject"}
                </button>
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

export default ReceivedReq;
