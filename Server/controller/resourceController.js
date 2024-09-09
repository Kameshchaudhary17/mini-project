import Resource from '../models/Resource.js';
import Checkout from '../models/Checkout.js';

export const addResource = async (req, res) => {
  try {
    const { name } = req.body;
    const photo = req.file ? req.file.filename : null;

    const newResource = await Resource.create({
      name,
      photo,
      isAvailable: true,
      createdBy: req.user.id, // Associate the resource with the current admin
    });

    res.status(201).json(newResource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const checkoutResource = async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required to checkout the resource.' });
    }

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
    console.error('Checkout Resource Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const returnResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findByPk(id);
    const checkout = await Checkout.findOne({ where: { ResourceId: id } });

    if (!resource || !checkout) {
      return res.status(404).json({ error: 'Resource or checkout record not found' });
    }

    await checkout.destroy();

    resource.isAvailable = true;
    await resource.save();

    res.status(200).json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getResources = async (req, res) => {
  try {
    const { page = 1, limit = 10, available } = req.query;
    const offset = (page - 1) * limit;

    // Add filtering logic (optional)
    const whereClause = available !== undefined ? { isAvailable: available } : {};

    const resources = await Resource.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']], // Order by latest created resources
    });

    if (resources.count === 0) {
      return res.status(404).json({ message: 'No resources found' });
    }

    res.status(200).json({
      status: 'success',
      total: resources.count,
      pages: Math.ceil(resources.count / limit),
      currentPage: parseInt(page),
      data: resources.rows,
    });
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve resources. Please try again later.',
    });
  }
};



// Delete resource controller function
export const deleteResource = async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const { id } = req.params;
    const resource = await Resource.findByPk(id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    await resource.destroy();
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (err) {
    console.error('Error deleting resource:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update resource controller function
export const updateResource = async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const { id } = req.params;
    const { name } = req.body;
    const photo = req.file ? req.file.filename : null;

    const resource = await Resource.findByPk(id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    resource.name = name || resource.name;
    if (photo) {
      resource.photo = photo; // Update photo if a new one is provided
    }

    await resource.save();
    res.status(200).json(resource);
  } catch (err) {
    console.error('Error updating resource:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
