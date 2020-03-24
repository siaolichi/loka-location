import React, { useState, useEffect, Fragment } from "react";
// import PropTypes from "prop-types";
import { connect } from "react-redux";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton
} from "@material/react-dialog";
// import TextField, { Input, HelperText } from "@material/react-text-field";

import Button from "@material/react-button";
import GMap from "./GMap";

const GroupMadol = ({ isOpen, closeModal, choice }) => {
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
          <h3>{choice.description}</h3>
          <ul>
            {choice.locations.map((location, i) => {
              return (
                <li key={i}>
                  {location.name}:{location.address}
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

GroupMadol.propTypes = {};

export default connect(null, null)(GroupMadol);
