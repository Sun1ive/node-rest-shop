const express = require('express');
const multer = require('multer');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');




const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject or accept incoming file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter,
});



router.get('/', ProductsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/:productId', checkAuth, ProductsController.products_get_one);

router.patch('/:productId', checkAuth, ProductsController.products_patch);

router.delete('/:productId', checkAuth, );

module.exports = router;
