import { createSystem, defaultBaseConfig, defineConfig } from "@chakra-ui/react";
import {
  animationStyles,
  avatarSlotRecipe,
  breakpoints,
  buttonRecipe,
  cardSlotRecipe,
  comboboxSlotRecipe,
  fieldSlotRecipe,
  globalCss,
  headingRecipe,
  iconRecipe,
  inputRecipe,
  keyframes,
  layerStyles,
  linkRecipe,
  semanticTokens,
  separatorRecipe,
  skeletonRecipe,
  spinnerRecipe,
  textStyles,
  toastSlotRecipe,
  tokens,
} from "@chakra-ui/react/theme";

// Same as Chakra's defaultSystem, but with only the recipes this app renders,
// which keeps ~60 unused component styles out of the main bundle.
// Add a component's recipe here when you start using it.
const config = defineConfig({
  preflight: true,
  cssVarsPrefix: "chakra",
  cssVarsRoot: ":where(html, .chakra-theme)",
  globalCss,
  theme: {
    breakpoints,
    keyframes,
    tokens,
    semanticTokens,
    textStyles,
    layerStyles,
    animationStyles,
    recipes: {
      button: buttonRecipe,
      heading: headingRecipe,
      icon: iconRecipe,
      input: inputRecipe,
      link: linkRecipe,
      separator: separatorRecipe,
      skeleton: skeletonRecipe,
      spinner: spinnerRecipe,
    },
    slotRecipes: {
      avatar: avatarSlotRecipe,
      card: cardSlotRecipe,
      combobox: comboboxSlotRecipe,
      field: fieldSlotRecipe,
      toast: toastSlotRecipe,
    },
  },
});

export const system = createSystem(defaultBaseConfig, config);
