type ProfileAvatarProps = {
  name: string | null;
  avatarUrl: string | null;
  className?: string;
};

function getInitials(name: string | null) {
  if (!name?.trim()) {
    return "L";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function ProfileAvatar({
  name,
  avatarUrl,
  className = "h-20 w-20 text-2xl",
}: ProfileAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name ? `${name}'s avatar` : "Profile avatar"}
        className={`${className} rounded-2xl border-4 border-white object-cover shadow-lg`}
      />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center rounded-2xl bg-[#14532D] font-black text-white shadow-[0_18px_30px_-20px_rgba(20,83,45,0.9)]`}
      aria-label={name ? `${name}'s initials` : "Profile initials"}
    >
      {getInitials(name)}
    </div>
  );
}
