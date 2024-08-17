ContactSchema = require("./../Model/contactModel");
const socketController = require('./socketController')

exports.getAllContacts = async (request, response, next) => {
  try {
    // Get page and limit from query parameters, default to 1 and 5 respectively
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 5;

    // Calculate the starting index
    const startIndex = (page - 1) * limit;

    // Fetch contacts with pagination
    const contacts = await ContactSchema.find({}).skip(startIndex).limit(limit);

    // Get the total count of contacts
    const totalCount = await ContactSchema.countDocuments();

    // Prepare the response object
    const responseData = {
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalContacts: totalCount,
      contacts,
    };

    response.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

exports.getContactById = (requset, response, next) => {
  ContactSchema.findOne({ _id: requset.params.id })
    .then((data) => {
      if (data == null) throw new Error("Contact doesn't exists");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

exports.addContact = (request, response, next) => {
  let newObject = new ContactSchema({
    name: request.body.name,
    phone: request.body.phone,
    address: request.body.address,
    notes: request.body.notes,
  });

  newObject
    .save()
    .then((data) => {
      // Notify all clients about the new contact
      socketController.lockContact(data._id);
      response.status(201).json({ data: "added", newObject: data });
    })
    .catch((error) => next(error));
};

exports.updateContact = (request, response, next) => {
  const { id } = request.params;

  // Notify all clients that the contact is being updated
  socketController.lockContact(id);

  ContactSchema.updateOne(
    { _id: id },
    { $set: request.body }
  )
    .then(() => {
      // Notify all clients that the contact update is complete
      socketController.unlockContact(id);
      response.status(200).json({ data: "updated" });
    })
    .catch((error) => next(error));
};

exports.deleteContact = (request, response, next) => {
  ContactSchema.findOneAndRemove({
    _id: request.params.id,
  })
    .then(() => {
      // Notify all clients about the deleted contact
      socketController.unlockContact(request.params.id);
      response.status(200).json({ data: "deleted" });
    })
    .catch((error) => next(error));
};
        