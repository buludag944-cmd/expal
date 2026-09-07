type IconProps = { className?: string; title?: string };

export function CompassIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="12" fill="#3aa0e8" />
      <circle cx="16" cy="16" r="8.5" fill="#eaf6ff" />
      <path d="M16 7.5l2.2 6.3 6.3 2.2-6.3 2.2-2.2 6.3-2.2-6.3-6.3-2.2 6.3-2.2z" fill="#f25c54" />
      <circle cx="16" cy="16" r="2.2" fill="#185fa5" />
    </svg>
  );
}

export function HouseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M4 16 L16 6 L28 16 V27 H4Z" fill="#f4c6c2" />
      <path d="M3 16 L16 5 L29 16" fill="none" stroke="#d94840" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M6 16 L16 7.5 L26 16 V26 H6Z" fill="#fff6f4" />
      <rect x="13.2" y="18" width="5.6" height="8" rx="0.8" fill="#f25c54" />
      <path d="M16 5 L20 8.2 V5.6 H23 V11" fill="#d94840" />
    </svg>
  );
}

export function PeopleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="12" cy="11" r="4.2" fill="#3aa0e8" />
      <path d="M5 24.5c0-4 3.2-6.8 7-6.8s7 2.8 7 6.8" fill="#3aa0e8" />
      <circle cx="21" cy="11.5" r="3.6" fill="#185fa5" />
      <path d="M16.2 24.5c.4-3.4 3-5.8 6.6-5.8 3.8 0 6.7 2.6 6.7 6.2" fill="#185fa5" />
    </svg>
  );
}

export function MembersIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="11" cy="10" r="3.6" fill="#e2a23a" />
      <rect x="7.4" y="14.4" width="7.2" height="10.2" rx="2.2" fill="#e2a23a" />
      <circle cx="21" cy="10" r="3.6" fill="#c9841d" />
      <rect x="17.4" y="14.4" width="7.2" height="10.2" rx="2.2" fill="#c9841d" />
    </svg>
  );
}

export function BriefcaseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="5" y="12" width="22" height="14" rx="3" fill="#8a5a32" />
      <rect x="5" y="12" width="22" height="5" rx="2" fill="#a56c3c" />
      <path d="M12 12 V9.2 A4 4 0 0 1 16 6.4 A4 4 0 0 1 20 9.2 V12" fill="none" stroke="#6d4526" strokeWidth="2" />
      <rect x="14.2" y="16.4" width="3.6" height="3.2" rx="0.8" fill="#f3d7b5" />
    </svg>
  );
}

export function IdCardIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="4" y="8" width="24" height="16" rx="3" fill="#d9e6f7" stroke="#7ea4d4" strokeWidth="1.4" />
      <rect x="7" y="11.4" width="7" height="9" rx="1.2" fill="#8fb3dc" />
      <rect x="16" y="12" width="9" height="2" rx="1" fill="#5b87bc" />
      <rect x="16" y="16" width="7" height="2" rx="1" fill="#9bb6d6" />
      <rect x="16" y="20" width="5" height="1.6" rx="0.8" fill="#c5d6ea" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M7 8h18a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H14l-6 5v-5H7a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3z" fill="#3aa0e8" />
      <circle cx="12" cy="15.5" r="1.4" fill="white" />
      <circle cx="16" cy="15.5" r="1.4" fill="white" />
      <circle cx="20" cy="15.5" r="1.4" fill="white" />
    </svg>
  );
}

export function ScalesIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 6 v18" stroke="#6b7280" strokeWidth="2" />
      <path d="M10 24h12" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 10h16" stroke="#4b5563" strokeWidth="2" />
      <path d="M10 10 l-4 7 h8z" fill="#cfd5dd" stroke="#6b7280" strokeWidth="1.2" />
      <path d="M22 10 l-4 7 h8z" fill="#cfd5dd" stroke="#6b7280" strokeWidth="1.2" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="5" y="7" width="22" height="20" rx="4" fill="#fff" stroke="#e8b4b0" strokeWidth="1.2" />
      <rect x="5" y="7" width="22" height="7" rx="4" fill="#f25c54" />
      <rect x="5" y="11" width="22" height="3" fill="#f25c54" />
      <text x="16" y="12.2" textAnchor="middle" fontSize="5.2" fontWeight="700" fill="white">
        JUL
      </text>
      <text x="16" y="23.4" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1a1210">
        17
      </text>
    </svg>
  );
}

