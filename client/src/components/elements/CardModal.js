import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton
} from "@material/react-dialog";
// import TextField, { Input, HelperText } from "@material/react-text-field";
import MaterialIcon from "@material/react-material-icon";
// import Button from "@material/react-button";
import GMap from "./GMap";
import TextField, { Input } from "@material/react-text-field";
import { changeLocationDetail, removeLocation } from "../../actions/group";

const GroupMadol = ({
  isOpen,
  closeModal,
  choice,
  changeLocationDetail,
  removeLocation,
  userID
}) => {
  const [locations, setLocations] = useState(choice.locations);
  useEffect(() => {
    setLocations(choice.locations);
  }, [choice.locations]);
  console.log(choice);
  return (
    <div>
      <Dialog
        className="my-loka-dialog"
        open={isOpen}
        onClose={action => {
          closeModal();
          console.log(action);
        }}
      >
        <DialogTitle>{choice.name}</DialogTitle>
        <DialogContent>
          <ul>
            {locations.map((location, i) => {
              return (
                <li
                  key={location._id}
                  style={{
                    margin: "5px 0"
                  }}
                >
                  <b>{location.name}</b>:{location.address}
                  <br />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TextField style={{ width: "calc(100% - 50px)" }}>
                      <Input
                        value={location.description}
                        onChange={e => {
                          const tmpLocations = [...locations];
                          tmpLocations[i].description = e.currentTarget.value;
                          setLocations(tmpLocations);
                        }}
                      />
                    </TextField>
                    <MaterialIcon
                      role="button"
                      icon="check"
                      style={{ float: "right", cursor: "pointer" }}
                      onClick={() => {
                        changeLocationDetail(choice._id, location);
                      }}
                    />
                    {userID === location.user ? (
                      <MaterialIcon
                        role="button"
                        icon="delete"
                        style={{ float: "right", cursor: "pointer" }}
                        onClick={() => {
                          removeLocation(choice._id, location._id);
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <GMap locations={choice.locations} group_id={choice._id} />
        </DialogContent>
        <DialogFooter>
          <DialogButton action="confirm">Close</DialogButton>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

GroupMadol.propTypes = {
  changeLocationDetail: PropTypes.func.isRequired,
  removeLocation: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userID: state.auth.user._id
});

export default connect(mapStateToProps, {
  changeLocationDetail,
  removeLocation
})(GroupMadol);
