export interface PMEmoji
{
    id: string;
    label: string;
    names: string[];
}

export class IPolymojiFont
{
    getGlyph(emojiId: string): string { return ""; }
    getFontName(): string { return ""; }
}