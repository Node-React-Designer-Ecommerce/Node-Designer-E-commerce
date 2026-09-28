const { Router } = require('express');
const { getAllReviews, createReview, getReview, updateReview, deleteReview, setProductsUserIds } = require('../Controllers/reviewController');
const { auth, restrictTo } = require('../Middlewares/authMiddleware');
const router = Router({ mergeParams: true });


router.get('/', getAllReviews);

router.post('/', auth, restrictTo('user'), setProductsUserIds, createReview);

router.get('/:id', getReview);

router.patch('/:id', updateReview);

router.delete('/:id', deleteReview);

module.exports = router;