import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, LogOut, MapPin } from "lucide-react";

function Profile() {
  const [playlist, setPlaylist] = useState([]);
  const [location, setLocation] = useState("Fetching location...");
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email") || "dhirajksahu01@gmail.com";
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaylist();
    fetchLocation();
  }, []);

  // Fetch playlist
  const fetchPlaylist = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get_playlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaylist(response.data.playlist);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  };

  // Fetch user location
  const fetchLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const { address } = response.data;
            setLocation(`${address.city || address.town || address.village}, ${address.country}`);
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocation("Location not found");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation("Location access denied");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  };
  

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="w-full min-h-screen bg-black text-white p-4 flex flex-col">
      {/* Back Button */}
      <Link to="/" className="flex items-center mb-4 cursor-pointer">
        <ArrowLeft size={24} className="mr-2" />
        <span>Back to Emofy</span>
      </Link>

      {/* Profile Info + Logout */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-4 rounded-lg bg-pink-300 text-white">
        <div className="flex flex-col items-start">
          <div className="flex items-center">
            <User size={40} className="mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold">{email}</h2>
          </div>
          <div className="flex items-center mt-2">
            <MapPin size={20} className="mr-2" />
            <span className="text-sm">{location}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-600 px-3 py-2 rounded-md text-white mt-3 sm:mt-0"
        >
          <LogOut size={20} className="mr-2" />
          Logout
        </button>
      </div>

      {/* Playlist Section */}
      <h1 className="text-2xl font-bold mb-4 text-left">Your Playlist</h1>
      <div className="flex-1 overflow-y-auto max-h-[60vh]">
        {playlist.length === 0 ? (
          <p className="text-gray-400 text-center">Your playlist is empty.</p>
        ) : (
          <ul>
            {playlist.map((song, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-700 px-2"
              >
                <span className="truncate">{song}</span>
                <button
                  className="bg-red-600 px-3 py-1 rounded-md text-sm sm:text-base"
                  onClick={() => removeFromPlaylist(song)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;
