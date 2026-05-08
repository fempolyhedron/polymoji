// plugins/pride_flags.ts
var assets = typeof pride_flag_content_network !== "undefined" ? pride_flag_content_network : "https://emoji.lgbt/assets/svg/";
var glyphs = /* @__PURE__ */ new Map([
  //general pride
  ["flags:pride/rainbow", assets + "gay-flag.svg"],
  ["flags:pride/pride", assets + "gay-flag.svg"],
  //cant find a fucking twemoji like pride flag ffs
  //gender identity
  ["flags:pride/trans", assets + "trans-flag.svg"],
  ["flags:pride/nonbinary", assets + "enby-flag.svg"],
  ["flags:pride/genderfluid", assets + "fluid-flag.svg"],
  ["flags:pride/agender", assets + "agender-flag.svg"],
  //sexual orientation
  ["flags:pride/lesbian", assets + "lesbian-flag.svg"],
  ["flags:pride/bisexual", assets + "bi-flag.svg"],
  ["flags:pride/pansexual", assets + "pan-flag.svg"],
  ["flags:pride/asexual", assets + "ace-flag.svg"],
  ["flags:pride/aromantic", assets + "aro-flag.svg"],
  ["flags:pride/aromantic_asexual", assets + "aroace-flag.svg"],
  ["flags:pride/grayromantic", "https://cdn3.emoji.gg/emojis/2735-grayromantic-flag.png"]
]);
var PrideFlagsFont = class {
  getFontName() {
    return "pride-flags";
  }
  getGlyph(emojiId) {
    return glyphs.get(emojiId) ?? "SKIP";
  }
};
polymoji.addFont(new PrideFlagsFont());
