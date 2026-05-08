/**
 * polymoji
 * 
 * 
 */

const VERSION: string  = "0.1";
const BUILD: string = "dev";

import { polymoji_get_unicode_lookup_table } from "./polymoji_unicode_lookup_table";
import { PMEmoji, IPolymojiFont } from "./polymoji_lib"
import { DefaultFont } from "./default_font";
import { PMEmojiTable } from "./polymoji_emojis";

class PolymojiConfig
{
    disableAutoInit: boolean;
    dontLoadFont: boolean;

    constructor()
    {
        this.disableAutoInit = false;
        this.dontLoadFont = false;
    }
}

declare var polymoji_config: PolymojiConfig;

enum PMParserMode
{
    text, // :transgender_flag: :trans: :trans_flag:
    inline, // $emoji:transgender_flag:
    tag, // <emoji name="flags:pride/trans"></emoji>
    unicode // 🏳️‍⚧️ 
}

const polymoji_unicode_lookup_table: Map<string, string> = polymoji_get_unicode_lookup_table();
const style_elem = document.createElement("style");
style_elem.id = "polymoji-style";

class polymoji
{
    private static emoji_table = PMEmojiTable;
    private static loaded_style1: string = "";
    private static loaded_style2: string = "";
    private static loaded_font: IPolymojiFont = new IPolymojiFont();
    public static readonly version: string = `${VERSION}-${BUILD}`

    /**
     * returns a <emoji> tag based on input <emoji> tag
     * 
     * @param {HTMLElement} elem element to parse
     * @returns {string} html <emoji> tag
     */
    static fromElement(elem: HTMLElement): string
    {
        return this.fromString(elem.outerHTML, "+tag");
    }

    /**
     * returns a <emoji> tag based on input string
     * 
     * @param {string} input input string
     * @param {string} flags parser flags
     * @returns {string} html <emoji> tag
     */
    static fromString(input: string, flags: string = "+any"): string
    {
        return this.get(this.getId(input, flags));
    }

    /**
     * returns the emoji id of input string
     * 
     * @param {string} input input string
     * @param {string} flags parser flags
     * @returns {string} html <emoji> tag
     */
    static getId(input: string, flags: string = "+any"): string
    {
        let mode: PMParserMode = PMParserMode.text;
        let flagz: string[] = flags.split(" ");
        let mflag: string|undefined = flagz.findLast(x => x.startsWith("+"));
        
        if(typeof mflag === "undefined")
        {
            mflag = "+any";
        }

        switch(mflag)
        {
            case "+text": mode = PMParserMode.text; break;
            case "+inline": mode = PMParserMode.inline; break;
            case "+tag": mode = PMParserMode.tag; break;
            case "+unicode": mode = PMParserMode.unicode; break;
            case "+any":
                if (/^\$emoji:[a-zA-Z0-9_+-]+:$/.test(input)) { mode = PMParserMode.inline; break; }
                if (/^<emoji\b[^>]*>.*<\/emoji>$/.test(input)) { mode = PMParserMode.tag; break; }
                if (/:[a-zA-Z0-9_+-]+:/.test(input)) { mode = PMParserMode.text; break; }
                if (new RegExp(Array.from(polymoji_unicode_lookup_table.keys()).sort((a, b) => b.length - a.length).map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")).join("|"), "u").test(input)) { mode = PMParserMode.unicode; break; }
                break;

            default: throw "polymoji: (err) " + " is not a valid parsing mode, use +any, +text, +inline, +tag, or +uniocde";
        }

        let name = "";

        switch(mode)
        {
            case PMParserMode.inline:
            {
                let m = input.match(/^\$emoji:([a-zA-Z0-9_+-]+):$/);
                if (m) 
                {
                    name = m[1]!;
                    break;
                }

                throw "polymoji: (err) '" + input + "' is a invalid +inline polymoji";
            }

            case PMParserMode.text:
            {
                let m = input.match(/^:([a-zA-Z0-9_+-]+):$/);
                if (m)
                {
                    name = m[1]!;
                    break;
                }

                throw "polymoji: (err) '" + input + "' is a invalid +text polymoji";
            }

            case PMParserMode.tag:
            {
                let id = input.match(/i="([^"]+)"/);
                if (id)
                {
                    return id[1]!;
                }

                let m = input.match(/name="([^"]+)"/);
                if (m) 
                {
                    name = m[1]!;
                    break;
                }
                    
                throw "polymoji: (err) '" + input + "' is a invalid +tag polymoji";                
            }

            case PMParserMode.unicode:
            {
                return polymoji_unicode_lookup_table.get(input) ?? "meta:control/char";
            }
        }

        const emoji = this.emoji_table.find((entry: PMEmoji) => entry.names.includes(name));
        return emoji ? emoji.id : "meta:control/char"
    }

