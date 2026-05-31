import { describe, expect, it } from "vitest";

import nextConfig from "@/next.config";

describe("static export image configuration", () => {
  it("serves image assets directly for static export deployments", () => {
    expect(nextConfig.output).toBe("export");
    expect(nextConfig.images?.unoptimized).toBe(true);
  });
});
