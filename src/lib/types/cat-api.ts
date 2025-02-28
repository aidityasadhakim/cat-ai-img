export interface CatApiResponse {
  url: string;
}

export interface StylePreset {
  name: string;
  config: {
    filter?: "blur" | "mono" | "negate";
    fontSize?: number;
    fontColor?: string;
    width?: number;
    height?: number;
  };
}

export const STYLE_PRESETS: Record<string, StylePreset> = {
  classic: {
    name: "Classic",
    config: {},
  },
  vintage: {
    name: "Vintage",
    config: {
      filter: "mono",
      fontSize: 50,
      fontColor: "#ffffff",
    },
  },
  artistic: {
    name: "Artistic",
    config: {
      filter: "blur",
      fontSize: 60,
      fontColor: "#ff0000",
    },
  },
};
