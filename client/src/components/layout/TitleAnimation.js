import React from "react";
import "../../style/Animation.scss";
const TitleAnimation = () => {
  return (
    <div className="title-animation">
      <h1 className="block-effect" style={{ "--td": "1.2s" }}>
        <div
          className="block-reveal"
          style={{ "--bc": "#fff", "--d": ".1s", fontSize: "64px" }}
        >
          LOKA
        </div>
        <div
          className="block-reveal"
          style={{ "--bc": "#fff", "--d": ".5s", fontSize: "32px" }}
        >
          Create your own locations
        </div>
      </h1>
    </div>
  );
};

export default TitleAnimation;
