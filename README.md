# AI Cat Image Generator

A Next.js application that uses AI to transform natural language requests into cat images using the CATAAS (Cat as a Service) API. The application leverages LLM-powered tool calling to interpret user requests and convert them into appropriate API parameters.

## Features

- Natural language processing for cat image requests
- Real-time image generation based on user prompts
- Support for filters (blur, mono, negate)
- Text overlay capabilities with customizable colors
- Image downloading functionality
- Responsive design with mobile support

## How It Works

The application uses a Language Model to interpret user requests and transform them into specific API parameters. For example:

- "Show me a happy orange cat" → Retrieves images with tags: ["happy", "orange"]
- "Angry cat saying Hello in red text" → Adds text overlay with specified color
- "Black and white sleeping cat" → Applies monochrome filter

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- TanStack Query
- Tailwind CSS
- shadcn/ui
- LangChain
- Groq LLM

## API Integration

The project integrates with [CATAAS (Cat as a Service)](https://cataas.com), which provides the actual cat images. The AI component acts as an intelligent middleware that translates natural language into API parameters.
