"use client";
import AskNinaButton from "@/components/common/Button";
import { useAuthStore } from "@/providers/authStoreProvider";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const { user, profile, getUserProfile, updateUserProfile } = useAuthStore(
    (state) => state
  );

  const [username, setUsername] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [pronouns, setPronouns] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  useEffect(() => {
    if (user.uid) {
      getUserProfile(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setDateOfBirth(profile.dateOfBirth);
      setPronouns(profile.pronouns);
    }
  }, [profile]);

  const profileFields = [
    {
      value: username,
      onChange: (e: any) => setUsername(e.target.value),
      label: "Username:",
      type: "text",
    },
    {
      value: pronouns,
      onChange: (e: any) => setPronouns(e.target.value),
      label: "Pronouns:",
      type: "text",
    },
    {
      value: dateOfBirth,
      onChange: (e: any) => setDateOfBirth(e.target.value),
      label: "Date of Birth:",
      type: "text",
    },
  ];

  const handleSave = (e: any) => {
    e.preventDefault();
    setLoading(true);
    updateUserProfile({ username, pronouns, dateOfBirth });
    setLoading(false);
    setShowMessage(true);
  };

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => setShowMessage(false), 2000);
    }
  }, [showMessage]);

  return (
    <div>
      <div className="w-full p-4 md:p-0 flex flex-col items-center mt-24">
        <h2 className="font-display text-2xl">Profile</h2>
        <form className="flex flex-col items-center space-y-4 w-full p-2 md:w-3/5 my-4">
          {profileFields.map((param) => (
            <div className="flex flex-row w-full items-end" key={param.label}>
              <div className="w-1/3">{param.label}</div>
              <input
                className="border-b rounded-sm border-primaryPurple flex-1 p-1"
                value={param.value}
                onChange={param.onChange}
                type={param.type}
              />
            </div>
          ))}

          <AskNinaButton
            label={"Save"}
            onClick={handleSave}
            otherStyles="bg-primaryPurple text-white shadow-sm"
          />
          {loading && <div>Loading...</div>}
          {showMessage && <div>Saved successfully!</div>}
        </form>
      </div>
    </div>
  );
};

export default Profile;
