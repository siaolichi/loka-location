import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import TextField, {Input} from '@material/react-text-field';
import {Button} from '@material/react-button';
// import Checkbox from '@material/react-checkbox';
import Dialog, {DialogContent, DialogFooter, DialogButton} from '@material/react-dialog';
import {editGroupInfo, removeGroupFromAllGroups} from '../../actions/group';
const EditGroupModal = ({show, setShow, group, editGroupInfo, removeGroupFromAllGroups, setGroup, clearGroup}) => {
    const [editGroup, setEditGroup] = useState({
        ...group,
        introduction: group.introduction || '',
    });
    return (
        <Dialog
            id='edit-group-modal'
            open={show}
            onClose={(action) => {
                if (action === 'confirm') {
                    editGroupInfo(editGroup);
                    setGroup(editGroup);
                }
                setShow(false);
            }}
        >
            <DialogContent>
                <TextField label='Group Name' outlined style={{width: '100%', marginTop: '10px', marginBottom: '10px'}}>
                    <Input
                        value={editGroup.name}
                        onChange={(e) => setEditGroup({...editGroup, name: e.currentTarget.value})}
                    />
                </TextField>
                <TextField
                    label='Group Introduction'
                    outlined
                    textarea
                    style={{width: '100%', marginTop: '10px', marginBottom: '10px'}}
                >
                    <Input
                        value={editGroup.introduction}
                        onChange={(e) => setEditGroup({...editGroup, introduction: e.currentTarget.value})}
                    />
                </TextField>
                {/* <Checkbox
                    nativeControlId='public-checkbox'
                    checked={editGroup.public}
                    onChange={(e) => setEditGroup({...editGroup, public: e.target.checked})}
                />
                <label htmlFor='public-checkbox'>Public</label>
                <br /> */}
                <Button
                    onClick={(e) => {
                        removeGroupFromAllGroups(group);
                        clearGroup();
                    }}
                >
                    Delete Map Completely
                </Button>
                <DialogFooter>
                    <DialogButton action='dismiss'>Cancel</DialogButton>
                    <DialogButton action='confirm' isDefault>
                        Save
                    </DialogButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

EditGroupModal.propTypes = {
    editGroupInfo: PropTypes.func.isRequired,
    removeGroupFromAllGroups: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
    editGroupInfo,
    removeGroupFromAllGroups,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditGroupModal);
