// plugins/linux_distros.ts
var LinuxDistroEmojis = [
  { id: "distro/arch", label: "THIS USER USES ARCH, BTW", names: ["arch", "i_use_arch_btw"] }
];
var glyphs = /* @__PURE__ */ new Map([
  ["etc:distro/arch", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Arch_Linux_%22Crystal%22_icon.svg/3840px-Arch_Linux_%22Crystal%22_icon.svg.png"],
  ["etc:distro/kali", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Kali-dragon-icon.svg/1280px-Kali-dragon-icon.svg.png"]
]);
var LinuxDistrosFont = class {
  getFontName() {
    return "linux-distros";
  }
  getGlyph(emojiId) {
    return glyphs.get(emojiId) ?? "SKIP";
  }
};
polymoji.addEmojis(LinuxDistroEmojis);
polymoji.addFont(new LinuxDistrosFont());
