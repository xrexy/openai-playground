import { z } from "zod";
import { colors, themes, types } from "../../../utils/website_meta";
import { protectedProcedure, router } from "../trpc";

const response_format: "url" | "b64_json" = "url";

export const openaiRouter = router({
  generateImage: protectedProcedure
    .input(
      z.object({
        theme: z.enum(themes).array(),
        type: z.enum(types).array(),
        color: z.enum(colors).array(),
      })
    )
    .mutation(
      async ({ ctx: { openai, session }, input: { color, theme, type } }) => {
        const prompt =
          color.join(", ") +
          theme.join(", ") +
          type.join(", ") +
          ", web design, website, ui, ux, ui/ux";
        const res = await openai
          .createImage({
            prompt,
            size: "512x512",
            user: session.user.id,
            response_format,
          })
          .catch((err) => console.log(err));

        if (res && res.status === 200) {
          const finalResponse = res.data.data[0]?.[response_format];
          if (!finalResponse) return;

          const buffer = Buffer.from(finalResponse, "base64");
          console.log(buffer);

          return {
            [response_format]: finalResponse,
            buffer: JSON.stringify(buffer),
          };
        }

        return;
      }
    ),
});
