const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const authorize = require("_middleware/authorize");
const Role = require("_helpers/role");
const projectService = require("./project.service");

// routes
router.get("/", authorize(Role.Admin), getAll);
router.get("/:id", authorize(), getById);
router.post("/", authorize(Role.Admin), createSchema, create);
router.put("/:id", authorize(), updateSchema, update);
router.delete("/:id", authorize(), _delete);

module.exports = router;

function getAll(req, res, next) {
  projectService
    .getAll()
    .then((projects) => res.json(projects))
    .catch(next);
}

function getById(req, res, next) {
  // users/managers can get their own account and admins can get any account
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  projectService
    .getById(req.params.id)
    .then((project) => (project ? res.json(project) : res.sendStatus(404)))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    mainImageUrl: Joi.string().required(),
    startDate: Joi.date().required(),
    progress: Joi.number().required(),
    expectedEndDate: Joi.date().required(),
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  projectService
    .create(req.body)
    .then((account) => res.json(account))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schemaRules = {
    title: Joi.string().empty(""),
    description: Joi.string().empty(""),
    mainImageUrl: Joi.string().empty(""),
    startDate: Joi.date().empty(""),
    progress: Joi.number().empty(""),
    expectedEndDate: Joi.string().empty(""),
  };

  // only admins can update role
  /*if (req.user.role === Role.Admin) {
    schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty("");
  }*/

  const schema = Joi.object(schemaRules).with("password", "confirmPassword");
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  // users can update their own account and admins can update any account
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  projectService
    .update(req.params.id, req.body)
    .then((account) => res.json(account))
    .catch(next);
}

function _delete(req, res, next) {
  // users can delete their own account and admins can delete any account
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  projectService
    .delete(req.params.id)
    .then(() => res.json({ message: "Account deleted successfully" }))
    .catch(next);
}
