require("jest");
const helpers = require("../../utils/helpers");

describe("helpers", () => {
  describe("get", () => {
    it("should response with deep object value if available", () => {
      const obj = {
        "Fruit Basket": {
          fruits: {
            banana: "yellow",
            orange: "orange",
            apple: "red"
          }
        }
      };
      const val = helpers.get(obj, "Fruit Basket.fruits.banana");
      expect(val).toBe("yellow");
    });
  });
});
