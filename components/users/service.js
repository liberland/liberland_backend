const bcrypt = require('bcrypt');
const { users: UserModel } = require('../../models');

const logout = async (ctx) => {
  if (ctx.isAuthenticated()) ctx.logout();
  ctx.status = 204;
};

const checkSession = async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.body = {
      success: true,
      user: ctx.session.passport.user,
    };
  } else {
    ctx.body = {
      success: false,
    };
  }
};

const signUp = async (ctx) => {
  const { email, password, role } = ctx.request.body;

  if (!email) ctx.throw(400, 'Email is required');
  if (!password) ctx.throw(400, 'Password is required');
  if (!role) ctx.throw(400, 'Role is required');

  const hashedPassword = await bcrypt.hash(password, 10);

  const [user, created] = await UserModel.findOrCreate({
    where: { email },
    defaults: { password: hashedPassword, role },
  });

  if (created) {
    const deserializedUser = {
      email: user.get('email'),
      id: user.get('id'),
      role: user.get('role'),
    };
    await ctx.login(deserializedUser);
    ctx.body = deserializedUser;
  } else {
    ctx.throw(409, 'User with this email is already exist');
  }
};

const signIn = async (ctx) => {
  const { email, password } = ctx.request.body;

  if (!email) ctx.throw(400, 'Email is required');
  if (!password) ctx.throw(400, 'Password is required');

  const user = await UserModel.findOne({
    where: { email },
    attributes: ['id', 'email', 'role', ['password', 'hashedPassword']],
  });

  if (user) {
    const hashedPassword = user.get('hashedPassword');

    const match = await bcrypt.compare(password, hashedPassword);

    if (match) {
      const deserializedUser = {
        email: user.get('email'),
        id: user.get('id'),
        role: user.get('role'),
      };
      await ctx.login(deserializedUser);
      ctx.body = deserializedUser;
    } else {
      ctx.throw(403, 'User not found or password is wrong');
    }
  } else {
    ctx.throw(403, 'User not found or password is wrong');
  }
};

module.exports = {
  logout,
  checkSession,
  signUp,
  signIn,
};
