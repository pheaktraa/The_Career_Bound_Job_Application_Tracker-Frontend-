import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState(user);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get(`/user`);

        // It should be response.data.data (the user object)
        const data = response.data.data || response.data;
        setProfileData(data);

        // Initialize form data with fetched data
        setFormData({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateAvatar = async () => {
    const newUrl = prompt("Paste the image URL here:");
    if (!newUrl) return;

    try {
      const response = await api.put(`/updateusers?id=${user.user_id}`, {
        profile_image: newUrl
      });

      const updatedUser = response.data.data;

      setProfileData(updatedUser);
      setUser(updatedUser); // ✅ THIS updates Navbar instantly

      alert("Avatar updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update: Make sure it's a valid URL");
    }
  };

  const handleEditProfile = async () => {
    try {
      const response = await api.put(`/updateusers?id=${user.user_id}`, formData);

      const updatedUser = response.data.data;

      setProfileData(updatedUser);
      setUser(updatedUser); // ✅ IMPORTANT FIX

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-lg text-gray-600">Manage your profile information and preferences.</p>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile Picture */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
          <div className="relative group">
            <img
              src={profileData?.profile_image || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'}
              alt="Avatar"
              className="w-60 h-60 rounded-full object-cover border-4 border-blue-50"
            />
          </div>

          <button
            onClick={handleUpdateAvatar}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 duration-300 cursor-pointer scale-100 hover:scale-105 transition-all"
          >
            Change Avatar URL
          </button>
        </div>

        {/* Right Column: Personal Info */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Personal Information</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ) : (
                <p className="text-lg font-medium text-gray-900 bg-gray-50 p-2 rounded-lg">{profileData?.first_name}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ) : (
                <p className="text-lg font-medium text-gray-900 bg-gray-50 p-2 rounded-lg">{profileData?.last_name}</p>
              )}
            </div>

            {/* Email */}
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ) : (
                <p className="text-lg font-medium text-gray-900 bg-gray-50 p-2 rounded-lg">{profileData?.email}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Role</label>
              <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full uppercase">
                {profileData?.role}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditProfile}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition-all"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-all cursor-pointer"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;