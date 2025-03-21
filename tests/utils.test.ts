import { mergeDeep } from '../src/utils/mergeDeep';

describe('Utils feature', () => {
  describe('mergeDeep function', () => {
    it('should merge objects deeply', () => {
      // Given
      const target = {
        a: 1,
        b: {
          c: 2,
          d: 3
        }
      };

      const source = {
        b: {
          c: 4
        }
      };

      const expectedOutput = {
        a: 1,
        b: {
          c: 4,
          d: 3
        }
      };

      // When
      const result = mergeDeep(target, source);

      // Then
      expect(result).toEqual(expectedOutput);
    });

    it('should merge arrays deeply', () => {
      // Given
      const target = {
        a: 1,
        b: {
          c: [2, 3],
          d: 4
        }
      };

      const source = {
        b: {
          c: [5]
        }
      };

      const expectedOutput = {
        a: 1,
        b: {
          c: [2, 3, 5],
          d: 4
        }
      };

      // When
      const result = mergeDeep(target, source);

      // Then
      expect(result).toEqual(expectedOutput);
    });

    it('should merge objects and arrays deeply', () => {
      // Given
      const target = {
        a: 1,
        b: {
          c: [2, 3],
          d: 4
        }
      };

      const source = {
        b: {
          c: [5],
          d: 6
        }
      };

      const expectedOutput = {
        a: 1,
        b: {
          c: [2, 3, 5],
          d: 6
        }
      };

      // When
      const result = mergeDeep(target, source);

      // Then
      expect(result).toEqual(expectedOutput);
    });
  });
});
