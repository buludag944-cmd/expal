import AuthCard from "@/components/AuthCard";

export const metadata = {
  title: "Log in",
  description: "Log in to the EXPal web version with your Google account.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <div className="section">
      <div className="site-wrap" style={{ maxWidth: 520 }}>
        <AuthCard mode="login" />
      </div>
    </div>
  );
}
