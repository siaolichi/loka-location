import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import Button from "@material/react-button";
import TextField, { Input, HelperText } from "@material/react-text-field";
import CardGrid from "../elements/CardGrid";
import Spinner from "./Spinner";

const MyLoka = ({
  isAuthenticated,
  profile: {
    loading,
    profile
  }
}) => {
  const { groups } = profile
  const [modal, setModal] = useState({
    openPublic: false,
    openPrivate: false,
    choices: ["Berlin Wi-Fi Cafe", "Berlin Twainese Restaurant"],
    selectedIndex: [],
    action: "",
    newGroupInput: "",
    newGroupCode: "",
    selectedChoice: [],
    otherChoice: []
  });
  useEffect(() => {
    initGroup();
  }, [groups]);
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Redirect to="/login" />;
  const initGroup = () => {
    const selected = [],
      other = [];
    for (let choice of modal.choices) {
      let index = groups.indexOf(choice);
      if (index > -1) selected.push(choice);
      else other.push(choice);
    }
    setModal({
      ...modal,
      selectedChoice: selected,
      otherChoice: other
    });
  };
  return (
    <div>
      <CardGrid type="selected" choices={modal.selectedChoice} profile={{profile, loading}}/>
      <Button
        outlined
        style={{ margin: "20px", border: "solid 1px #AAA", color: "black" }}
        className="fade-in"
        onClick={() => {
          setModal({
            ...modal,
            openPublic: !modal.openPublic,
            openPrivate: false
          });
        }}
      >
        Add Public Group
      </Button>
      <Button
        outlined
        style={{ margin: "20px", border: "solid 1px #AAA", color: "black" }}
        className="fade-in"
        onClick={() => {
          setModal({
            ...modal,
            openPrivate: !modal.openPrivate,
            openPublic: false
          });
        }}
      >
        Add Private Group
      </Button>
      {modal.openPublic && (
        <CardGrid type="others" choices={modal.otherChoice} profile={{profile, loading}}/>
      )}
      {modal.openPrivate && (
        <div>
          <small>Private Group Name</small>
          <TextField
            helperText={<HelperText>Please fill private group name</HelperText>}
            fullWidth
            dense
          >
            <Input
              value={modal.newGroupInput}
              onChange={e =>
                setModal({ ...modal, newGroupInput: e.currentTarget.value })
              }
            />
          </TextField>
          <small>Invitation Code</small>
          <TextField
            helperText={<HelperText>Please fill invitation code</HelperText>}
            fullWidth
            dense
          >
            <Input
              value={modal.newGroupCode}
              onChange={e =>
                setModal({ ...modal, newGroupCode: e.currentTarget.value })
              }
            />
          </TextField>
        </div>
      )}
    </div>
  );
};

export default MyLoka;
