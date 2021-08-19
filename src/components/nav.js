"use strict";
import { postMosaic } from "../api/api.js";
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
        ReactBootstrap.Button,
        {
          variant: "light",
          onClick: props.refresh        },
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
      mosaicFileName: "",
      mosaicFile: null,
      mosaicTitle:"",
      mosaicCreationModalVisible: false,
      refresh: props.refresh,
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

  updateMosaicTitle = (event) => {
    this.setState({ mosaicTitle: event.target.value });
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
      this.state.mosaicTitle,
      this.state.numSegments,
      this.state.mosaicBgBrightness,
      this.state.mosaicBlendValue,
      this.state.segmentBlendValue,
      this.state.segmentBlurLow,
      this.state.segmentBlurMedium,
      this.state.segmentBlurHigh,
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
          mosaicFileName: this.state.mosaicFileName,
          createMosaic: this.showMosaicCreationModal,
        })
      ),
      c(
        "a",
        { className: "navbar-brand navbar-right",},
        "Photo Mosaic Management UI"
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
            mosaicTitle:this.state.mosaicTitle,
            updateMosaicTitle: this.updateMosaicTitle,
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
