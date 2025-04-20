import {
  globPattern,
  configureNamespaceIfNeeded,
  translationContentByFileExtension,
  generateNestedObjectStructure,
  replaceInterpolation,
  buildTranslations,
} from "../src/loader";

describe("Loader feature", () => {
  describe("globPattern function", () => {
    it("should return the glob pattern with JSON files", () => {
      // Given
      const expectedPattern = "**/*.{json,php}";
      const shouldIncludeJson = true;

      // When
      const pattern = globPattern(shouldIncludeJson);

      // Then
      expect(pattern).toBe(expectedPattern);
    });

    it("should return the glob pattern without JSON files", () => {
      // Given
      const expectedPattern = "**/*.php";
      const shouldIncludeJson = false;

      // When
      const pattern = globPattern(shouldIncludeJson);

      // Then
      expect(pattern).toBe(expectedPattern);
    });
  });

  describe("configureNamespaceIfNeeded function", () => {
    it("should return the path split without the namespace", () => {
      // Given
      const expectedPathSplit = ["path", "to", "file"];
      const pathSplit = ["path", "to", "file"];
      const namespace = "";

      // When
      const path = configureNamespaceIfNeeded(pathSplit, namespace);

      // Then
      expect(path).toEqual(expectedPathSplit);
    });

    it("should return the path split with the namespace", () => {
      // Given
      // When the namespace is provided, the path split is ommitted
      const expectedPathSplit = [];
      const pathSplit = ["path", "to", "file"];
      const namespace = "namespace";

      // When
      const path = configureNamespaceIfNeeded(pathSplit, namespace);

      // Then
      expect(path).toEqual(expectedPathSplit);
    });
  });

  describe("translationContentByFileExtension function", () => {
    it("should return the translation content for PHP files", async () => {
      // Given
      const fileExtension = ".php";
      const file = "tests/fixtures/translations.php";
      const expectedContent = { key1: "value1", key2: "value2" };

      // When
      const content = await translationContentByFileExtension(fileExtension, file);

      // Then
      expect(content).toEqual(expectedContent);
    });

    it("should return the translation content for JSON files", async () => {
      // Given
      const fileExtension = ".json";
      const file = "tests/fixtures/translations.json";
      const expectedContent = { key1: "value1", key2: "value2" };

      // When
      const content = await translationContentByFileExtension(fileExtension, file);

      // Then
      expect(content).toEqual(expectedContent);
    });
  });

  describe("generateNestedObjectStructure function", () => {
    it("should return the nested object structure", () => {
      // Given
      const pathSplit = ["path", "to", "file"];
      const expectedStructure = { path: { to: { file: {} } } };

      // When
      const structure = generateNestedObjectStructure(pathSplit, {});

      // Then
      expect(structure).toEqual(expectedStructure);
    });

    it("should return the nested object structure with existing object", () => {
      // Given
      const pathSplit = ["path", "to", "file"];
      const expectedStructure = { path: { to: { file: { key: "value" } } } };

      // When
      const structure = generateNestedObjectStructure(pathSplit, { key: "value" });

      // Then
      expect(structure).toEqual(expectedStructure);
    });
  });

  describe("replaceInterpolation function", () => {
    it("should return the object structure with the new interpolation", () => {
      // Given
      const object = { key: "{{value}}" };
      const interpolation = { prefix: "{{", suffix: "}}" };
      const expectedObject = { key: "{{value}}" };

      // When
      const newObject = replaceInterpolation(object, interpolation);

      // Then
      expect(newObject).toEqual(expectedObject);
    });
  });

  describe("buildTranslations function", () => {
    it("should return the translations object using namespace", async () => {
      // Given
      const absLangPath = "tests/fixtures";
      const pluginConfiguration = {
        includeJson: true,
        namespace: "namespace",
      };
      const expectedTranslations = {
        // This is a combination from JSON and PHP files
        key1: "value1",
        key2: "value2",
        key: "Value",
        "another-key": "Another value",
        "php-key": "php",
        "key-from-php": "value-from-php",
      };

      // When
      const translations = await buildTranslations(absLangPath, pluginConfiguration);

      // Then
      expect(translations).toEqual(expectedTranslations);
    });
  });

  describe("buildTranslations function without namespace", () => {
    it("should return the translations object without using namespace", async () => {
      // Given
      const absLangPath = "tests/fixtures";
      const pluginConfiguration = {
        includeJson: true,
      };
      const expectedTranslations = {
        // This is the namespace
        translations: {
          key1: "value1",
          key2: "value2",
        },
        // This is the namespace
        "translations-for-build-test-json": {
          key: "Value",
          "another-key": "Another value",
        },
        // This is the namespace
        "translations-for-build-test-php": {
          "key-from-php": "value-from-php",
          "php-key": "php",
        },
      };

      // When
      const translations = await buildTranslations(absLangPath, pluginConfiguration);

      // Then
      expect(translations).toEqual(expectedTranslations);
    });
  });
});
