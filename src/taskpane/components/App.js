import * as React from "react";
import PropTypes from "prop-types";
import { DefaultButton } from "@fluentui/react";
import Header from "./Header";
import HeroList from "./HeroList";
import Progress from "./Progress";

/* global console, Office, require */

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
    };
  }

  componentDidMount() {
    this.setState({
      listItems: [
        {
          icon: "Ribbon",
          primaryText: "Achieve more with Office integration",
        },
        {
          icon: "Unlock",
          primaryText: "Unlock features and functionality",
        },
        {
          icon: "Design",
          primaryText: "Create and visualize like a pro",
        },
      ],
    });
  }

  click = async () => {
    /**
     * Insert your PowerPoint code here
     */
    Office.context.document.setSelectedDataAsync(
      "Hello World!",
      {
        coercionType: Office.CoercionType.Text,
      },
      (result) => {
        if (result.status === Office.AsyncResultStatus.Failed) {
          console.error(result.error.message);
        }
      }
    );
  };

  getSlideData = async () => {
    let id = 0;
    Office.context.document.getSelectedDataAsync(Office.CoercionType.SlideRange, function (result) {
      if (result.status == Office.AsyncResultStatus.Succeeded) {
        id = result.value.slides[0].id;
        console.log(id);
      } else {
        console.log(result.error);
      }
    });

    return id;
  };

  addText = async (text = "") => {
    Office.context.document.setSelectedDataAsync(text, { coercionType: Office.CoercionType.Text }, function (result) {
      if (result.status === Office.AsyncResultStatus.Failed) {
        console.error(result.error.message);
      }
    });
  };

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo={require("./../../../assets/logo-filled.png")}
          message="Please sideload your addin to see app body."
        />
      );
    }

    return (
      <div className="ms-welcome">
        <Header logo={require("./../../../assets/logo-filled.png")} title={this.props.title} message="Welcome" />
        <HeroList message="Discover what Office Add-ins can do for you today!" items={this.state.listItems}>
          <p className="ms-font-l">
            Modify the source files, then click <b>Run</b>.
          </p>
          <DefaultButton
            className="ms-welcome__action"
            iconProps={{ iconName: "ChevronRight" }}
            onClick={() =>
              this.getSlideData().then((id) => {
                this.addText(id.toString());
              })
            }
          >
            Run
          </DefaultButton>
        </HeroList>
      </div>
    );
  }
}

App.propTypes = {
  title: PropTypes.string,
  isOfficeInitialized: PropTypes.bool,
};
