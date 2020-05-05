import React from 'react';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton
} from '@material/react-dialog';
import GMap from './GMap';
import './CardModal.scss';

const GroupMadol = ({ editMap, setEditMap, groupId, groupName }) => {
  const closeModal = () => {
    setEditMap(false);
  };
  return (
    <div>
      <Dialog
        className='add-location-modal'
        open={editMap}
        onClose={action => {
          closeModal();
        }}
      >
        <DialogTitle>{groupName}</DialogTitle>
        <DialogContent className='add-location-modal-content'>
          <GMap groupId={groupId} closeModal={closeModal} />
        </DialogContent>
        <DialogFooter>
          <DialogButton action='confirm'>Close</DialogButton>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

GroupMadol.propTypes = {};

export default GroupMadol;