    /**
     * returns a <emoji> tag from emoji id
     * 
     * @param {string} id id of the emoji
     */
    static get(id: string)
    {
        let emoji = this.emoji_table.find((entry: PMEmoji) => entry.id === id);
        if (!emoji) return "";
        return `<emoji i="${emoji.id}" role="img" aria-label="${emoji.label}" class="polymoji-emoji polymoji-emoji-${id.replace(":", "-").replace("/","-")}"></emoji>`;
    }

    /**
     * parses an entire string
     * 
     * @param {string} input input string
     * @param {string} flags parser flags
     * @returns {string} html <emoji> tag
     */
    public static parse(input: string, flags: string = "+any"): string
    {
        const flagz = flags.split(" ");
        const mflag = flagz.findLast(x => x.startsWith("+")) ?? "+any";

        const rx_inline = "\\$emoji:[a-zA-Z0-9_+-]+:";
        const rx_tag = "<emoji\\b[^>]*>.*?</emoji>";
        const rx_text = ":[a-zA-Z0-9_+-]+:";

        const keys = Array.from(polymoji_unicode_lookup_table.keys()).sort((a, b) => b.length - a.length).map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
        const rx_uni = keys.length > 0 ? keys.join("|") : "\\p{Extended_Pictographic}";

        let pattern = "";

        switch (mflag)
        {
            case "+inline":
            {
                pattern = rx_inline;
                break;
            }
            case "+tag":
            {
                pattern = rx_tag;
                break;
            }
            case "+text":
            {
                pattern = rx_text;
                break;
            }
            case "+unicode":
            {
                pattern = rx_uni;
                break;
            }
            case "+any":
            default:
            {
                pattern = `${rx_inline}|${rx_tag}|${rx_text}|${rx_uni}`;
                break;
            }
        }

        const reg = new RegExp(`(${pattern})`, "gu");

        return input.replace(reg, (match) =>
        {
            const id = this.getId(match, mflag);

            if (id !== "" && id !== "meta:control/char")
            {
                return this.get(id);
            }

            return match;
        });
    }

    /**
     * removes default IPolymojiFont rendering font
     */
    static unsetFont(): void
    {
        this.loaded_font = new IPolymojiFont();
        this.loaded_style1 = "/* polymoji autogenerated style */\n\n.polymoji-emoji\n{\n    height:1.5em;\n    width:1.5em;\n    background-position:center;\n    background-repeat:no-repeat;\n    background-size:contain;\n    display:inline-block;\n    vertical-align:middle;\n}\n";
        style_elem.innerHTML = this.loaded_style1 + this.loaded_style2;
    }

    /**
     * sets the IPolymojiFont rendering font
     * 
     * @param font the font
     */
    static setFont(font: IPolymojiFont): void
    {
        this.loaded_font = font;
        this.loaded_style1 = "/* polymoji autogenerated style */\n\n.polymoji-emoji\n{\n    height:1.5em;\n    width:1.5em;\n    background-position:center;\n    background-repeat:no-repeat;\n    background-size:contain;\n    display:inline-block;\n    vertical-align:middle;\n}\n";

        for(const emoji of this.emoji_table)
        {
            let glyph_src: string = font.getGlyph(emoji.id);
            if(glyph_src == "SKIP") { continue; }
            this.loaded_style1 += `\n.polymoji-emoji-${emoji.id.replace(":", "-").replace("/","-")} { background-image: url(${glyph_src}) }`;
        }

        style_elem.innerHTML = this.loaded_style1 + this.loaded_style2;
    }

