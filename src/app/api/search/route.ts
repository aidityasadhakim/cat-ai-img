import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { NextResponse } from "next/server";

interface CustomFilter {
  brightness?: number;
  lightness?: number;
  saturation?: number;
  hue?: number;
  red?: number;
  green?: number;
  blue?: number;
}

interface GetCatImageParams {
  tags?: string[];
  text?: string;
  preset: {
    filter?: "blur" | "mono" | "negate" | "custom";
    customFilter?: CustomFilter;
    fontSize?: number;
    fontColor?: string;
    width?: number;
    height?: number;
  };
}

const getCatImage = tool(
  async ({ tags, text, preset }: GetCatImageParams) => {
    let url = "https://cataas.com/cat";

    // Add tags if present
    if (tags && tags.length > 0) {
      url += `/${tags.join(",")}`;
    }

    // Add text if present
    if (text) {
      url += `/says/${encodeURIComponent(text)}`;
    }

    // Add styling parameters
    const params = new URLSearchParams();

    // Handle basic and custom filters
    if (preset.filter) {
      params.append("filter", preset.filter);

      // Add custom filter parameters if filter is 'custom'
      if (preset.filter === "custom" && preset.customFilter) {
        const { brightness, lightness, saturation, hue, red, green, blue } =
          preset.customFilter;

        // RGB filter parameters
        if (red !== undefined || green !== undefined || blue !== undefined) {
          if (red !== undefined) params.append("r", red.toString());
          if (green !== undefined) params.append("g", green.toString());
          if (blue !== undefined) params.append("b", blue.toString());
        }
        // HSL filter parameters
        else {
          if (brightness !== undefined)
            params.append("brightness", brightness.toString());
          if (lightness !== undefined)
            params.append("lightness", lightness.toString());
          if (saturation !== undefined)
            params.append("saturation", saturation.toString());
          if (hue !== undefined) params.append("hue", hue.toString());
        }
      }
    }

    // Add size parameters
    if (preset.width) {
      params.append("width", preset.width.toString());
    }
    if (preset.height) {
      params.append("height", preset.height.toString());
    }

    // Add text styling
    if (preset.fontSize) {
      params.append("fontSize", preset.fontSize.toString());
    }
    if (preset.fontColor) {
      params.append("fontColor", preset.fontColor.replace("#", ""));
    }

    params.append("json", "true");

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    console.log(url);

    // Validate the URL by making a HEAD request
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to generate cat image");
      }
      return response.json();
    } catch (error) {
      console.error("Error validating cat image URL:", error);
      throw new Error("Failed to generate cat image");
    }
  },
  {
    name: "getCatImage",
    description:
      "Generate a cat image URL based on tags, text, and styling preferences",
    schema: z.object({
      tags: z
        .array(z.string())
        .optional()
        .default([])
        .describe(
          "Optional array of tags to filter cat images (e.g., ['cute', 'sleeping'])"
        ),
      text: z
        .string()
        .optional()
        .describe("Optional text to overlay on the cat image"),
      preset: z
        .object({
          filter: z
            .enum(["blur", "mono", "negate", "custom"])
            .optional()
            .describe(
              "Optional image filter effect to apply: blur, monochrome, negative, or custom"
            ),
          customFilter: z
            .object({
              brightness: z
                .number()
                .min(0)
                .max(100)
                .optional()
                .describe("Adjust image brightness (0-100)"),
              lightness: z
                .number()
                .min(0)
                .max(100)
                .optional()
                .describe("Adjust image lightness in HSL (0-100)"),
              saturation: z
                .number()
                .min(0)
                .max(100)
                .optional()
                .describe("Adjust color saturation in HSL (0-100)"),
              hue: z
                .number()
                .min(0)
                .max(360)
                .optional()
                .describe("Adjust color hue in HSL (0-360 degrees)"),
              red: z
                .number()
                .min(0)
                .max(255)
                .optional()
                .describe("Adjust red channel intensity (0-255)"),
              green: z
                .number()
                .min(0)
                .max(255)
                .optional()
                .describe("Adjust green channel intensity (0-255)"),
              blue: z
                .number()
                .min(0)
                .max(255)
                .optional()
                .describe("Adjust blue channel intensity (0-255)"),
            })
            .optional()
            .describe("Custom filter settings when filter is set to 'custom'"),
          fontSize: z
            .number()
            .optional()
            .describe("Font size in pixels for the overlaid text"),
          fontColor: z
            .string()
            .optional()
            .describe("Color of the overlaid text (hex code or color name)"),
          width: z
            .number()
            .optional()
            .default(500)
            .describe("Desired width of the output image in pixels"),
          height: z
            .number()
            .optional()
            .default(500)
            .describe("Desired height of the output image in pixels"),
        })
        .optional()
        .default({})
        .describe("Optional preset configuration for image styling"),
    }),
  }
);

