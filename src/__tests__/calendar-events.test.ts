import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next-auth/jwt
vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn(),
}));

import { GET } from "@/app/api/calendar-events/route";
import { getToken } from "next-auth/jwt";

function createRequest(url: string): Request {
  return new Request(url);
}

describe("GET /api/calendar-events", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when no token is present", async () => {
    vi.mocked(getToken).mockResolvedValue(null);

    const req = createRequest("http://localhost:3000/api/calendar-events");
    const res = await GET(req as never);

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Not authenticated");
  });

  it("returns 401 when token has no accessToken", async () => {
    vi.mocked(getToken).mockResolvedValue({
      sub: "123",
    } as never);

    const req = createRequest("http://localhost:3000/api/calendar-events");
    const res = await GET(req as never);

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("No access token");
  });
});
