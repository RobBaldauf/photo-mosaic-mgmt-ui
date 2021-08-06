"use strict";

const c = React.createElement;

export const MosaicBodyTextRow = (props) => {
  // A single text based item in the mosaic body
  return c(
    "li",
    { className: "list-group-item" },
    c("span", { className: "bold-text" }, `${props.text} `),
    c("span", {}, `${props.value}`)
  );
};

export const MosaicBody = (props) => {
  //The mosaic body displaying detailled info about the mosaic and including form components to interact with the mosaic
  return c(
    "div",
    { className: "card-body" },
    c(
      "ul",
      { className: "list-group list-group-flush" },
      c(MosaicBodyTextRow, { text: "Id:", value: props.id }),
      c(MosaicBodyTextRow, { text: "Active:", value: props.isActive }),
      c(MosaicBodyTextRow, { text: "Filled:", value: props.isFilled }),
      c(MosaicBodyTextRow, { text: "Original:", value: props.isOriginal }),
      c(MosaicBodyTextRow, {
        text: "Segm. left: ",
        value:
          props.brightSegments +
          " (bright), " +
          props.mediumSegments +
          " (medium), " +
          props.darkSegments +
          " (dark)",
      }),
      c(MosaicBodyTextRow, {
        text: "Background brightness:",
        value: props.mosaicBackgroundBrightness,
      }),
      c(MosaicBodyTextRow, {
        text: "Blend value: ",
        value:
          props.mosaicBlendValue +
          " (mosaic), " +
          props.segmentBlendValue +
          " (segment)",
      }),
      c(MosaicBodyTextRow, {
        text: "Blur radius: ",
        value:
          props.segmentBlurLow +
          " (bright), " +
          props.segmentBlurMedium +
          " (medium), " +
          props.segmentBlurHigh +
          " (dark)",
      }),
      c(
        "li",
        { className: "list-group-item" },
        c(
          ReactBootstrap.Button,
          { variant: "dark", onClick: props.editMosaic },
          "Edit"
        ),
        c(
          ReactBootstrap.Button,
          {
            variant: "dark",
            onClick: props.getSample,
            className: "small-space-left",
          },
          "Get filter sample"
        )
      )
    )
  );
};
