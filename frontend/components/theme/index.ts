import { defaultTheme } from "./default";
import { onepieceTheme } from "./onepiece";
import { narutoTheme } from "./naruto";
import { dbzTheme } from "./dbz";
import { aotTheme } from "./aot";
import { demonslayerTheme } from "./demonslayer";
import { jujutsukaisenTheme } from "./jujutsukaisen";
import { MangaTheme } from "./types";

export * from "./types";
export * from "./default";
export * from "./onepiece";
export * from "./naruto";
export * from "./dbz";
export * from "./aot";
export * from "./demonslayer";
export * from "./jujutsukaisen";

export const MANGA_THEMES: MangaTheme[] = [
  defaultTheme,
  onepieceTheme,
  narutoTheme,
  dbzTheme,
  aotTheme,
  demonslayerTheme,
  jujutsukaisenTheme,
];
