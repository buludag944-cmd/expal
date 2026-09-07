import AuthCard from "@/components/AuthCard";

export const metadata = {
  title: "Set up your account",
  description: "Create a free EXPal account with Google and start your move checklist.",
  alternates: { canonical: "/signup" },
};

export default function SignupPage() {
  return (
    <div className="section">
      <div className="site-wrap" style={{ maxWidth: 520 }}>
        <AuthCard mode="signup" />
      </div>
    </div>
  );
}
