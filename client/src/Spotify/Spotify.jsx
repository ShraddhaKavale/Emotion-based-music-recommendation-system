import React, { useState, useRef, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Webcam from "react-webcam";
import axios from "axios";
import camera from "../assets/photos/camera.png";
import arrow from "../assets/photos/arrow (1).png";
import spotify from "../assets/photos/spotify-logo-png-7078.png";
import { Camera, User } from "lucide-react";
import { RiNeteaseCloudMusicFill } from "react-icons/ri";
import { Link } from "react-router-dom";

// Emotion-based song collections
const EMOTION_SONGS = {
  Happy: ["Jane kyu.mp3", "Raatke dhai baje.mp3", "Dil dhadakne do.mp3", "Akhiyaan Gulaab.mp3", "Tauba Tauba.mp3", "Teri Baaton Mein.mp3"],
  Sad: ["Tum Itna Jo Muskura Rahe Ho.mp3", 
        "Din Dhal Jaye Haye.mp3", 
        "Kya Se Kya Ho Gaya Bewafa.mp3", 
        "Abhi Na Jao Chhod Kar.mp3",
        "Ehsan Tera Hoga Mujh Par.mp3", 
        "Chithi Na Koi Sandesh.mp3"
      ],
  Neutral: [
    "Achha lagta hai.mp3",
    "Masakali.mp3",
    "Aafreen Aafreen.mp3",
    "Bulleya.mp3",
    "Ok Jaanu Title Track.mp3"
  ],
  Disgusted: ["Disgusted.mp3", "Pachtaoge.mp3", "Khalibali.mp3"],
  Angry: ["Aarambh.mp3", "Hai Katha Sangram Ki.mp3", "Challa Uri.mp3", "Jigra Uri.mp3", "Jee Karda.mp3"],
  Surprised: ["Senorita.mp3", "The Humma Song.mp3", "i like me better.mp3", "Tik Tik Vajate Dokyaat.mp3", "Darling.mp3"],
  Fear: ["Maurya Re.mp3", "Mahabali Maharudra Hanuman.mp3", "Aasman Ko Chukar.mp3", "Bajrang Baan.mp3", "Akdam Bakdam Hanuman.mp3"],
  Travel: ["Ilahi.mp3", "Kashmir tu mai Kanyakumari.mp3", "Suraj Dooba hai.mp3", "Choomantar.mp3", "Ullu Ka Pattha.mp3" ],
};

const searchSongs = [
  // happy playlist
  { "Jane kyu": "Jane kyu.mp3" },
  { "Raatke dhai baje": "Raatke dhai baje.mp3" },
  { "Dil dhadakne do": "Dil dhadakne do.mp3" },
  {"Akhiyaan Gulaab": "Akhiyaan Gulaab.mp3"},
  {"Tauba Tauba": "Tauba Tauba.mp3"},
  {"Teri Baaton Mein": "Teri Baaton Mein.mp3"},
  // sad playlist
  { "Tum Itna Jo Muskura Rahe Ho": "Tum Itna Jo Muskura Rahe Ho.mp3" },
  { "Din Dhal Jaye Haye": "Din Dhal Jaye Haye.mp3" },
  { "Kya Se Kya Ho Gaya Bewafa": "Kya Se Kya Ho Gaya Bewafa.mp3" },
  {"Abhi Na Jao Chhod Kar": "Abhi Na Jao Chhod Kar.mp3"},
  {"Ehsan Tera Hoga Mujh Par": "Ehsan Tera Hoga Mujh Par.mp3"},
  {"Chithi Na Koi Sandesh": "Chithi Na Koi Sandesh.mp3"},
  // neutral playlist
  { "Achha lagta hai": "Achha lagta hai.mp3" },
  { "Masakali": "Masakali.mp3" },
  { "Aafreen Aafreen": "Aafreen Aafreen.mp3" },
  { "Bulleya": "Bulleya.mp3" },
  {"Ok Jaanu Title Track": "Ok Jaanu Title Track.mp3"},
  // disgusted playlist
  { Disgusted: "Disgusted.mp3" },
  { "Pachtaoge": "Pachtaoge.mp3" },
  {"Khalibali": "Khalibali.mp3" },
  // angry playlist
  { "Aarambh": "Aarambh.mp3" },
  { "Hai Katha Sangram Ki": "Hai Katha Sangram Ki.mp3" },
  { "Challa Uri ": "Challa Uri .mp3" },
  { "Jigra Uri": "Jigra Uri.mp3" },
  { "Jee Karda": "Jee Karda.mp3" },
  // surprised playlist
  { "Senorita": "Senorita.mp3" },
  { "The Humma Song": "The Humma Song.mp3" },
  { "i like me better": "i like me better.mp3" },
  { "Tik Tik Vajate Dokyaat": "Tik Tik Vajate Dokyaat.mp3" },
  { "Darling": "Darling.mp3" },
  // fear playlist 
  {"Maurya Re": "Maurya Re.mp3"},
  { "Mahabali Maharudra Hanuman": "Mahabali Maharudra Hanuman.mp3" },
  { "Aasman Ko Chukar": "Aasman Ko Chukar.mp3" },
  { "Bajrang Baan": "Bajrang Baan.mp3" },
  { "Akdam Bakdam Hanuman": "Akdam Bakdam Hanuman.mp3" },
  // travel playlist
  { "Ilahi": "Ilahi.mp3" },
  { "Kashmir tu mai Kanyakumari": "Kashmir tu mai Kanyakumari.mp3" },
  { "Suraj Dooba hai": "Suraj Dooba hai.mp3" },
  { "Choomantar": "Choomantar.mp3" },
  { "Ullu Ka Pattha": "Ullu Ka Pattha.mp3" },
];

function Spotify() {
  const [song, setSong] = useState("");
  const [currentEmotion, setCurrentEmotion] = useState("");
  const [songIndex, setSongIndex] = useState(0);
  const [cam, setCam] = useState(true);
  const [location, setLocation] = useState(null);
  const [prevLocation, setPrevLocation] = useState(null);
  const [speed, setSpeed] = useState(0);

  const [capturing, setCapturing] = useState(false);
  const webcamRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const [currentFace, setCurrentFace] = useState("");
  const [search, setSearch] = useState("");

  const startCapture = () => {
    setCapturing(true);
    captureIntervalRef.current = setInterval(captureImage, 1000);
  };

  const token = localStorage.getItem("token");
  const [userPlaylist, setUserPlaylist] = useState([]);


  const getLocationAndSpeed = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const timestamp = position.timestamp;
  
          const newLocation = { latitude, longitude, timestamp };
  
          if (prevLocation) {
            const distance = haversineDistance(prevLocation, newLocation);
            const timeElapsed = (timestamp - prevLocation.timestamp) / 1000; // in seconds
            const newSpeed = timeElapsed > 0 ? distance / timeElapsed : 0;
  
            setSpeed(newSpeed);
          }
  
          setPrevLocation(newLocation);
          setLocation(newLocation);
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }
  };
  
  
  const haversineDistance = (coord1, coord2) => {
    const R = 6371e3; // Earth's radius in meters
    const toRad = (deg) => (deg * Math.PI) / 180;
  
    const lat1 = toRad(coord1.latitude);
    const lat2 = toRad(coord2.latitude);
    const deltaLat = toRad(coord2.latitude - coord1.latitude);
    const deltaLon = toRad(coord2.longitude - coord1.longitude);
  
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Distance in meters
  };
  
  
  useEffect(() => {
    const interval = setInterval(getLocationAndSpeed, 2000); // Check every 5 seconds
  
    return () => clearInterval(interval);
  }, [prevLocation]);
  
  useEffect(() => {
    if (speed > 0.1) { // Speed threshold: 0.1 m/s (~36 m/h)
      console.log("User is traveling! Playing travel songs...");
      const travelSongs = EMOTION_SONGS["Travel"];
      const randomIndex = Math.floor(Math.random() * travelSongs.length);
      setCurrentEmotion("Travel");
      setSongIndex(randomIndex);
      setSong(travelSongs[randomIndex]);
    }
  }, [speed]);
  
  useEffect(() => {
    fetchPlaylist();
  }, []);

  const fetchPlaylist = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get_playlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserPlaylist(response.data.playlist);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  };

  const handlePlaylistToggle = async (songName) => {
    const isSongInPlaylist = userPlaylist.includes(songName);

    try {
      if (isSongInPlaylist) {
        await axios.post(
          "http://localhost:5000/remove_from_playlist",
          { song_name: songName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Song removed from playlist!");
      } else {
        await axios.post(
          "http://localhost:5000/add_playlist",
          { song_name: songName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Song added to playlist!");
      }
      fetchPlaylist(); // Refresh the playlist after adding/removing
    } catch (error) {
      console.error("Error toggling playlist:", error);
      alert("Failed to update playlist.");
    }
  };

  const stopCapture = () => {
    setCapturing(false);
    clearInterval(captureIntervalRef.current);
  };

  const captureImage = () => {
    const video = webcamRef.current.video;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(sendImageToBackend, "image/jpeg");
  };

  const sendImageToBackend = async (blob) => {
    try {
      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      const response = await axios.post("http://localhost:5000/img", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const predictedEmotion = response.data.predicted_emotion;
      setCurrentFace(predictedEmotion);

      if (predictedEmotion !== "No face detected") {
        setCam(true);
        stopCapture();
        setCurrentEmotion(predictedEmotion);

        const emotionSongs = EMOTION_SONGS[predictedEmotion] || [];
        const randomIndex = Math.floor(Math.random() * emotionSongs.length);
        setSongIndex(randomIndex);
        setSong(emotionSongs[randomIndex]);
      }
    } catch (error) {
      console.error("Error sending image to backend:", error);
    }
  };

  const navigateSong = (direction) => {
    if (!currentEmotion) return;

    const emotionSongs = EMOTION_SONGS[currentEmotion];
    const totalSongs = emotionSongs.length;

    let newIndex =
      direction === "next"
        ? (songIndex + 1) % totalSongs
        : (songIndex - 1 + totalSongs) % totalSongs;
    console.log(song);

    setSongIndex(newIndex);
    setSong(emotionSongs[newIndex]);
  };

  return (
    <div className="w-full h-screen bg-black">
      {!cam ? (
        <div
          className="flex items-center justify-start p-4 cursor-pointer"
          onClick={() => setCam(true)}
        >
          <img src={arrow} alt="Back" className="w-8 h-8 mr-2" />
          <h2 className="text-white">Go back</h2>
        </div>
      ) : null}

      {cam ? (
        <div
          className="container mx-auto px-4 py-4 h-full"
          style={{
            backgroundImage: "url('/bgImgSpo.jpeg')",
            backgroundSize: "cover",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h2 className="text-white font-bold mr-2">Emofy</h2>
              <RiNeteaseCloudMusicFill size={25} color="pink" />
              {/* <Music color="limegreen" size={25} /> */}
              {/* <img src={spotify} alt="Spotify" className="w-10 h-10" /> */}
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setCam(false)}
            >
              <Camera color="white" size={35} />
              <Link to="/profile">
                <User color="white" size={35} className="ml-2" />
              </Link>
              {/* <h2 className="text-white font-bold mr-2">Cam</h2>
              <img
                src={camera}
                alt="Camera"
                className="w-8 h-8 cursor-pointer"
                onClick={() => setCam(false)}
              /> */}
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search Songs"
              className="w-full p-2 rounded-lg bg-gray-800 text-white my-4"
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-2 text-white text-left">
                  Search Results
                </h2>
                {searchSongs
                  .filter((song) =>
                    Object.keys(song)[0]
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map((song) => (
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-white">{Object.keys(song)[0]}</h2>
                      <button
                        className="bg-pink-300 text-white px-2 py-1 rounded-lg"
                        // Add logic to play that song on click
                        onClick={() => setSong(Object.values(song)[0])}
                      >
                        Play
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(EMOTION_SONGS).map(([emotion, songs]) => (
              <div
                key={emotion}
                className={`bg-gray-800 text-white p-2 rounded-lg hover:bg-pink-500 transition-colors 
                  ${song.startsWith(emotion) ? "bg-pink-300" : ""}`}
                onClick={() => {
                  const randomIndex = Math.floor(Math.random() * songs.length);
                  setCurrentEmotion(emotion);
                  setSongIndex(randomIndex);
                  setSong(songs[randomIndex]);
                }}
              >
                <h2 className="text-l font-bold">{emotion} Songs</h2>
              </div>
            ))}
          </div>

          {song && (
            <div className="fixed bottom-0 left-0 w-full p-2 bg-gray-900">
              <div className="playbar">
                {song && (
                  <h2 className="text-white text-center text-lg font-semibold mb-2">
                    Now Playing: {song.replace(".mp3", "")}
                  </h2>
                )}
                <AudioPlayer
                  key={song} // Add this line to force re-render
                  src={`/songs/${song}`}
                  autoPlay
                  layout="stacked"
                  className="custom-audio-player"
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    width: "100%",
                    height: "80px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                />
              </div>
              <div className="flex justify-center mt-4">
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-l"
                  onClick={() => navigateSong("previous")}
                >
                  Previous
                </button>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-r ml-2"
                  onClick={() => navigateSong("next")}
                >
                  Next
                </button>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-r ml-2"
                  onClick={() => handlePlaylistToggle(song)}
                >
                  {userPlaylist.includes(song)
                    ? "Remove from Playlist"
                    : "Add to Playlist"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <h1 className="text-2xl mb-4 text-white">Emotion Detection</h1>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
            className="w-full max-w-2xl mx-auto"
          />
          <div className="mt-8">
            {capturing ? (
              <button
                className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 mr-4"
                onClick={stopCapture}
              >
                Stop Capture
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
                onClick={startCapture}
              >
                Start Capture
              </button>
            )}
          </div>
          {capturing && (
            <h3 className="text-white mt-4">You are: {currentFace}</h3>
          )}
        </div>
      )}
    </div>
  );
}

export default Spotify;
