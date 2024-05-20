import { SIZES } from "./sizes";

const customFonts = {
  "ProductSans-Black": require("../assets/fonts/ProductSans-Black.otf"),
  "ProductSans-Bold": require("../assets/fonts/ProductSans-Bold.ttf"),
  "ProductSans-Regular": require("../assets/fonts/ProductSans-Regular.ttf"),
};

export default customFonts;

export const FONTS = {
  large: {
    fontFamily: "ProductSans-Regular",
    fontSize: SIZES.large,
    lineHeight: 40,
  },
  small: {
    fontFamily: "ProductSans-Regular",
    fontSize: SIZES.small,
    lineHeight: 22,
  },
  h1: { fontFamily: "ProductSans-Bold", fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: "ProductSans-Bold", fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: "ProductSans-Bold", fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: "ProductSans-Bold", fontSize: SIZES.h4, lineHeight: 22 },
  h5: { fontFamily: "ProductSans-Bold", fontSize: SIZES.h5, lineHeight: 22 },
  h6: { fontFamily: "ProductSans-Bold", fontSize: SIZES.h6, lineHeight: 22 },
  body1: {
    fontFamily: "ProductSans-Regular",
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontFamily: "ProductSans-Regular",
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    fontFamily: "ProductSans-Regular",
    fontSize: SIZES.body3,
    lineHeight: 25,
  },
  body4: {
    fontFamily: "ProductSans-Regular",
    fontSize: SIZES.body4,
    lineHeight: 22,
  },
  body5: {
    fontFamily: "ProductSans-Regular",
    fontSize: SIZES.body5,
    lineHeight: 22,
  },
  body6: {
    fontFamily: "ProductSans-Regular",
    fontSize: SIZES.body6,
    lineHeight: 22,
  },
};
