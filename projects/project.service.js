const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("_helpers/send-email");
const db = require("_helpers/db");
const Role = require("_helpers/role");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  const projects = await db.Project.find();
  return projects.map((x) => basicDetails(x));
}

async function getById(id) {
  const project = await getProject(id);
  return basicDetails(project);
}

async function create(params) {
  // validate
  if (await db.Project.findOne({ title: params.title })) {
    throw 'Email "' + params.title + '" is already registered';
  }

  const project = new db.Project(params);

  // save account
  await project.save();

  return basicDetails(project);
}

async function update(id, params) {
  const project = await getProject(id);

  // validate (if email was changed)
  if (
    params.title &&
    project.title !== params.title &&
    (await db.Project.findOne({ title: params.title }))
  ) {
    throw 'Email "' + params.email + '" is already taken';
  }

  // copy params to account and save
  Object.assign(project, params);
  project.updated = Date.now();
  await project.save();

  return basicDetails(project);
}

async function _delete(id) {
  const project = await getProject(id);
  await project.remove();
}

// helper functions

async function getProject(id) {
  if (!db.isValidId(id)) throw "Project not found";
  const project = await db.Project.findById(id);
  if (!project) throw "Account not found";
  return project;
}

function basicDetails(account) {
  const {
    id,
    title,
    managerName,
    progress,
    description,
    mainImageUrl,
  } = account;
  return {
    id,
    title,
    managerName,
    progress,
    description,
    mainImageUrl,
  };
}
