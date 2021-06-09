const Router = require('koa-router');
const {
  logout, checkSession, signUp, signIn,
} = require('./service');

const router = new Router({
  prefix: '/users',
});

router.get('/check_session', checkSession);
router.post('/logout', logout);

router.post('/signup', signUp);
router.post('/signin', signIn);

module.exports = router;
