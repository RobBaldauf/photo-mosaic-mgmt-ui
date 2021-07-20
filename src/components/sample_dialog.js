"use strict";

const c = React.createElement;

export const SampleDialog = (props) => {
  return c(
    "form",
    {},
    c(
      "div",
      { className: "form-row" },
      c(
        "div",
        { className: "form-group col-md-12" },
        c("label", { htmlFor: "sampleFile" }, "Sample file"),
        c(
          "div",
          { className: "custom-file" },
          c("input", {
            type: "file",
            id: "sampleFile",
            className: "custom-file-input",
            placeholder: "select image path...",
            onChange: props.updateSampleFile,
          }),
          c(
            "label",
            { className: "custom-file-label", htmlFor: "sampleFile" },
            `${props.sampleFileName}`
          )
        )
      )
    ),
    c(
      "div",
      { className: "form-row" },
      c("img", { className: "card-img-top", src: props.sampleImage })
    ),
    c(
      "div",
      {
        className: "form-row",
        hidden: props.sampleSegmentId === "" ? true : false,
      },
      c("span", { className: "bold-text" }, "Segment ID: "),
      c("span", {}, `${props.sampleSegmentId}`)
    )
  );
};

export default SampleDialog;
