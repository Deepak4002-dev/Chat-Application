import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(user?.profilePic?.secureUrl || "");
  const [loading, setLoading] = useState(false);

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (bio.length < 100) {
      return toast.error("Bio must be at least 100 characters");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("bio", bio);
      if (profilePic) formData.append("profilePic", profilePic);

      await axios.put("/api/users/profile", formData);

      toast.success("Profile updated");
      setEditing(false);
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow p-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 shadow">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-3xl font-bold text-gray-400">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {user?.username}
          </h2>

          <p className="text-sm text-gray-400">{user?.email}</p>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="mt-4 px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Bio Section */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Bio</h3>

          {!editing ? (
            <p className="text-gray-600 whitespace-pre-line">
              {user?.bio || "No bio added yet."}
            </p>
          ) : (
            <>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Write at least 100 characters..."
              />
              <p className="text-xs text-gray-400 mt-1">
                {bio.length}/100 minimum characters
              </p>
            </>
          )}
        </div>

        {/* Photo Change (only in edit mode) */}
        {editing && (
          <div className="mt-6">
            <label className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
              Change Profile Photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePicChange}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Save / Cancel */}
        {editing && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => setEditing(false)}
              className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
