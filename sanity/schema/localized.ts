import { defineType, defineField } from "sanity";

// he / en / ru single-line string. Hebrew is the source language.
export const localizedString = defineType({
  name: "localizedString",
  title: "Text (he / en / ru)",
  type: "object",
  fields: [
    defineField({ name: "he", title: "עברית", type: "string" }),
    defineField({ name: "en", title: "English", type: "string" }),
    defineField({ name: "ru", title: "Русский", type: "string" }),
  ],
});

// he / en / ru multi-line text.
export const localizedText = defineType({
  name: "localizedText",
  title: "Long text (he / en / ru)",
  type: "object",
  fields: [
    defineField({ name: "he", title: "עברית", type: "text", rows: 4 }),
    defineField({ name: "en", title: "English", type: "text", rows: 4 }),
    defineField({ name: "ru", title: "Русский", type: "text", rows: 4 }),
  ],
});
