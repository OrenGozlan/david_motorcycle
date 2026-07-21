import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero title", type: "localizedString" }),
    defineField({ name: "heroSubtitle", title: "Hero subtitle", type: "localizedText" }),
    defineField({ name: "heroImage", title: "Hero image", type: "image", options: { hotspot: true } }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp (digits, e.g. 972547761717)", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
    defineField({ name: "hours", title: "Opening hours", type: "string" }),
    defineField({
      name: "locations",
      title: "Locations",
      type: "array",
      of: [{ type: "localizedString" }],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
