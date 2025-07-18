const express = require('express');
const investmentController = require('./../controllers/investmentController');
const authController = require('./../controllers/authController');

const router = express.Router({mergeParams:true});

// Protect all the routes below
router.use(authController.protect);

router.route('/')
.post(authController.restrictTo('user'), investmentController.makeInvestment)
.get(investmentController.getAllInvestments);

router.route('/mine').patch(investmentController.handleInvestments)

module.exports = router;
