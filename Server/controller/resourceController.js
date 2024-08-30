import Resource  from '../models/Resource.js';// Assuming you have a Sequelize model for Resource
import Checkout  from '../models/Checkout.js';// Assuming you have a Sequelize model for Resource

// Add a new resource
export const addResource = async (req, res) => {
    try {
        const { name } = req.body;
        const photo = req.file ? req.file.filename : null; // Get the uploaded file's filename

        const newResource = await Resource.create({
            name,
            photo,
            isAvailable: true,
            checkedOutBy: null,
            checkedOutAt: null
        });

        res.status(201).json(newResource);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Checkout a resource
export const checkoutResource = async (req, res) => {
  try {
      const { id } = req.params;
      const { name } = req.body;

      const resource = await Resource.findByPk(id);

      if (!resource) {
          return res.status(404).json({ error: 'Resource not found' });
      }

      if (!resource.isAvailable) {
          return res.status(400).json({ error: 'Resource is not available' });
      }

      const checkout = await Checkout.create({
          name,
          ResourceId: resource.id,
      });

      resource.isAvailable = false;
      await resource.save();

      res.status(200).json({ resource, checkout });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
  }
};

// Return a resource
export const returnResource = async (req, res) => {
  try {
      const { id } = req.params;

      const resource = await Resource.findByPk(id);
      const checkout = await Checkout.findOne({ where: { ResourceId: id } });

      if (!resource || !checkout) {
          return res.status(404).json({ error: 'Resource or checkout record not found' });
      }

      await checkout.destroy(); // Remove the checkout record

      resource.isAvailable = true;
      await resource.save();

      res.status(200).json(resource);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
  }
};

// Get all resources
export const getResources = async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.status(200).json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
