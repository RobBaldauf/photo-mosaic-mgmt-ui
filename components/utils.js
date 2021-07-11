"use strict";
const c = React.createElement;

export const SpinnerButton = (props) => {
  // a simple configurable button + loading spinner
  return c(
    ReactBootstrap.Button,
    {
      variant: props.variant,
      disabled: props.disabled || props.showSpinner,
      onClick: props.onClick,
    },
    `${props.text}`,
    c("span", {
      className: "spinner-border spinner-border-sm",
      role: "status",
      hidden: props.showSpinner ? !props.showSpinner : true,
    })
  );
};

export const InputLabelText = (props) => {
  // Label + text input
  return c(
    "div",
    { className: "form-group " + props.extraClasses },
    c("label", { htmlFor: props.id }, props.text),
    c("input", {
      type: "text",
      id: props.id,
      className: "form-control",
      value: props.value,
      onChange: props.onChange,
    })
  );
};

export const InputLabelRange = (props) => {
  // Range + text input
  return [
    c(
      "div",
      { className: "form-group col-md-3", key: props.id + "Key" },
      c("label", { htmlFor: props.id }, props.text),
      c("input", {
        type: "range",
        min: props.min,
        max: props.max,
        step: props.step,
        defaultValue: props.defaultValue,
        id: props.id,
        className: "form-control-range",
        onChange: props.onChange,
      })
    ),
    c(
      "div",
      { className: "form-group col-md-3", key: props.id + "Key2" },
      c(
        "label",
        { htmlFor: props.id + "Text", className: "light-label" },
        props.text2
      ),
      c("input", {
        type: "text",
        id: props.id + "Text",
        className: "form-control-plaintext",
        value: props.value,
        disabled: true,
      })
    ),
  ];
};
