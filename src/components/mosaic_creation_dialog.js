"use strict";

import { InputLabelText, InputLabelRange } from "./utils.js";

const c = React.createElement;

export const MosaicCreationDialog = (props) => {
  return c(
    "form",
    {},
    c(
      "div",
      { className: "form-row" },
      c(
        "div",
        { className: "form-group col-md-12" },
        c("label", { htmlFor: "mosaicFile" }, "Mosaic file"),
        c(
          "div",
          { className: "custom-file" },
          c("input", {
            type: "file",
            id: "mosaicFile",
            className: "custom-file-input",
            placeholder: "select image path...",
            onChange: props.updateMosaicFile,
          }),
          c(
            "label",
            { className: "custom-file-label", htmlFor: "mosaicFile" },
            `${props.mosaicFileName}`
          )
        )
      )
    ),
    c(
      "div",
      { className: "form-row" },
      c(InputLabelRange, {
        id: "mosaicBlendRange",
        min: "0",
        max: "1",
        step: "0.01",
        defaultValue: props.mosaicBlendValue,
        value:
          props.mosaicBlendValue +
          " : " +
          Math.round((1 - props.mosaicBlendValue) * 100) / 100,
        onChange: props.updateMosaicBlendValue,
        text: "Mosaic blend",
        text2: "(Image : Filter)",
      }),
      c(InputLabelRange, {
        id: "bgBrightness",
        min: "0.01",
        max: "1",
        step: "0.01",
        defaultValue: props.mosaicBgBrightness,
        value: props.mosaicBgBrightness,
        onChange: props.updateMosaicBgBrightness,
        text: "Background brightness",
        text2: "(relative)",
      })
    ),
    c(
      "div",
      { className: "form-row" },
      c(InputLabelText, {
        id: "numSegments",
        text: "Number of Segments",
        value: props.numSegments,
        onChange: props.updateNumSegments,
        extraClasses: "col-md-12",
      })
    ),
    c(
      "div",
      { className: "form-row" },
      c(InputLabelRange, {
        id: "segmentBlendRange",
        min: "0",
        max: "1",
        step: "0.01",
        defaultValue: props.segmentBlendValue,
        value:
          props.segmentBlendValue +
          " : " +
          Math.round((1 - props.segmentBlendValue) * 100) / 100,
        onChange: props.updateSegmentBlendValue,
        text: "Segment blend",
        text2: "(Image : Filter)",
      }),
      c(InputLabelRange, {
        id: "segmentBlurLow",
        min: "0",
        max: "5",
        step: "0.5",
        defaultValue: props.segmentBlurLow,
        value: props.segmentBlurLow,
        onChange: props.updateSegmentBlurLow,
        text: "Segment blur",
        text2: "(low brightness)",
      }),
      c(InputLabelRange, {
        id: "segmentBlurMedium",
        min: "0",
        max: "5",
        step: "0.5",
        defaultValue: props.segmentBlurMedium,
        value: props.segmentBlurMedium,
        onChange: props.updateSegmentBlurMedium,
        text: "Segment blur",
        text2: "(medium brightness)",
      }),
      c(InputLabelRange, {
        id: "segmentBlurHigh",
        min: "0",
        max: "5",
        step: "0.5",
        defaultValue: props.segmentBlurHigh,
        value: props.segmentBlurHigh,
        onChange: props.updateSegmentBlurHigh,
        text: "Segment blur",
        text2: "(high brightness)",
      })
    )
  );
};

export default MosaicCreationDialog;
