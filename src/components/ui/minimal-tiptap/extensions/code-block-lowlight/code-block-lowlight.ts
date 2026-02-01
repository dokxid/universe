import { CodeBlockLowlightOptions, CodeBlockLowlight as TiptapCodeBlockLowlight } from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"

export const CodeBlockLowlight = TiptapCodeBlockLowlight.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            lowlight: createLowlight(common),
            languageClassPrefix: 'language-',
            exitOnTripleEnter: true,
            exitOnArrowDown: true,
            defaultLanguage: null,
            HTMLAttributes: {
                class: "block-node",
            },
        } as CodeBlockLowlightOptions
    },
})

export default CodeBlockLowlight
