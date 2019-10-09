const helpers = require("../../utils/helpers");

describe("helpers", () => {
  describe("get", () => {
    const obj = {
      "Fruit Basket": {
        fruits: {
          banana: "yellow",
          orange: "orange",
          apple: "red"
        }
      }
    };
    it("should response with deep object value if available", () => {
      const val = helpers.get(obj, "Fruit Basket.fruits.banana");
      expect(val).toBe("yellow");
    });
    it("should response with undefined if value isn't available", () => {
      const val = helpers.get(obj, "Fruit Basket.fruits.pear");
      expect(val).toBeUndefined();
    });
  });

  describe("durationAsSeconds", () => {
    it("should return the number representation of given time string", () => {
      expect(helpers.durationAsSeconds("00:00:20")).toEqual(20);
      expect(helpers.durationAsSeconds("00:01:00")).toEqual(60);
      expect(helpers.durationAsSeconds("01:21:37")).toEqual(4897);
    });
  });
});
