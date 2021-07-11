"use strict";
import Mosaic from "./components/mosaic.js";
import Navbar from "./components/nav.js";
import { getMosaics } from "./components/api.js";

import { API_KEY } from "./config/config.js";

const c = React.createElement;

class App extends React.Component {
  //The main component of the app
  constructor(props) {
    super(props);
    this.state = {
      mosaics: [],
      apiKey: API_KEY,
      alertText: "",
    };
  }

  updateAPIKey = (event) => {
    //Update the API Key state
    this.setState({ apiKey: event.target.value });
  };

  refresh = () => {
    //Refresh the displayed mosaics
    getMosaics(
      (data) => {
        console.log("Successfully fetched mosaics!");
        this.setState({ mosaics: [] }, function () {
          this.setState({ mosaics: data.mosaic_list });
        });
      },
      (err) => {
        this.setAlertText(
          "Error while fetching mosaics (Check connection to backend): " + err
        );
      }
    );
  };

  setAlertText = (text) => {
    this.setState({ alertText: text });
  };

  customAlert = () => {
    return this.state.alertText !== ""
      ? c(
          ReactBootstrap.Alert,
          {
            dismissible: true,
            variant: "danger",
            onClose: () => {
              this.setAlertText("");
            },
          },
          `${this.state.alertText}`
        )
      : null;
  };

  render() {
    //Render the navbar and the mosaic container
    return c(
      "div",
      {},
      c(Navbar, {
        refresh: this.refresh,
        apiKey: this.state.apiKey,
        updateAPIKey: this.updateAPIKey,
        alert: this.setAlertText,
      }),
      this.customAlert(),
      c(
        "div",
        { className: "container-fluid" },
        c(
          "div",
          { className: "row" },
          this.state.mosaics
            .sort((a, b) => (a.index > b.index ? 1 : -1))
            .map((m, idx) => {
              return c(Mosaic, {
                id: m.id,
                idx: m.index,
                key: m.id,
                apiKey: this.state.apiKey,
                refresh: this.refresh,
                alert: this.setAlertText,
              });
            })
        )
      )
    );
  }
}

ReactDOM.render(c(App), document.getElementById("root"));
