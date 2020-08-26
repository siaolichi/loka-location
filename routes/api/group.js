const express = require('express');
const router = express.Router();

const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const Group = require('../../models/Group');
const User = require('../../models/User');
const FacebookUser = require('../../models/FacebookUser');
const GoogleUser = require('../../models/GoogleUser');
//@routes       GET api/group
//@desc         Get all public group
//@access       public
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find().populate('user', ['name', 'avatar']).sort({date: -1});
        res.json(groups);
    } catch (err) {
        console.error(err);
        res.status(404).send('Server Error');
    }
});

//@routes       GET api/group/:id
//@desc         Get public group by id
//@access       public
router.get('/:id', async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate('user', ['name', 'avatar']);
        console.log(group.user);
        try {
            if (!group.user && !group.user.name) {
                const facebookUser = await FacebookUser.findById(group.user);
                const googleUser = await GoogleUser.findById(group.user);
                const user = await User.findById(group.user);
                if (user) {
                    group.user = user;
                } else if (facebookUser) {
                    group.user = facebookUser;
                } else if (googleUser) {
                    group.user = googleUser;
                }
            }
        } catch {
            const facebookUser = await FacebookUser.findById(group.user);
            const googleUser = await GoogleUser.findById(group.user);
            const user = await User.findById(group.user);
            if (user) {
                group.user = user;
            } else if (facebookUser) {
                group.user = facebookUser;
            } else if (googleUser) {
                group.user = googleUser;
            }
        }

        if (!group) return res.status(404).json({msg: 'group not found'});
        res.json(group);
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(404).json({msg: 'group not found'});
        console.error(err);
        res.status(404).send('Server Error');
    }
});

//@routes       POST api/group
//@desc         Create a group
//@access       private
router.post(
    '/',
    [
        auth,
        [
            check('name', 'Text is required').not().isEmpty(),
            check('public', 'Choose public or private').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({error: result.array()});
        }
        try {
            const facebookUser = await FacebookUser.findById(req.user.id);
            const googleUser = await GoogleUser.findById(req.user.id);
            const user = await User.findById(req.user.id);
            if (user) {
                req.user.provider = 'user';
            } else if (facebookUser) {
                req.user.provider = 'facebook_user';
            } else if (googleUser) {
                req.user.provider = 'google_user';
            }
            console.log('Find Provider: ', req.user, user, facebookUser, googleUser);
        } catch (error) {
            console.log(error);
            console.log('Can not find group id');
        }
        try {
            const newGroup = new Group({
                user: req.user.id,
                provider: req.user.provider,
                ...req.body,
            });
            const group = await newGroup.save();
            res.json(group);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
);

//@routes       POST api/group/:id
//@desc         Edit group infos
//@access       private
router.post('/:id', auth, async (req, res) => {
    try {
        console.log(req.params.id);
        const group = await Group.findByIdAndUpdate(req.params.id, req.body);
        res.json(group);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//@routes       DELETE api/group/:id
//@desc         Get group by ID
//@access       private
router.delete('/:id', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate('user', ['name', 'avatar']);
        //Check if group exist
        if (!group) return res.status(404).json({msg: 'group not found'});
        //Check user
        if (group.user.id !== req.user.id) {
            console.log(group.user.id, ' ? ', req.user.id);
            return res.status(404).json({msg: 'User notauthorized'});
        }
        //Remove group
        await group.remove();

        res.json({group, msg: 'Group is removed'});
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(404).json({msg: 'group not found'});
        console.log(err);
        res.status(500).send('Server Error');
    }
});

//@routes       POST api/group/location
//@desc         Create a location for a group
//@access       private
router.post(
    '/location/:id',
    [
        auth,
        [
            check('name', 'Name is required').not().isEmpty(),
            check('address', 'Address is required').not().isEmpty(),
            check('latLng', 'Address is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({error: result.array()});
        }

        try {
            const user =
                (await User.findById(req.user.id).select('-password')) ||
                (await FacebookUser.findById(req.user.id)) ||
                (await GoogleUser.findById(req.user.id));
            const group = await Group.findById(req.params.id);
            const newLocation = {
                user: user.id,
                avatar: user.avatar,
                name: req.body.name,
                address: req.body.address,
                placeId: req.body.placeId,
                latLng: req.body.latLng,
                description: req.body.description,
                url: req.body.url,
            };
            group.locations.unshift(newLocation);
            const newGroup = await group.save();
            res.json(newGroup);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
);

//@routes       POST api/group/location
//@desc         Edit location details
//@access       private
router.post('/location/:id/:location_id', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);

        const location = group.locations.find((location) => location.id == req.params.location_id);
        if (!location) return res.status(404).json({msg: 'Location not found'});

        const newLocation = {
            user: location.user,
            avatar: location.avatar,
            name: location.name,
            address: location.address,
            placeId: location.placeId,
            latLng: location.latLng,
            description: req.body.description,
            url: location.url,
        };
        //Check user
        // if (
        //   req.user.id !== location.user.toString() ||
        //   req.user.id !== group.user.toString()
        // ) {
        //   return res.status(401).json({ msg: "User not authorized" });
        // }

        //Get remove index
        const editIndex = group.locations.map((location) => location.id.toString()).indexOf(req.params.location_id);
        group.locations[editIndex] = newLocation;
        console.log(newLocation);
        await group.save();
        res.json(group.locations);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//@routes       DELETE api/group/location
//@desc         Delete a location from a post
//@access       private
router.delete('/location/:id/:location_id', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);

        const location = group.locations.find((location) => location.id == req.params.location_id);
        console.log(location);
        if (!location) return res.status(404).json({msg: 'Location not found'});

        //Check user
        if (req.user.id.toString() !== location.user.toString() && req.user.id.toString() !== group.user.toString()) {
            return res.status(401).json({
                msg: 'User not authorized, ' + req.user.id + ' : ' + location.user.toString(),
            });
        }

        //Get remove index
        const removeIndex = group.locations.map((location) => location.id.toString()).indexOf(req.params.location_id);
        group.locations.splice(removeIndex, 1);
        await group.save();
        res.json(group.locations);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
