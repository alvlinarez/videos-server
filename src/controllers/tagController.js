const Tag = require('../models/Tag');

exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    return res.json(tags);
  } catch (e) {
    return res.status(400).json({
      error: e.message
    });
  }
};

exports.getTagById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        error: 'Params not found'
      });
    }
    const idTag = req.params.id;
    const tag = await Tag.findById(idTag);
    if (!tag) {
      return res.status(400).json({
        error: 'Tag not found'
      });
    }
    return res.json(tag);
  } catch (e) {
    return res.status(400).json({
      error: e.message
    });
  }
};

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    let tag = await Tag.findOne({ name });
    if (tag) {
      return res.status(400).json({
        error: 'Tag with that name already exists'
      });
    }
    tag = new Tag({ name });
    tag = await tag.save();
    return res.json(tag);
  } catch (e) {
    return res.status(400).json({
      error: e.message
    });
  }
};