const getNotFoundCatImage = async () => {
  const response = await fetch(
    "https://cataas.com/cat/sad/says/No%20Image%20Found%20:(?json=true"
  );
  const data = await response.json();
  return data.url;
};

const requestSchema = z.object({
  prompt: z.string(),
});

const tools = [getCatImage];
const toolNode = new ToolNode(tools);

// Top 100 most common cat tags (based on frequency and relevance)
const COMMON_CAT_TAGS = [
  "cat",
  "cute",
  "black",
  "white",
  "orange",
  "sleeping",
  "kitten",
  "funny",
  "grumpy",
  "happy",
  "fluffy",
  "tabby",
  "grey",
  "gray",
  "maine coon",
  "siamese",
  "persian",
  "british",
  "bengal",
  "ragdoll",
  "tuxedo",
  "calico",
  "tortoiseshell",
  "scottish fold",
  "russian blue",
  "sphynx",
  "norwegian forest cat",
  "angry",
  "sad",
  "tired",
  "playful",
  "lazy",
  "sleepy",
  "relaxed",
  "scared",
  "surprised",
  "curious",
  "silly",
  "serious",
  "fat",
  "big",
  "small",
  "long hair",
  "short hair",
  "eyes",
  "blue eyes",
  "green eyes",
  "yellow eyes",
  "paws",
  "tail",
  "whiskers",
  "ears",
  "nose",
  "face",
  "belly",
  "sitting",
  "standing",
  "lying",
  "stretching",
  "jumping",
  "running",
  "walking",
  "eating",
  "drinking",
  "playing",
  "hunting",
  "hiding",
  "sleeping",
  "yawning",
  "meowing",
  "purring",
  "hissing",
  "scratching",
  "grooming",
  "cuddling",
  "box",
  "bed",
  "chair",
  "window",
  "door",
  "table",
  "floor",
  "grass",
  "tree",
  "garden",
  "house",
  "room",
  "kitchen",
  "bathroom",
  "outdoor",
  "indoor",
  "day",
  "night",
  "summer",
  "winter",
  "spring",
  "fall",
  "christmas",
  "halloween",
  "holiday",
  "birthday",
  "party",
  "friend",
  "family",
  "love",
  "cute",
  "beautiful",
  "adorable",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = requestSchema.parse(body);

    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY!,
      model: "llama-3.1-8b-instant",
    }).bindTools(tools);

    const systemPrompt = `You are a helpful assistant that generates cat images based on user requests. Your task is to use the getCatImage tool appropriately.

IMPORTANT: Only use the parameters that are specifically requested by the user. Do not add additional parameters unless explicitly asked.

Common cat tags and characteristics you can use:
${COMMON_CAT_TAGS.map((tag) => `- ${tag}`).join("\n")}

Examples:
User: "Show me a cute cat"
Assistant: I'll use getCatImage with the tag "cute"
Tool call: { "tags": ["cute"], "preset": {} }

User: "Show me a cat saying hello in red text"
Assistant: I'll generate a cat image with "hello" text in red
Tool call: { "text": "hello", "preset": { "fontColor": "#FF0000" } }

User: "Show me a black and white cat photo"
Assistant: I'll generate a monochrome cat image
Tool call: { "preset": { "filter": "mono" } }

Now, please process this request: ${prompt}`;

    const response = await toolNode.invoke({
      messages: [await model.invoke(systemPrompt)],
    });
    console.log(response);
    const parsedContent = JSON.parse(response.messages[0].content);

    return NextResponse.json({ url: parsedContent.url });
  } catch (error) {
    console.error("Error processing request:", error);
    const notFoundCatImage = await getNotFoundCatImage();
    return NextResponse.json(
      {
        url: notFoundCatImage,
      },
      { status: 200 }
    );
  }
}
