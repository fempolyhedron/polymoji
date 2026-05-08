import { IPolymojiFont, PMEmoji } from "../src/polymoji_lib"

const LinuxDistroEmojis: PMEmoji[] =
[
    {id: "distro/arch", label: "THIS USER USES ARCH, BTW", names: ["arch", "i_use_arch_btw"]}
]

const glyphs: Map<string, string> = new Map
([
    ["etc:distro/arch", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Arch_Linux_%22Crystal%22_icon.svg/3840px-Arch_Linux_%22Crystal%22_icon.svg.png"],
    ["etc:distro/kali", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Kali-dragon-icon.svg/1280px-Kali-dragon-icon.svg.png"]
]);

class LinuxDistrosFont implements IPolymojiFont
{
    getFontName(): string
    {
        return "linux-distros";    
    }

    getGlyph(emojiId: string): string
    {
        return glyphs.get(emojiId) ?? "SKIP";
    }
}

//@ts-ignore
polymoji.addEmojis(LinuxDistroEmojis);

//@ts-ignore
polymoji.addFont(new LinuxDistrosFont());