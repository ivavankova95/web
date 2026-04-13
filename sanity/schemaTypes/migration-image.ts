import { defineField, defineType } from "sanity";

export const migrationImageSchema = defineType({
  name: "migrationImage",
  title: "Migration image placeholder",
  type: "object",
  fields: [
    defineField({ name: "alt", title: "Alt text", type: "string" }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({ name: "sourceUrl", title: "Source URL", type: "url" }),
    defineField({ name: "localPath", title: "Local snapshot path", type: "string" })
  ],
  preview: {
    select: {
      alt: "alt",
      caption: "caption",
      localPath: "localPath"
    },
    prepare({ alt, caption, localPath }) {
      const fileName = localPath ? localPath.split("/").pop() : undefined;
      return {
        title: alt || caption || fileName || "Migration image placeholder",
        subtitle: fileName ? `Snapshot: ${fileName}` : "Pending asset import"
      };
    }
  }
});
