import React from "react";
import "./DocumentComponent.scss";

class DocumentComponent extends React.Component {
  render() {
    return (
      <div className=" table-wrapper shadow-6 rounded m-b-4 ">
        <h4 className="text-center">{this.props.title}</h4>
        <div className="">
          <div className="component-container m-r-2">{this.props.component}</div>
          <table className="sass-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Description</th>
                <th>Type</th>
                <th>Default value</th>
              </tr>
            </thead>
            <tbody>
              {this.props.propDocs.map((doc, index) => {
                return (
                  <tr key={index}>
                    <td>{doc.prop}</td>
                    <td>{doc.description}</td>
                    <td>{doc.type}</td>
                    <td className="code-font">
                      {doc.defaultValue}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default DocumentComponent;
