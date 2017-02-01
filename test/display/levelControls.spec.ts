import { expect } from "chai";
import { transformReponseToLevels } from "../../src/block-fly/display/levelControls";

describe("!unit! levelControls", () => {
  describe("transformReponseToLevels", () => {
    it("Parses a basic file with an array of strings and strings", () => {
      const response = [
        "###",
        "####"
      ];

      const parsed = transformReponseToLevels(response, "");

      expect(parsed).to.deep.equal({
        name: undefined,
        uri: "",
        levels: [
          {
            name: undefined,
            number: 1,
            password: undefined,
            text: "###"
          },
          {
            name: undefined,
            number: 2,
            password: undefined,
            text: "####"
          }
        ]
      });
    });

    it("Parses a basic file with an array of array of strings", () => {
      const response = [
        ["###", "###"],
        ["####", "####"]
      ];

      const parsed = transformReponseToLevels(response, "");

      expect(parsed).to.deep.equal({
        name: undefined,
        uri: "",
        levels: [
          {
            name: undefined,
            number: 1,
            password: undefined,
            text: "###\n###"
          },
          {
            name: undefined,
            number: 2,
            password: undefined,
            text: "####\n####"
          }
        ]
      });
    });

    it("Parses a file with an array of levels", () => {
      const response = [
        {
          "number": 1,
          "name": "Level 1",
          "text": ["###", "###"]
        },
        {
          "name": "Level 2",
          "text": ["####", "####"],
          "password": "222"
        }
      ];

      const parsed = transformReponseToLevels(response, "");

      expect(parsed).to.deep.equal({
        name: undefined,
        uri: "",
        levels: [
          {
            "number": 1,
            "name": "Level 1",
            "text": "###\n###",
            "password": undefined
          },
          {
            "number": 2,
            "name": "Level 2",
            "text": "####\n####",
            "password": "222"
          }
        ]
      });
    });

    it("Parses a file with a complex level", () => {
      const response = {
        name: "Super cool levels",
        levels: [
          {
            "number": 1,
            "name": "Level 1",
            "text": ["###", "###"]
          },
          {
            "name": "Level 2",
            "text": ["####", "####"],
            "password": "222"
          }
        ]
      };

      const parsed = transformReponseToLevels(response, "");

      expect(parsed).to.deep.equal({
        name: "Super cool levels",
        uri: "",
        levels: [
          {
            "number": 1,
            "name": "Level 1",
            "text": "###\n###",
            "password": undefined
          },
          {
            "number": 2,
            "name": "Level 2",
            "text": "####\n####",
            "password": "222"
          }
        ]
      });
    });
  });
});
