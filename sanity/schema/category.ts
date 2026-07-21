import { defineType, defineField } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Sort order", type: "number" }),
    defineField({
      name: "image",
      title: "Category image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "title.he", subtitle: "title.en", media: "image" },
  },
});
