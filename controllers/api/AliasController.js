const express = require('express');
const slugify = require('slugify');
slugify.extend({'đ': 'd'})
const Alias = require("../../models/alias");
const url = require('url');
const aliasController = {}
aliasController.getAll = function(req, res, next) {
    Alias.find({}).exec((err, post) => {
        res.send(post)
    });
}
module.exports = aliasController;