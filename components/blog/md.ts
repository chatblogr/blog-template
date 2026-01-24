import markdownit from "markdown-it";
import hljs from 'highlight.js'

export const md = markdownit({
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch {}
    }

    return ""; // use external default escaping
  },
});