# Markdown Styled Articles Plan

## Decision

Keep the current `react-markdown` renderer and its component mappings in `MarkdownArticles`.

It already turns article Markdown into styled React components, including the custom fenced blocks used for diagrams and admonitions.

Do not build a custom Markdown parser while browser performance is acceptable.

## When to revisit

Measure article load and rendering performance if readers experience slow article display or if the Markdown parser becomes a significant part of the initial browser payload.

If parsing cost is the cause, first consider compiling Markdown during the site build with MDX or a Vite Markdown plugin.

Build-time compilation removes Markdown parsing from the browser, but adds compiler configuration and may require a plugin for the custom fenced blocks.

A custom parser and renderer remain an option only if the project needs Markdown behavior that the existing parser and build tools cannot support cleanly.

That option gives full control, but requires maintaining Markdown rules and edge cases ourselves.

## Why keep an established parser

Markdown rules depend on context: headings inside code fences are not headings, indentation determines whether content belongs to a list, and link references can be defined separately from where they are used.

A simple custom parser could misread these structures and would need ongoing fixes as article syntax grows.