export function HelpIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <text x="16" y="24" textAnchor="middle" fontSize="22" fontWeight="800" fill="#e11d2e">
        ?
      </text>
    </svg>
  );
}

export function BulbIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 5c-5 0-9 3.8-9 8.6 0 3.2 1.7 6 4.3 7.5L12 24h8l.7-2.9C23.3 19.6 25 16.8 25 13.6 25 8.8 21 5 16 5z" fill="#f5d76e" />
      <rect x="12.4" y="24.2" width="7.2" height="2.4" rx="0.8" fill="#d6b84a" />
      <path d="M16 9.2c2.4 0 4.4 1.8 4.4 4" fill="none" stroke="#fff4b8" strokeWidth="1.6" />
    </svg>
  );
}

export function BooksIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="6" y="8" width="6" height="17" rx="1.2" fill="#3aa0e8" transform="rotate(-8 9 16.5)" />
      <rect x="13" y="7" width="6.2" height="18" rx="1.2" fill="#f25c54" />
      <rect x="20" y="8.5" width="6" height="16.5" rx="1.2" fill="#3d8f4a" transform="rotate(8 23 16.7)" />
    </svg>
  );
}

export function BellIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 5c-4.6 0-8 3.2-8 8v5l-2 3h20l-2-3v-5c0-4.8-3.4-8-8-8z" fill="#e2b15a" />
      <path d="M12.4 24.2a3.8 3.8 0 0 0 7.2 0" fill="#c9942e" />
    </svg>
  );
}

export function MailboxIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="5" y="12" width="22" height="12" rx="3" fill="#3aa0e8" />
      <path d="M5 14.2 L16 21 L27 14.2" fill="none" stroke="white" strokeWidth="1.8" />
      <rect x="20" y="8" width="7" height="6" rx="1" fill="#185fa5" />
    </svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="8" y="14" width="16" height="12" rx="3" fill="#e2b15a" />
      <path d="M11.5 14 V11 a4.5 4.5 0 0 1 9 0 v3" fill="none" stroke="#c9942e" strokeWidth="2.2" />
      <circle cx="16" cy="20" r="1.6" fill="#8a6918" />
    </svg>
  );
}

export function PencilIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M20 6 l6 6-14 14H6V20z" fill="#f0c14b" />
      <path d="M20 6 l6 6" fill="none" stroke="#c9a227" strokeWidth="1.4" />
      <path d="M8 24 l4 0 0-4" fill="#d4a017" />
    </svg>
  );
}

export function HomeTabIcon({ className, active }: IconProps & { active?: boolean }) {
  const fill = active ? "#e23b4a" : "#8d8a8a";
  return (
    <svg className={className} viewBox="0 0 28 28" aria-hidden="true">
      <path d="M4 13 L14 5 L24 13 V24 H4Z" fill={fill} />
    </svg>
  );
}

export function ProfileTabIcon({ className, active }: IconProps & { active?: boolean }) {
  const fill = active ? "#3b82f6" : "#8d8a8a";
  return (
    <svg className={className} viewBox="0 0 28 28" aria-hidden="true">
      <circle cx="14" cy="9" r="5" fill={fill} />
      <path d="M4 24c0-5 4.2-8 10-8s10 3 10 8" fill={fill} />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.2" fill="none" stroke="#9aa0a6" strokeWidth="2" />
      <path d="M16 16 L20.2 20.2" stroke="#9aa0a6" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M7 4 L13 10 L7 16" fill="none" stroke="#c5c5c7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function BackIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function FabChatIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M7 8h18a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H14l-6 5v-5H7a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3z"
        fill="white"
      />
    </svg>
  );
}

export function AvatarScene({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true">
      <rect width="120" height="120" fill="#d9d4cf" />
      <rect x="8" y="70" width="104" height="42" rx="6" fill="#cfc8c1" />
      <ellipse cx="60" cy="78" rx="38" ry="10" fill="#bdb6ae" />
      <circle cx="38" cy="52" r="12" fill="#6f6a66" />
      <path d="M22 86c0-12 7-20 16-20s16 8 16 20" fill="#7d7873" />
      <circle cx="82" cy="50" r="12" fill="#595550" />
      <path d="M66 86c0-12 7-21 16-21s16 9 16 21" fill="#4f4b47" />
      <circle cx="60" cy="46" r="11" fill="#8a8580" />
      <path d="M46 86c1-13 7-22 14-22s13 9 14 22" fill="#9a948e" />
      <rect x="28" y="74" width="64" height="8" rx="2" fill="#aaa49d" />
    </svg>
  );
}
