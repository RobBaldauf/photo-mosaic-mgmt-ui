"use strict";

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
        { className: "form-group col-md-12" },
        c("label", { htmlFor: "segmentFile" }, "Fill segments with images"),
        c(
          "div",
          { className: "custom-file" },
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
        })
      )
    )
  );
};

export default EditMosaicDialog;