    /**
     * adds a IPolymojiFont rendering font
     *
     * @param font the font
     */
    static addFont(font: IPolymojiFont, important: boolean = false): void
    {
        this.loaded_style2 += `/*font ${font.getFontName()}*/`

        for(const emoji of this.emoji_table)
        {
            let glyph_src: string = font.getGlyph(emoji.id);
            if(glyph_src == "SKIP") { continue; }
            this.loaded_style2 += `\n.pmfont-${font.getFontName()} .polymoji-emoji-${emoji.id.replace(":", "-").replace("/","-")} { background-image: url(${glyph_src}) ${important ? "!important " : ""}}`;
        }

        this.loaded_style2 += `/*end ${font.getFontName()}*/`

        style_elem.innerHTML = this.loaded_style1 + this.loaded_style2;
    }

     /**
     * removes a IPolymojiFont rendering font
     *
     * @param font the font
     */
    static removeFont(font: IPolymojiFont): void
    {  
        const pattern = new RegExp(`\\/\\*font ${font.getFontName().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\*\\/[\s\S]*?\\/\\*end ${font.getFontName().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\*\\/`, "g");
        this.loaded_style2 = this.loaded_style2.replace(pattern, "");

        style_elem.innerHTML = this.loaded_style1 + this.loaded_style2;
    }

    /**
     * adds an emoji to the emoji table
     * 
     * @param emoji custom emoji
     */
    static addEmoji(emoji: PMEmoji): void
    {
        if (!new RegExp('^([^\\s:/]+/)?[^\\s:/]+$').test(emoji.id)) return;

        let _emoji = {...emoji};
        _emoji.id = "etc:" + emoji.id;

        this.emoji_table.push(_emoji);
    }

    /**
     * adds emojis to the emoji table
     * 
     * @param emoji custom emoji
     */
    static addEmojis(emojis: PMEmoji[]): void
    {
        for (const emoji of emojis)
        {
            this.addEmoji(emoji);
        }
    }

    /**
     * converts the entire inner of the element to polymoji
     * 
     * @param {HTMLElement} elem element to parse
     */
    static convertInner(elem: HTMLElement): void
    {
        for(const emoj of elem.querySelectorAll("emoji"))
        {
            let frag = document.createRange().createContextualFragment(polymoji.fromString(emoj.outerHTML, "+tag"));
            emoj.replaceWith(frag);
        }

        const walker = document.createTreeWalker(elem, NodeFilter.SHOW_TEXT);
        const nodes: Text[] = [];

        while (walker.nextNode())
        {
            nodes.push(walker.currentNode as Text);
        }

        for (const node of nodes)
        {
            let text = node.textContent;
            if (!text) continue;

            let parsed = polymoji.parse(text);
            if (parsed === text) continue;

            let frag = document.createRange().createContextualFragment(parsed);
            node.replaceWith(frag);
        }
    }

    static render(): void
    {
        console.log("polymoji: auto-rendering select elements");
        
        let i: number = 0;
        for(const elem of document.body.querySelectorAll<HTMLElement>(".polymoji-replace"))
        {
            this.convertInner(elem);
            i++;
        }

        console.log(`polymoji: auto-rendered ${i.toString()} sections`)
    }
}

function polymoji_parse_page(): void
{
    polymoji.convertInner(document.body);
}

function polymoji_initialize(): void
{
    //please do not remove watermark :pray: please pls pls
    console.log("polymoji: initialized");

    document.head.appendChild(style_elem);
    
    if(typeof polymoji_config === "undefined" || polymoji_config.dontLoadFont === false)
    {
        polymoji.setFont(new DefaultFont());
    }
    polymoji.render();

    console.log("polymoji: initialized");
}

if (typeof polymoji_config === "undefined" || polymoji_config.disableAutoInit === false)
{
    polymoji_initialize();
}