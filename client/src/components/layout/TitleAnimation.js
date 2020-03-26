import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import "../../style/Animation.scss";
const TitleAnimation = () => {
  const [change, setChange] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setChange(true);
    }, 3000);
  }, []);
  if (change) return <Redirect to="/map" />;
  return (
    <Link to="/map" className="title-animation">
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
          Share your Maps
        </div>
      </h1>
    </Link>
  );
};

export default TitleAnimation;
