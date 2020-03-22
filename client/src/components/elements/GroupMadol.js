import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Button from "@material/react-button";

const GroupMadol = props => {
  const [modal, setModal] = useState({
    isOpen: false,
    choices: ["Berlin Wifi Cafe", "Berlin Twainese Restaurant"],
    selectedIndex: [],
    action: "",
    newGroupInput: ""
  });
  const addNewGroup = choice => {
    for (let item of modal.selectedItems) {
      if (choice === item) return false;
    }
    // setModal({ ...modal, selectedItems: modal.selectedItems.push(choice) });
  };
  const checkedCheckbox = (choice, value) => {
    switch (value) {
      case true:
        for (let item of modal.selectedItems) {
          if (choice === item) return true;
        }
        // setModal({ ...modal, selectedItems: modal.selectedItems.push(choice) });
        return true;
    }
  };
  return (
    <div>
      <small style={{ color: "rgba(0, 0, 0, 0.6)" }}>Add New Group</small>
      <TextField
        helperText={<HelperText>Add New Group</HelperText>}
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
      <Button
        outlined
        style={{ margin: "20px", border: "solid 1px #AAA", color: "black" }}
        className="fade-in"
        onClick={() => {
          setModal({ ...modal, isOpen: true });
        }}
      >
        Add Group
      </Button>
      <Dialog
        open={modal.isOpen}
        onClose={action => setModal({ ...modal, action, isOpen: false })}
      >
        <DialogTitle>Select User</DialogTitle>
        <DialogContent>
          <List
            checkboxList
            selectedIndex={modal.selectedIndex}
            handleSelect={(activatedIndex, allSelected) =>
              setModal({ ...modal, selectedIndex: allSelected })
            }
          >
            {modal.choices.map((choice, i) => (
              <ListItem key={i}>
                <Checkbox />
                <ListItemText primaryText={choice}></ListItemText>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogFooter>
          <DialogButton action="dismiss">Cancel</DialogButton>
          <DialogButton action="confirm" isDefault>
            Ok
          </DialogButton>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

GroupMadol.propTypes = {};

export default connect(null, null)(GroupMadol);
