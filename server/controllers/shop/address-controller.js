const Address = require('../../models/Address')

const addAddress = async(req, res)=>{
    try {
        const {
            userId,
            firstName,
            lastName,
            address,
            aptSuite,
            city,
            state,
            country,
            zipcode,
            phone,
            notes,
        } = req.body;

        if (
            !userId ||
            !firstName ||
            !lastName ||
            !address ||
            !city ||
            !state ||
            !country ||
            !zipcode ||
            !phone
        ) {
            return res.status(400).json({
                success: false,
                message: "invalid data provided",
            });
        }
        const newAddress = new Address({
            userId,
            firstName,
            lastName,
            address,
            aptSuite,
            city,
            state,
            country,
            zipcode,
            phone,
            notes,
        });

        await newAddress.save();

        res.status(201).json({
            success: true,
            data: newAddress,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to add address."
        })
    }
}

const fetchAllAddresses = async (req, res) => {
    try {
        const {userId} = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id is required.",
            });
        }

        const addressList = await Address.find({userId})

        res.status(200).json({
            success: true,
            data: addressList,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch addresses.",
        });
    }
};

const editAddress = async (req, res) => {
    try {
        const {userId, addressId} = req.params;
        const formData = req.body
        
        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "User id and address id is required.",
            });
        }

        const address = await Address.findOneAndUpdate({
            _id: addressId, userId
        }, formData, {new: true})

        if(!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: address,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to edit address.",
        });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const {userId, addressId} = req.params;

        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "User id and address id is required.",
            });
        }

        const address = await Address.findOneAndDelete({
            _id: addressId, userId
        })

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete address.",
        });
    }
};

module.exports = {
    addAddress,
    fetchAllAddresses,
    editAddress,
    deleteAddress,
}