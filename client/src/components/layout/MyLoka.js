import React, { useState, useEffect, Fragment } from "react";
import { Redirect } from "react-router";
import Button from "@material/react-button";
import PropTypes from "prop-types";
import TextField, { Input, HelperText } from "@material/react-text-field";
import CardGrid from "../elements/CardGrid";
import Spinner from "./Spinner";
import { receivePublicGroups, createGroup } from "../../actions/group";
import { connect } from "react-redux";

const MyLoka = ({
  createGroup,
  receivePublicGroups,
  allGroups,
  isAuthenticated,
  profile: { loading, profile }
}) => {
  const [modal, setModal] = useState({
    openPublic: false,
    openPrivate: false,
    choices: ["Berlin Wi-Fi Cafe", "Berlin Twainese Restaurant"],
    newPublicGroupInput: "",
    newGroupInput: "",
    newGroupCode: "",
    selectedChoice: [],
    otherChoice: []
  });
  useEffect(() => {
    if (allGroups.length > 0) initGroup();
  }, [allGroups, profile.groups]);
  useEffect(() => {
    receivePublicGroups();
  }, []);
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Redirect to="/login" />;
  const initGroup = () => {
    const selected = [],
      other = [];
    for (let group of allGroups) {
      let index = profile.groups.indexOf(group.name);
      if (index > -1) selected.push(group);
      else other.push(group);
    }
    setModal({
      ...modal,
      selectedChoice: selected,
      otherChoice: other
    });
  };
  return (
    <div>
      <CardGrid
        type="selected"
        choices={modal.selectedChoice}
        profile={{ profile, loading }}
      />
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
      {/* <Button
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
      </Button> */}
      {modal.openPublic && (
        <div>
          <TextField label="Create group" outlined>
            <Input
              value={modal.newPublicGroupInput}
              onChange={e =>
                setModal({
                  ...modal,
                  newPublicGroupInput: e.currentTarget.value
                })
              }
            />
          </TextField>
          <Button
            outlined
            style={{
              margin: "20px",
              border: "solid 1px #AAA",
              color: "black",
              display: "inline-box"
            }}
            className="fade-in"
            onClick={e => {
              setModal({
                ...modal,
                newPublicGroupInput: "",
                openPublic: false
              });
              createGroup({ name: modal.newPublicGroupInput, public: true });
            }}
          >
            create
          </Button>
          <CardGrid
            type="others"
            choices={modal.otherChoice}
            profile={{ profile, loading }}
          />
        </div>
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
MyLoka.propTypes = {
  allGroups: PropTypes.array.isRequired,
  createGroup: PropTypes.func.isRequired,
  receivePublicGroups: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  allGroups: state.group.allGroups
});
export default connect(mapStateToProps, { receivePublicGroups, createGroup })(
  MyLoka
);
