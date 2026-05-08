import { IPolymojiFont } from "../src/polymoji_lib";
export declare class DefaultFont implements IPolymojiFont {
    getGlyph(emojiId: string): string;
    getFontName(): string;
}
