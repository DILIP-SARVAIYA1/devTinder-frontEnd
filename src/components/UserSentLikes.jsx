import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserSentLikes } from "../appStore/userSentLikeSlice";

const UserSentLikes = () => {
  const dispatch = useDispatch();
  const { likes, pagination, loading, error } = useSelector(
    (state) => state.userSentLikes
  );

  useEffect(() => {
    dispatch(
      fetchUserSentLikes({ page: pagination.page, limit: pagination.limit })
    );
  }, [dispatch, pagination.page, pagination.limit]);

  const handlePageChange = (newPage) => {
    dispatch(fetchUserSentLikes({ page: newPage, limit: pagination.limit }));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Sent Likes</h2>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : likes.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No sent likes available.
        </div>
      ) : (
        <ul className="space-y-4">
          {likes.map((like) => (
            <li
              key={like._id}
              className="flex items-center gap-4 bg-white/10 rounded-xl p-4 shadow"
            >
              <img
                src={like.toUserId.profilePic}
                alt={like.toUserId.firstName}
                className="w-14 h-14 rounded-full object-cover border-2 border-pink-400"
              />
              <div>
                <div className="font-semibold text-lg text-white">
                  {like.toUserId.firstName} {like.toUserId.lastName}
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {like.toUserId.skills?.map((skill, idx) => (
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

export default UserSentLikes;
