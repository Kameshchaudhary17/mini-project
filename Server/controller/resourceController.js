import Resource from '../models/Resource.js';
import Checkout from '../models/Checkout.js';

export const addResource = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  try {
    const { name } = req.body;
    const photo = req.file ? req.file.filename : null;

    const newResource = await Resource.create({
      name,
      photo,
      isAvailable: true,
    });

    res.status(201).json(newResource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const checkoutResource = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

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

export const returnResource = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

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
    const resources = await Resource.findAll();
    res.status(200).json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};