import { describe, expect, it } from "vitest";
import { displayName, nextPathAfterAuth } from "./api";
import { formatGoogleSignInError } from "./firebase";

describe("auth routing", () => {
  it("sends new Google users to account setup", () => {
    expect(nextPathAfterAuth({ onboardingComplete: false })).toBe("/setup");
  });

  it("sends returning users to their account", () => {
    expect(nextPathAfterAuth({ onboardingComplete: true })).toBe("/account");
  });
});

describe("displayName", () => {
  it("joins first and last name", () => {
    expect(displayName({ id: 1, firstName: "Bahar", lastName: "U" })).toBe("Bahar U");
  });
});

describe("google errors", () => {
  it("explains a blocked popup", () => {
    expect(formatGoogleSignInError({ code: "auth/popup-blocked" })).toMatch(/Popup blocked/);
  });

  it("stays quiet when the user closes the Google window", () => {
    expect(formatGoogleSignInError({ code: "auth/popup-closed-by-user" })).toBe("");
  });
});
