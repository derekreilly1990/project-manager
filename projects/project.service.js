const db = require("_helpers/db");
const moment = require("moment");

module.exports = {
  getAll,
  getAllByManagerId,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  const projects = await db.Project.find().populate("manager");
  return projects.map((x) => basicDetails(x));
}

async function getAllByManagerId(id) {
  const projects = await db.Project.find({
    manager: id,
  }).populate("manager");

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
  if (!project) throw "Project not found";
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
    startDate,
    expectedEndDate,
    manager,
  } = account;
  return {
    id,
    title,
    managerName,
    progress,
    description,
    mainImageUrl,
    startDate: moment(startDate).format("yyyy-MM-DD"),
    expectedEndDate: moment(expectedEndDate).format("yyyy-MM-DD"),
    manager,
  };
}
