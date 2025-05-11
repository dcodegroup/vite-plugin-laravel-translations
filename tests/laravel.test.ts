import { determineLaravelVersion } from "../src/laravel";

describe("Laravel feature", () => {
  describe("determineLaravelVersion function", () => {
    it("should return the correct Laravel version", () => {
      // Given
      const expectedVersions = [9, 10, 11];

      // When
      expectedVersions.forEach((version: number) => {
        const composerPath = `tests/fixtures/laravel/composer-v${version}.json`;
        const laravelVersion = determineLaravelVersion(composerPath);

        // Then
        expect(laravelVersion).toBe(version);
      });
    });
  });
});
