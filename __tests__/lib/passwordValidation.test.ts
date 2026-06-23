import {
  digitSumIsPrime,
  hasConsecutiveLetters,
  countUppercase,
  hasEmoji,
  hasRomanNumeral,
} from "@/lib/passwordValidation";

describe("digitSumIsPrime", () => {
  it("returns false for empty string", () => {
    expect(digitSumIsPrime("")).toBe(false);
  });

  it("returns false when digit sum is 0 or 1", () => {
    expect(digitSumIsPrime("abc")).toBe(false); // no digits, sum=0
    expect(digitSumIsPrime("1abc")).toBe(false); // sum=1
  });

  it("returns true when digit sum is prime (2, 3, 5, 7, 11...)", () => {
    expect(digitSumIsPrime("2")).toBe(true);   // sum=2
    expect(digitSumIsPrime("12")).toBe(true);  // sum=3
    expect(digitSumIsPrime("23")).toBe(true);  // sum=5
    expect(digitSumIsPrime("34")).toBe(true);  // sum=7
    expect(digitSumIsPrime("29")).toBe(true);  // sum=11
  });

  it("returns false when digit sum is not prime (4, 6, 8, 9...)", () => {
    expect(digitSumIsPrime("4")).toBe(false);  // sum=4
    expect(digitSumIsPrime("33")).toBe(false); // sum=6
    expect(digitSumIsPrime("44")).toBe(false); // sum=8
    expect(digitSumIsPrime("45")).toBe(false); // sum=9
  });
});

describe("hasConsecutiveLetters", () => {
  it("returns false for empty string", () => {
    expect(hasConsecutiveLetters("")).toBe(false);
  });

  it("returns false when no consecutive letters", () => {
    expect(hasConsecutiveLetters("ace")).toBe(false);
    expect(hasConsecutiveLetters("bdf")).toBe(false);
    expect(hasConsecutiveLetters("Hello123")).toBe(false);
  });

  it("returns true when consecutive letters present", () => {
    expect(hasConsecutiveLetters("ab")).toBe(true);
    expect(hasConsecutiveLetters("cd")).toBe(true);
    expect(hasConsecutiveLetters("Hello_ab")).toBe(true);
    expect(hasConsecutiveLetters("XYZ")).toBe(true); // case insensitive
  });
});

describe("countUppercase", () => {
  it("returns 0 for empty string", () => {
    expect(countUppercase("")).toBe(0);
  });

  it("returns 0 when no uppercase", () => {
    expect(countUppercase("hello")).toBe(0);
    expect(countUppercase("123")).toBe(0);
  });

  it("counts uppercase letters correctly", () => {
    expect(countUppercase("Hello")).toBe(1);
    expect(countUppercase("HeLLo")).toBe(3);
    expect(countUppercase("HELLO")).toBe(5);
  });
});

describe("hasEmoji", () => {
  it("returns false when no fire emoji", () => {
    expect(hasEmoji("")).toBe(false);
    expect(hasEmoji("hello")).toBe(false);
    expect(hasEmoji("🎉🎊")).toBe(false);
  });

  it("returns true when fire emoji present", () => {
    expect(hasEmoji("🔥")).toBe(true);
    expect(hasEmoji("hello🔥world")).toBe(true);
    expect(hasEmoji("🔥🔥")).toBe(true);
  });
});

describe("hasRomanNumeral", () => {
  it("returns false for empty string or no roman numerals", () => {
    expect(hasRomanNumeral("")).toBe(false);
    expect(hasRomanNumeral("hello")).toBe(false);
    expect(hasRomanNumeral("123")).toBe(false);
  });

  it("returns true when roman numeral letters present", () => {
    expect(hasRomanNumeral("I")).toBe(true);
    expect(hasRomanNumeral("V")).toBe(true);
    expect(hasRomanNumeral("X")).toBe(true);
    expect(hasRomanNumeral("hello_V_world")).toBe(true);
    expect(hasRomanNumeral("mIxed")).toBe(true);
  });
});
