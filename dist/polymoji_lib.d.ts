export interface PMEmoji {
    id: string;
    label: string;
    names: string[];
}
export declare class IPolymojiFont {
    getGlyph(emojiId: string): string;
    getFontName(): string;
}
