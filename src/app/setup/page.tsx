"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { SITE } from "@/lib/site";

const COUNTRIES = ["Ireland", "Germany", "Netherlands", "United Kingdom", "France", "Spain", "Other"];
const CITIES: Record<string, string[]> = {
  Ireland: ["Dublin", "Cork", "Galway"],
  Germany: ["Berlin", "Munich", "Frankfurt"],
  Netherlands: ["Amsterdam", "Rotterdam", "The Hague"],
  "United Kingdom": ["London", "Manchester", "Edinburgh"],
};
const VISAS = [
  "CSEP (Critical Skills Employment Permit)",
  "General Work Permit",
  "EU Passport / EU Citizen",
  "Stamp 1",
  "Stamp 4",
  "Other",
];

export default function SetupPage() {
  const { user, ready, completeSetup, busy, error } = useAuth();
  const router = useRouter();
  const [destinationCountry, setDestinationCountry] = useState("Ireland");
  const [destinationCity, setDestinationCity] = useState("Dublin");
  const [profession, setProfession] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("employed");
  const [visaType, setVisaType] = useState(VISAS[0]);
  const [alreadyArrived, setAlreadyArrived] = useState(true);
  const [arrivalDate, setArrivalDate] = useState("");

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/signup");
    else if (user.onboardingComplete) router.replace("/account");
  }, [ready, user, router]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    await completeSetup({
      destinationCountry,
      destinationCity,
      profession,
      professionCategory: "Other",
      employmentStatus,
      visaType,
      alreadyArrived,
      arrivalDate: alreadyArrived ? arrivalDate : "",
      moveDate: alreadyArrived ? "" : arrivalDate,
      familyStatus: "single",
      concerns: [],
      homeCountry: "",
    });
    router.push("/account");
  }

  if (!ready || !user || user.onboardingComplete) {
    return (
      <div className="section">
        <div className="site-wrap">
          <p className="muted">Loading your account…</p>
        </div>
      </div>
    );
  }

  const cities = CITIES[destinationCountry] || ["Other"];

  return (
    <div className="section">
      <div className="site-wrap" style={{ maxWidth: 620 }}>
        <div className="section-head">
          <p className="eyebrow">Almost there</p>
          <h1 className="page-title">Set up your account</h1>
          <p className="lede">
            Signed in as {user.email}. A few details personalise visa guidance in{" "}
            {SITE.name}. You can change them later in the app.
          </p>
        </div>
        <form className="form editor-card" style={{ padding: "1.4rem" }} onSubmit={onSubmit}>
          <label>
            Destination country
            <select
              value={destinationCountry}
              onChange={(e) => {
                setDestinationCountry(e.target.value);
                setDestinationCity((CITIES[e.target.value] || ["Other"])[0]);
              }}
            >
              {COUNTRIES.map((country) => (
                <option key={country}>{country}</option>
              ))}
            </select>
          </label>
          <label>
            City
            <select value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)}>
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </label>
          <label>
            What do you do?
            <input
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="Product manager, nurse, student…"
              required
            />
          </label>
          <label>
            Employment
            <select value={employmentStatus} onChange={(e) => setEmploymentStatus(e.target.value)}>
              <option value="employed">Employed</option>
              <option value="job_seeking">Looking for work</option>
              <option value="unemployed">Unemployed</option>
              <option value="laid_off">Redundant / laid off</option>
            </select>
          </label>
          <label>
            Visa / permission
            <select value={visaType} onChange={(e) => setVisaType(e.target.value)}>
              {VISAS.map((visa) => (
                <option key={visa}>{visa}</option>
              ))}
            </select>
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={alreadyArrived}
              onChange={(e) => setAlreadyArrived(e.target.checked)}
            />
            I am already in the country
          </label>
          <label>
            {alreadyArrived ? "Arrival date" : "Planned move date"}
            <input
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              required
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <div className="hero-actions">
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "Saving…" : "Finish account setup"}
            </button>
            <Link className="btn btn-ghost" href="/">
              Back to journal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
