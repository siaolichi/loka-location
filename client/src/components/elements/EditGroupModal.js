import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import TextField, {Input} from '@material/react-text-field';
import {Button} from '@material/react-button';
import Select, {Option} from '@material/react-select';
// import Checkbox from '@material/react-checkbox';
import Dialog, {DialogContent, DialogFooter, DialogButton} from '@material/react-dialog';
import {createGroup, editGroupInfo, removeGroupFromAllGroups} from '../../actions/group';
import citiesJson from '../../utils/world-cities.json';
import './EditGroupModal.scss';
const cities = [];
for (let city of citiesJson) {
    cities.push(city);
}

const EditGroupModal = ({
    show,
    setShow,
    group,
    createGroup,
    editGroupInfo,
    removeGroupFromAllGroups,
    setGroup,
    clearGroup,
}) => {
    const [editGroup, setEditGroup] = useState({
        name: '',
        introduction: '',
        city: '',
        public: true,
        ...group,
    });
    const [city, setCity] = useState({
        input: '',
        list: [],
        show: false,
    });
    const onCityInput = (e) => {
        const input = e.target.value;
        if (input.length > 3) {
            setCity({
                input,
                list: cities.filter((city) => city.name.toLowerCase().includes(input.toLowerCase())),
                show: true,
            });
        } else {
            setCity({
                input,
                list: [],
                show: false,
            });
        }
    };
    const onSelectCity = (e) => {
        setCity({
            ...city,
            input: e.target.value,
            show: false,
        });
        setEditGroup({...editGroup, city: e.target.value});
    };
    return (
        <Dialog
            id='edit-group-modal'
            open={show}
            onClose={(action) => {
                if (action === 'confirm') {
                    if (group) {
                        editGroupInfo(editGroup);
                        setGroup(editGroup);
                    } else {
                        createGroup(editGroup);
                    }
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
                    style={{width: '100%', marginTop: '10px', marginBottom: '10px', height: '300px'}}
                >
                    <Input
                        value={editGroup.introduction}
                        onChange={(e) => setEditGroup({...editGroup, introduction: e.currentTarget.value})}
                    />
                </TextField>
                <TextField label='City' outlined className='city-input'>
                    <Input value={city.input} onChange={onCityInput} />
                </TextField>
                {city.show && (
                    <Select outlined label='Select One City' onChange={onSelectCity} value={editGroup.city}>
                        <Option key='default' vlaue='default'></Option>
                        {city.list.map((option, index) => {
                            console.log(option);
                            return (
                                <Option key={option.geonameid} vlaue={option.name}>
                                    {`${option.name}, ${option.country}`}
                                </Option>
                            );
                        })}
                    </Select>
                )}
                {/* <Checkbox
                    nativeControlId='public-checkbox'
                    checked={editGroup.public}
                    onChange={(e) => setEditGroup({...editGroup, public: e.target.checked})}
                />
                <label htmlFor='public-checkbox'>Public</label>
                <br /> */}
                <br />
                {group && (
                    <Button
                        onClick={(e) => {
                            removeGroupFromAllGroups(group);
                            if (clearGroup) clearGroup();
                        }}
                    >
                        Delete Map Completely
                    </Button>
                )}
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
    createGroup: PropTypes.func.isRequired,
    editGroupInfo: PropTypes.func.isRequired,
    removeGroupFromAllGroups: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
    createGroup,
    editGroupInfo,
    removeGroupFromAllGroups,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditGroupModal);
