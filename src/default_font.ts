import { IPolymojiFont } from "../src/polymoji_lib"
import { polymoji_get_unicode_points } from "../src/polymoji_unicode_lookup_table"

export class DefaultFont implements IPolymojiFont
{
    getGlyph(emojiId: string): string
    {
        let file = polymoji_get_unicode_points(emojiId).join('-');
        if(file == "fffd")
        {
            return "SKIP";
        }
        return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${file}.png`;
    }
    getFontName(): string
    {
        return "twemoji"; 
    }
}