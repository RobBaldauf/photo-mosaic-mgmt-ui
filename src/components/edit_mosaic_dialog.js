"use strict";
import { SpinnerButton } from "./utils.js";
const c = React.createElement;

export const EditMosaicDialog = (props) => {
  return c(
    "form",
    {},
    c(
      "div",
      { className: "form-row" },
      c(
        "div",
        { className: "form-group col-md-5" },
        c("img",
          {
            className: "sample-img",
            src: props.mosaicImgSrc,
            id: "edit-img"
          })
      ),
      c(
        "div",
        { className: "form-group col-md-7" },
        c(
          "div",
          {},
          c("label", { htmlFor: "segmentFile", className: "bold-text" }, "Fill Mosaic"),
          c(
            "div",
            {},
            "Add images to random segments of the mosaic"
          ),
          c(
            "div",
            { className: "custom-file small-space-top" },
            c("input", {
              type: "file",
              id: "segmentFile",
              className: "custom-file-input",
              placeholder: "select image path...",
              onChange: props.updateSegmentFile,
              multiple: true,
            }),
            c(
              "label",
              { className: "custom-file-label", htmlFor: "segmentFile" },
              `${props.segmentFileName}`
            )
          ),
          c(ReactBootstrap.Form.Check, {
            type: "checkbox",
            id: "quickFill",
            className: "small-space-top",
            checked: props.quickFill,
            onChange: props.toggleQuickFill,
            label: "Use quick fill (each image will fill 5 segments)",
          }),
          c(SpinnerButton, {
            variant: "dark",
            className: "small-space-top",
            onClick: props.fillSegments,
            disabled: props.segmentFileName === "",
            text: "Fill Segments",
            showSpinner: props.addingImage,
          }),
        ),
        c(
          "hr",
          { className: "separator large-space-top" },
        ),
        c(
          "div",
          {},

          c("span", { className: "bold-text" }, "Segment Details"),
          c(
            "div",
            {},
            c("div", {}, "ID: " + (props.selectedSegmentId ? props.selectedSegmentId : "Please select a segment!")),
            c("div", {}, "Brightness: " + (props.selectedSegmentBrightness ?  props.selectedSegmentBrightness : "")),
            c("div", {}, "Filled: " + (props.selectedSegmentFilled ?  props.selectedSegmentFilled : "")),
            c("div", {}, "Fillable: " + (props.selectedSegmentFillable ?  props.selectedSegmentFillable : "")),
          ),
          c(SpinnerButton, {
            variant: "dark",
            className: "small-space-top",
            onClick: props.resetSegment,
            disabled: props.selectedSegmentId === "" || props.addingImage,
            text: "Reset Segment",
            showSpinner: false,
          }),
        ),
        c(
          "hr",
          { className: "separator large-space-top" },
        ),
        c(
          "div",
          {},

          c("span", { className: "bold-text" }, "Danger Zone"),
          c(
            "div",
            {},
            "This will impact the entire mosaic permanently!"
          ),
          c(
            ReactBootstrap.Button,
            {
              variant: "danger",
              className: "float-right small-space-left",
              onClick: props.resetMosaic,
              disabled: props.addingImage,
            },
            "Reset Mosaic"
          ),
          c(
            ReactBootstrap.Button,
            {
              variant: "danger",
              className: "float-right small-space-left",
              onClick: props.deleteMosaic,
              disabled: props.addingImage,
            },
            "Delete Mosaic"
          ),
        ),
      )
    )
  );
};

export default EditMosaicDialog;
