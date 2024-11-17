const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age job').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.job) {
    return res.status(400).json({ error: 'Name, age, and job required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    job: req.body.job,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, job: newDomo.job });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred making domo!' });
  }
};

// deleteDomo endpoint.
// i had to try quite a bit to understand how Mongo wanted to read the id but
// after awhile i figured it out.
const deleteDomo = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: `No ID provided: ${req.body}` });
    }

    const deletedDomo = await Domo.findByIdAndDelete(id);

    // this seems a little useless but while I was trying to get the domolist to refresh on delete
    // it was very helpful
    if (!deletedDomo) {
      return res.status(404).json({ error: 'Domo not found' });
    }

    return res.status(200).json({ message: 'Domo deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred deleting the Domo' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
