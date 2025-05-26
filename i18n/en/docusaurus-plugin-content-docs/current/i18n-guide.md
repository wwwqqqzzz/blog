---
title: Internationalization Guide
description: How to add multilingual support to the blog
sidebar_position: 1
---

# Blog Internationalization Guide

## Overview

This blog uses Docusaurus's i18n feature to support multiple languages. Currently supported:
- Chinese (zh-CN, default language)
- English (en)

## How to Add Translated Content

### 1. Translating Blog Posts

Blog post translations should be placed in the corresponding `i18n/{locale}/docusaurus-plugin-content-blog/` directory, maintaining the same directory structure as the original posts.

For example, if there is a Chinese article located at `blog/tech/example.md`, its English translation should be placed at `i18n/en/docusaurus-plugin-content-blog/tech/example.md`.

**Note**: Translation files should keep the original filename unchanged, even if it's in Chinese.

### 2. Translating Page Content

Page content translations should be placed in the `i18n/{locale}/docusaurus-plugin-content-pages/` directory.

### 3. Translating Documentation

Documentation translations should be placed in the `i18n/{locale}/docusaurus-plugin-content-docs/` directory.

### 4. Translating UI Elements

Theme and UI element translations are located in the `i18n/{locale}/docusaurus-theme-classic/` directory.

## Batch Translation Workflow

### Using Translation Tools

You can use the following tools to assist with translation:
1. Docusaurus's built-in translation command: `npm run write-translations`
2. Online translation services such as Google Translate, DeepL, etc.
3. AI tools like ChatGPT for initial translation, then manual correction

### Translating Theme Labels

Use the command to generate translatable theme JSON files:

```bash
npm run write-translations -- --locale en
```

Then edit the `i18n/en/code.json` file.

## Testing Translations

Start the development server for a specific language:

```bash
npm run start -- --locale en
```

Or use the configured script:

```bash
npm run start:en
```

## Submitting Translations

1. Ensure translation content has no grammatical errors
2. Maintain consistent formatting between original and translated text
3. Be careful to preserve Markdown markup and links from the original text

## Notes

1. Keep filenames unchanged, no need to translate them
2. Maintain the original metadata (frontmatter) structure, only translate the content
3. Image paths usually don't need to be changed, unless you provide language-specific images

---

If you have any questions, please contact the blog administrator. 