import React, { useState } from "react";
import { useUpdateProfile } from "@/hooks/useUserProfile";
import { Loader2, X } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentAvatarUrl: string;
  currentBio: string;
}

const PRESET_AVATARS = [
  { name: "Luffy", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Luffy" },
  { name: "Naruto", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Naruto" },
  { name: "Sakura", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sakura" },
  { name: "Zoro", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoro" },
  { name: "Goku", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Goku" },
  { name: "Usagi", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Usagi" },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentName,
  currentAvatarUrl,
  currentBio,
}) => {
  const updateProfileMutation = useUpdateProfile();
  const [name, setName] = useState(currentName);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [bio, setBio] = useState(currentBio);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    updateProfileMutation.mutate(
      { name, avatarUrl, bio },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err) => {
          setErrorMsg(err.message || "Something went wrong. Please check your inputs.");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-lg bg-white border-4 border-zinc-950 p-6 shadow-[8px_8px_0px_#000] relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 border-2 border-zinc-950 p-1 bg-white hover:bg-zinc-100 transition-colors shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] cursor-pointer"
        >
          <X className="w-5 h-5 text-zinc-950" />
        </button>

        {/* Modal Title */}
        <h3 className="font-bebas text-3xl font-black text-zinc-950 tracking-wider uppercase border-b-4 border-zinc-950 pb-2 mb-6">
          Edit Profile Cards
        </h3>

        {errorMsg && (
          <div className="mb-4 border-2 border-red-500 bg-red-50 p-3 text-xs font-semibold text-red-700">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bebas text-lg font-bold tracking-wide text-zinc-800 uppercase">
              Username / Nickname
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-4 border-zinc-950 bg-white px-3 py-2 text-zinc-900 font-sans font-bold shadow-[2px_2px_0px_#000] focus:outline-none focus:shadow-[4px_4px_0px_#FF6B00] transition-all"
            />
          </div>

          {/* Avatar Url / Presets Field */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bebas text-lg font-bold tracking-wide text-zinc-800 uppercase">
              Avatar Image URL
            </label>
            <input
              type="url"
              required
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="border-4 border-zinc-950 bg-white px-3 py-2 text-zinc-900 font-mono text-xs font-bold shadow-[2px_2px_0px_#000] focus:outline-none focus:shadow-[4px_4px_0px_#FF6B00] transition-all mb-2"
              placeholder="https://example.com/avatar.jpg"
            />

            {/* Quick Presets Selector */}
            <div className="mt-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Quick Character Presets
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_AVATARS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setAvatarUrl(preset.url)}
                    className={`px-3 py-1 text-xs border-2 border-zinc-950 font-bebas font-black tracking-wide uppercase transition-all shadow-[1.5px_1.5px_0px_#000] cursor-pointer ${
                      avatarUrl === preset.url
                        ? "bg-[#FF6B00] text-white"
                        : "bg-zinc-50 hover:bg-zinc-100 text-zinc-800"
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bio Field */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bebas text-lg font-bold tracking-wide text-zinc-800 uppercase">
              Profile Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              className="border-4 border-zinc-950 bg-white px-3 py-2 text-zinc-900 font-sans font-medium shadow-[2px_2px_0px_#000] focus:outline-none focus:shadow-[4px_4px_0px_#FF6B00] transition-all resize-none"
              placeholder="Tell other readers about your profile..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t-2 border-dashed border-zinc-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 border-zinc-950 font-bebas text-md tracking-wider shadow-[2px_2px_0px_#000] hover:bg-zinc-100 transition-all cursor-pointer uppercase font-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="px-5 py-2 border-4 border-zinc-950 bg-[#FF6B00] text-white font-bebas text-md tracking-wider shadow-[3px_3px_0px_#000] hover:bg-[#FF6B00]/95 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#000] disabled:opacity-50 transition-all cursor-pointer uppercase font-black flex items-center gap-1.5"
            >
              {updateProfileMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
