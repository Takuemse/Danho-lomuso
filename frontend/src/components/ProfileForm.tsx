// src/components/ProfileForm.tsx
"use client";

import { useState } from "react";

const PROVINCES = [
  "Harare", "Bulawayo", "Mashonaland East", "Mashonaland West",
  "Mashonaland Central", "Manicaland", "Masvingo", "Midlands",
  "Matabeleland North", "Matabeleland South",
];

interface ProfileData {
  displayName: string;
  language: string;
  province: string;
  schoolName: string;
  examBoard: string;
  currentLevel: string;
  aspirations: string;
}

export default function ProfileForm({ initialData }: { initialData: ProfileData }) {
  const [data, setData] = useState<ProfileData>(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(field: keyof ProfileData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSaved(true);
    } catch {
      // error handling
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Display Name */}
      <div className="bg-white rounded-2xl border border-[#EDE3DC] shadow-card p-5">
        <label className="block text-sm font-semibold text-[#0D4429] mb-3">
          <i className="fa-solid fa-id-card mr-2"></i>Display Name
        </label>
        <input
          type="text"
          value={data.displayName}
          onChange={(e) => update("displayName", e.target.value)}
          placeholder="Your name or nickname"
          className="w-full px-4 py-3 rounded-xl border border-[#EDE3DC] bg-[#FFFDF9] text-sm focus:outline-none focus:border-[#0D4429] transition-colors"
        />
      </div>

      {/* Language */}
      <div className="bg-white rounded-2xl border border-[#EDE3DC] shadow-card p-5">
        <label className="block text-sm font-semibold text-[#0D4429] mb-3">
          <i className="fa-solid fa-language mr-2"></i>Language Preference
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { code: "en", label: "English" },
            { code: "sn", label: "chiShona" },
            { code: "nd", label: "isiNdebele" },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => update("language", lang.code)}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                data.language === lang.code
                  ? "bg-[#0D4429] text-white"
                  : "bg-[#F5EFEB] text-gray-600 hover:bg-[#EDE3DC]"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Province */}
      <div className="bg-white rounded-2xl border border-[#EDE3DC] shadow-card p-5">
        <label className="block text-sm font-semibold text-[#0D4429] mb-3">
          <i className="fa-solid fa-map-location-dot mr-2"></i>Province
        </label>
        <select
          value={data.province}
          onChange={(e) => update("province", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[#EDE3DC] bg-[#FFFDF9] text-sm focus:outline-none focus:border-[#0D4429]"
        >
          <option value="">Select your province...</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* School */}
      <div className="bg-white rounded-2xl border border-[#EDE3DC] shadow-card p-5">
        <label className="block text-sm font-semibold text-[#0D4429] mb-3">
          <i className="fa-solid fa-school mr-2"></i>School Name
        </label>
        <input
          type="text"
          value={data.schoolName}
          onChange={(e) => update("schoolName", e.target.value)}
          placeholder="Your school name"
          className="w-full px-4 py-3 rounded-xl border border-[#EDE3DC] bg-[#FFFDF9] text-sm focus:outline-none focus:border-[#0D4429] transition-colors"
        />
      </div>

      {/* Aspirations */}
      <div className="bg-white rounded-2xl border border-[#EDE3DC] shadow-card p-5">
        <label className="block text-sm font-semibold text-[#0D4429] mb-3">
          <i className="fa-solid fa-star mr-2"></i>Dreams & Aspirations
        </label>
        <textarea
          value={data.aspirations}
          onChange={(e) => update("aspirations", e.target.value)}
          placeholder="What do you dream of becoming? What impact do you want to make?"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[#EDE3DC] bg-[#FFFDF9] text-sm focus:outline-none focus:border-[#0D4429] resize-none transition-colors"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
          saved
            ? "bg-green-500 text-white"
            : "bg-[#0D4429] text-white hover:bg-[#155E38]"
        } disabled:opacity-60`}
      >
        {saving ? (
          <><i className="fa-solid fa-spinner fa-spin"></i>Saving...</>
        ) : saved ? (
          <><i className="fa-solid fa-check"></i>Saved!</>
        ) : (
          <><i className="fa-solid fa-save"></i>Save Profile</>
        )}
      </button>
    </div>
  );
}