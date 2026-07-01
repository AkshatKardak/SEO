// ScheduleSelector.tsx
import { useState } from "react";
import axios from "axios";

const options = [
  { value: "daily", label: "Daily (6 AM)", icon: "🌅" },
  { value: "weekly", label: "Weekly (Mon 6 AM)", icon: "📅" },
  { value: "off", label: "Off", icon: "🔕" },
];

export default function ScheduleSelector({ current, onChange}: { current: string;  onChange?: (val: string) => void; }) {
  const [selected, setSelected] = useState(current);
  const [saving, setSaving] = useState(false);

  const save = async (val: string) => {
    setSaving(true);
    setSelected(val);
    onChange?.(val);
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/schedule`,
      { schedulePreference: val },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Auto Rank Check Schedule
      </p>
      <div className="flex gap-3">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => save(o.value)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              selected === o.value
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300"
            }`}
          >
            {o.icon} {o.label}
          </button>
        ))}
      </div>
      {saving && <p className="text-xs text-gray-400">Saving...</p>}
    </div>
  );
}