"use strict";
import { SpinnerButton } from "./utils.js";
import { postMosaic } from "./api.js";
import MosaicCreationDialog from "./mosaic_creation_dialog.js";
const c = React.createElement;

const Controls = (props) => {
  // components of the navbar for creating a new mosaic
  return c(
    "div",
    { className: "form-row align-items-center" },
    c(
      "div",
      { className: "col-auto" },
      c(
        "div",
        { className: "input-group" },
        c(
          "div",
          { className: "input-group-prepend" },
          c("div", { className: "input-group-text" }, "API-Key:")
        ),
        c("input", {
          type: "password",
          id: "apiKey",
          className: "form-control",
          value: props.apiKey,
          onChange: props.updateAPIKey,
        })
      )
    ),
    c(
      "div",
      { className: "col-auto" },
      c(
        ReactBootstrap.Button,
        {
          variant: "light",
          onClick: props.refresh,
          disabled: props.apiKey === "",
        },
        "Refresh"
      )
    ),
    c(
      "div",
      { className: "col-auto" },
      c(
        ReactBootstrap.Button,
        { variant: "light", onClick: props.createMosaic },
        "Add Mosaic"
      )
    )
  );
};

class Navbar extends React.Component {
  // The navigation bar
  constructor(props) {
    super(props);
    this.state = {
      numSegments: 300,
      mosaicBgBrightness: 0.25,
      mosaicBlendValue: 0.25,
      segmentBlendValue: 0.4,
      segmentBlurLow: 2,
      segmentBlurMedium: 3,
      segmentBlurHigh: 4,
      apiKey: props.apiKey,
      mosaicFileName: "",
      mosaicFile: null,
      mosaicCreationModalVisible: false,
      refresh: props.refresh,
      updateAPIKey: props.updateAPIKey,
      alert: props.alert,
    };
  }

  updateMosaicFile = (event) => {
    //Update the mosaic filename parameter that is used for uploading new moasics
    this.setState({
      mosaicFile: event.target.files[0],
      mosaicFileName: event.target.value,
    });
  };

  updateNumSegments = (event) => {
    this.setState({ numSegments: event.target.value });
  };

  updateMosaicBlendValue = (event) => {
    this.setState({ mosaicBlendValue: event.target.value });
  };

  updateMosaicBgBrightness = (event) => {
    this.setState({ mosaicBgBrightness: event.target.value });
  };

  updateSegmentBlendValue = (event) => {
    this.setState({ segmentBlendValue: event.target.value });
  };

  updateSegmentBlurLow = (event) => {
    this.setState({ segmentBlurLow: event.target.value });
  };

  updateSegmentBlurMedium = (event) => {
    this.setState({ segmentBlurMedium: event.target.value });
  };

  updateSegmentBlurHigh = (event) => {
    this.setState({ segmentBlurHigh: event.target.value });
  };

  showMosaicCreationModal = (event) => {
    this.setState({
      mosaicCreationModalVisible: true,
    });
  };

  closeMosaicCreationModal = (event) => {
    this.setState({
      mosaicCreationModalVisible: false,
    });
  };

  createMosaic = () => {
    postMosaic(
      this.state.mosaicFile,
      this.state.numSegments,
      this.state.mosaicBgBrightness,
      this.state.mosaicBlendValue,
      this.state.segmentBlendValue,
      this.state.segmentBlurLow,
      this.state.segmentBlurMedium,
      this.state.segmentBlurHigh,
      this.state.apiKey,
      () => {
        this.setState(
          {
            mosaicFile: null,
            mosaicFileName: "",
          },
          () => {
            this.closeMosaicCreationModal();
            this.state.refresh();
          }
        );
      },
      (err) => {
        this.state.alert(
          "Error while creating mosaic (Check connection to backend): " + err
        );
        this.closeMosaicCreationModal();
      }
    );
  };

  render() {
    return c(
      "nav",
      { className: "navbar navbar-dark bg-dark" },
      c(
        "div",
        { className: "form-inline" },
        c(Controls, {
          refresh: this.state.refresh,
          apiKey: this.state.apiKey,
          updateAPIKey: this.state.updateAPIKey,
          numSegments: this.state.numSegments,
          mosaicFileName: this.state.mosaicFileName,
          updateNumSegments: this.updateNumSegments,
          createMosaic: this.showMosaicCreationModal,
        })
      ),
      c(
        ReactBootstrap.Modal,
        {
          show: this.state.mosaicCreationModalVisible,
          size: "lg",
        },
        c(
          ReactBootstrap.Modal.Header,
          {},
          c(ReactBootstrap.Modal.Title, {}, "Create Mosaic...")
        ),
        c(
          ReactBootstrap.Modal.Body,
          {},
          c(MosaicCreationDialog, {
            numSegments: this.state.numSegments,
            updateNumSegments: this.updateNumSegments,
            mosaicFileName: this.state.mosaicFileName,
            updateMosaicFile: this.updateMosaicFile,
            mosaicBlendValue: this.state.mosaicBlendValue,
            updateMosaicBlendValue: this.updateMosaicBlendValue,
            mosaicBgBrightness: this.state.mosaicBgBrightness,
            updateMosaicBgBrightness: this.updateMosaicBgBrightness,
            segmentBlendValue: this.state.segmentBlendValue,
            updateSegmentBlendValue: this.updateSegmentBlendValue,
            segmentBlurLow: this.state.segmentBlurLow,
            updateSegmentBlurLow: this.updateSegmentBlurLow,
            segmentBlurMedium: this.state.segmentBlurMedium,
            updateSegmentBlurMedium: this.updateSegmentBlurMedium,
            segmentBlurHigh: this.state.segmentBlurHigh,
            updateSegmentBlurHigh: this.updateSegmentBlurHigh,
          })
        ),
        c(
          ReactBootstrap.Modal.Footer,
          {},
          c(
            ReactBootstrap.Button,
            { variant: "secondary", onClick: this.closeMosaicCreationModal },
            "Close"
          ),
          c(
            ReactBootstrap.Button,
            { variant: "primary", onClick: this.createMosaic },
            "Create"
          )
        )
      )
    );
  }
}

export default Navbar;
