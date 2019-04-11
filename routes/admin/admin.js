var express = require('express');
var router = express.Router();
//var csrf = require('csurf');
// var passport = require('passport');
// var assert = require('assert');
//var Admin = require('../../models/admin');
var adminControllers = require('../../controllers/backend/AdminController.js');
// var csrfProtection = csrf();
// router.use(csrfProtection);
// Get all employees
router.get('/list', adminControllers.list);

// Get single employee by id
router.get('/show/:id', adminControllers.show);

// Create employee
router.get('/create', adminControllers.create);

// Save employee
router.post('/save', adminControllers.save);

// Edit employee
router.get('/edit/:id', adminControllers.edit);

// Edit update
router.post('/update/:id', adminControllers.update);

// Edit update
router.post('/delete/:id', adminControllers.delete);

module.exports = router;