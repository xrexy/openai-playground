import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

const response_format: "url" | "b64_json" = "url";

export const openaiRouter = router({
  generateImage: protectedProcedure
    .input(z.object({ prompt: z.string() }))
    .query(async ({ ctx: { openai, session }, input: { prompt } }) => {
      const res = await openai
        .createImage({
          prompt: prompt + " web design, website, ui, ux, ui/ux",
          size: "256x256",
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
    }),
});
