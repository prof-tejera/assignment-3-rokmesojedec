import React from "react";
import styled from "styled-components";
import DocumentComponent from "../components/documentation/DocumentComponent";
import Button from "../components/generic/Button/Button";
import DisplayTime from "../components/generic/DisplayTime/DisplayTime";
import Input from "../components/generic/Input/Input";
import MatIcon from "../components/generic/MatIcon";
import Panel from "../components/generic/Panel/Panel";
import ProgressBar from "../components/generic/ProgressBar/ProgressBar";
import ProgressCircle from "../components/generic/ProgressCircle/ProgressCircle";
import TimeComponent from "../components/generic/TimeComponent/TimeComponent";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

class Documentation extends React.Component {
  componentDidMount() {
    document.body.classList.add("white-bg");
  }
  componentWillUnmount() {
    document.body.classList.remove("white-bg");
  }
  render() {
    // Unpacks array into props used by propDocs prop of DocumentComponent
    // Order of props is important
    const unpack = (propsArray) => {
      const [prop, description, type, defaultValue] = propsArray;
      return { prop, description, type, defaultValue };
    }
    return (
      <Container>
        <div>
          <h1 className="text-center">Documentation</h1>
          <DocumentComponent
            title="<Button></Button>"
            component={<Button className="p-x-2 p-y-1" />}
            propDocs={[
              unpack(["disabled", "disables / enables button", "bool", "false"]),
              unpack(["className", "sets HTML class name", "string", "''"]),
              unpack(["tooltip", "adds on hover tooltip", "string", "null"]),
              unpack(["onClick", "on click method", "func", "() => { }"]),
            ]}
          />
          <DocumentComponent
            title="<DisplayTime />"
            component={<DisplayTime />}
            propDocs={[
              unpack(["timer", "Timer object", "Timer", "new Timer(0)"]),
              unpack(["className", "sets HTML class name", "string", "null"]),
              unpack(["readOnly", "enable user editing of values when set to true", "bool", "true"]),
              unpack(["triggerOnFinishedOnUnmount", "disabled or enabled triggering timer object onFinished event on component unmount", "bool", "true"]),
              unpack(["showComponents", "disable / enable individual time-components", "object", "{ hours: true, minutes: true, seconds: true, milliseconds: true }"])
            ]}
          />
          <DocumentComponent
            title="<Input />"
            component={<Input value={5} />}
            propDocs={[
              unpack(["type", "sets HTML input type", "string", "number"]),
              unpack(["value", "sets HTML value attribute", "string | number", "N/A"]),
              unpack(["disabled", "disables / enables input", "bool", "false"]),
              unpack(["min", "sets HTML min attribute", "number", "0"]),
              unpack(["max", "sets HTML max attribute", "number", "N/A"]),
              unpack(["onValueChange", "onChange handler function. Fires when input is changed", "func", "()=>{ }"])
            ]}
          />
          <DocumentComponent
            title="<Panel></Panel>"
            component={<Panel className="shadow-6 round">Hello Panel!</Panel>}
            propDocs={[
              unpack(["className", "sets HTML class name", "string", "null"])
            ]}
          />
          <DocumentComponent
            title="<ProgressCircle></ProgressCircle>"
            component={<ProgressCircle size="sm" progress={4534} className="text-center">Hello Circle!</ProgressCircle>}
            propDocs={[
              unpack(["progress", "sets progress amount", "number between 0 and 10000 where 10000 is 100%", "0"]),
              unpack(["className", "sets HTML class name", "string", "null"]),
              unpack(["thickness", "sets thickness of loader line", 'string one of "xs", "sm", "md", "lg", "xl", "xxl', "sm"]),
              unpack(["thickness", "sets size of circle", 'string one of "xs", "sm", "md", "lg", "xl", "xxl', "lg"])
            ]}
          />
          <DocumentComponent
            title="<ProgressBar />"
            component={<ProgressBar className="width-100px shadow-6" progress={54} />}
            propDocs={[
              unpack(["className", "sets HTML class name", "string", "null"]),
              unpack(["position", "sets absolute position to one side of parent container", "string one of 'bottom', 'top', 'left', 'right', null", "null"]),
              unpack(["progress", "sets progress amount", "number", "0"]),
              unpack(["background", "sets CSS class for background of the filler bar", "string", "gradient-primary-light-danger"])
            ]}
          />
          <DocumentComponent
            title="<TimeComponent />"
            component={<TimeComponent className="shadow-6 text-center" label="label" prependZero={true} value={1} />}
            propDocs={[
              unpack(["value", "sets value shown in time component", "number", "0"]),
              unpack(["prependZero", "prepends zero to value if value lower than 10 when in readonly mode", "bool", "false"]),
              unpack(["showColon", "adds ':' to the left of component", "bool", "false"]),
              unpack(["label", "adds label under the value", "string", "null"]),
              unpack(["readOnly", "when set to false, value can be changed by user", "bool", "true"]),
              unpack(["onValueChange", "function which is triggered when input value changes", "func", "()=>{}"])
            ]}
          />
          <DocumentComponent
            title="<MatIcon></MatIcon>"
            component={<MatIcon>computer</MatIcon>}
            propDocs={[
              unpack(["children", "add display material icon string into this component to display it", "string", "null"]),
            ]}
          />
        </div>
      </Container>
    );
  }
}

export default Documentation;
