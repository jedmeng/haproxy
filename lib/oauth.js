const OAuth2Server = require('oauth2-server');

class OAuth {
  constructor(config) {
    this.config = config;
    this.server = new OAuth2Server({
      model: OAuth.buildModel(config),
      accessTokenLifetime: config.accessTokenLifetime || 60 * 60 * 24 * 7,
      refreshTokenLifetime: config.refreshTokenLifetime || 60 * 60 * 24 * 365
    });
  }

  async authorize(ctx) {
    const request = OAuth.buildOAuthRequest(ctx);
    const response = OAuth.buildOAuthResponse();
    const options = {
      authenticateHandler: {
        handle(request, response) {
          return {};
        }
      }
    };

    return this.server.authorize(request, response, options);
  }

  async authenticate(ctx, token) {
    const request = OAuth.buildOAuthRequest(ctx);
    const response = OAuth.buildOAuthResponse();
    const options = {};

    if (token) {
      request.query.access_token = token;
      options.allowBearerTokensInQueryString = true;
    }

    return this.server.authenticate(request, response, options);
  }

  async token(ctx) {
    const request = OAuth.buildOAuthRequest(ctx);
    const response = OAuth.buildOAuthResponse();

    return this.server.token(request, response);
  }

  static buildOAuthRequest(ctx) {
    // compatible with ctx and ctx.req
    const req = ctx.request || ctx;

    return new OAuth2Server.Request(req);
  }

  static buildOAuthResponse() {
    return new OAuth2Server.Response({});
  }


  static generateSecret() {
    return 'e065276916006f80a6893479d370907efe0fc9d1';//@fixme
    const crypto = require('crypto');
    const md5 = crypto.createHash('md5');
    const seed = Date.now() + '$' + Math.random();
    return md5.update(seed).digest('hex');
  }
}

class OAuthModel {
  constructor(config) {



    // use user defined model function if existed
    Object.keys(config)
      .filter(key => typeof config[key] === 'function')
      .forEach(key => this[key] = config[key]);
  }

  generateAccessToken(client, user, scope) {
    return '0aee6d9efdb34ea5fff09e8ae19bb990333469e6';
  }

  generateRefreshToken(client, user, scop) {
    return '0aee6d9efdb34ea5fff09e8ae19bb990333469e6';
  }

  generateAuthorizationCode(client, user, scope, callback) {
    // @todo
    callback(null, '0aee6d9efdb34ea5fff09e8ae19bb990333469e6');
  }

  async getAuthorizationCode(authorizationCode) {
    return storage.get(`code.${authorizationCode}`);
  }

  async getAccessToken(accessToken) {
    return storage.get(`access_token.${accessToken}`);
  }

  async getRefreshToken(refreshToken) {
    return storage.get(`refresh_token.${refreshToken}`);
  }

  async getClient(clientId, clientSecret) {
    if (clientId !== config.id) {
      return false;
    } else if (clientSecret && clientSecret !== config.secret) {
      return false;
    }

    return {
      id: clientId,
      redirectUris: config.redirectUri,
      grants: ['authorization_code', 'refresh_token']
    };
  }

  async saveAuthorizationCode(code, client, user) {
    const data = {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      client: {id: client.id},
      user: {}
    };
    storage.set(`code.${code.authorizationCode}`, data);
    return data;
  }

  async saveToken(token, client, user) {
    const data = {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      client: {id: client.id},
      user: {}
    };
    storage.set(`access_token.${token.accessToken}`, data);
    storage.set(`refresh_token.${token.refreshToken}`, data);
    return data;
  }

  async revokeAuthorizationCode(code) {
    storage.remove(`code.${code.authorizationCode}`);
    return true;
  }

  async revokeToken(token) {
    storage.remove(`refresh_token.${token.refreshToken}`);
    return true;
  }
}


 buildModel(config) {
  const storage = this.storage = this.storage || {
    data: {},
    get(key) {
      return this.data[key];
    },
    set(key, value) {
      this.data[key] = value;
    },
    remove(key) {
      this.set(key);
    }
  };

  const model = {

  };


  return model;
}

module.exports = OAuth;