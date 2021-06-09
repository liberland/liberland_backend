// INIT ENV VARS
require('dotenv').config();

// LIBS
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const passport = require('koa-passport');
const cors = require('@koa/cors');
const qs = require('koa-qs');
const { memoryStore } = require('./db');
// MIDDLEWARES

// ROUTES

// CONTROLLERS

// APP
const app = new Koa();
app.keys = [process.env.SESSION_SECRET_KEY];
app.use(
  session(
    {
      maxAge: 60 * 60 * 1000,
      rolling: true,
      renew: true,
      httpOnly: true,
      store: memoryStore,
    },
    app,
  ),
);

passport.serializeUser(({
  id, address, email, role,
}, done) => {
  done(null, {
    id,
    address,
    email,
    role,
  });
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());
qs(app);
app.use(bodyParser());
app.use(
  cors({
    origin: (ctx) => {
      if (!process.env.CORS_ALLOWED_ORIGINS) return false;
      const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS.split(',');
      const requestedOrigin = ctx.accept.headers.origin;
      const grantPermission = allowedOrigins.find(
        (origin) => origin === requestedOrigin,
      );

      return grantPermission || false;
    },
    credentials: true,
  }),
);

// GLOBAL ERROR HANDLING
app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.t) await ctx.t.commit();
  } catch (err) {
    if (ctx.t) await ctx.t.rollback();
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
    ctx.app.emit('error', err, ctx);
  }
});

app.listen(process.env.PORT || 3000);
