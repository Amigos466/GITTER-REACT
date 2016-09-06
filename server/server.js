import Express from 'express';
import compression from 'compression';
import session from 'express-session';
// import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import IntlWrapper from '../client/modules/Intl/IntlWrapper';

// My //


import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';
import request from 'request';


// //////

// Webpack Requirements
import webpack from 'webpack';
import config from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';


// My2 //

const gitterHost    = process.env.HOST || 'https://gitter.im';
const port          = process.env.PORT || 8000;

const clientId      = '85ff893c6166aa0260da25ffa72ffba5258c813f';
const clientSecret  =   '1dee91489c36b5c2bb3ca459017ee3a8481acb87';

const gitter = {
  fetch(path, token, method, cb, text) {
    let options = {
     url: gitterHost + path,
     method: method,
     headers: {
       'Authorization': `Bearer ${token}`
     }

    };

     if(method == 'POST') {
      options.headers =   {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json'}
      options.body = JSON.stringify({text});
     }
     console.log(options);

    request(options, (err, res, body) => {
      if (err) {
        console.log(err);
        return cb(err);
      }
      if (res.statusCode === 200) {
        cb(null, JSON.parse(body));
      } else {
        cb(`err${res.statusCode}`);
      }
    });
  },
  // Текущий пользователь
  fetchCurrentUser(token, cb) {
    this.fetch('/api/v1/user/', token, 'GET', (err, user) => {
      cb(err, user[0]);
    });
  },
  // Список комнат пользователя
  fetchRooms(user, token, cb) {
    this.fetch(`/api/v1/user/${user.id}/rooms`, token, 'GET', (err, rooms) => {
      cb(err, rooms);
    });
  },
  // Сообщения по комнате
  fetchMessagesInRoom(roomId, token, cb) {
    this.fetch(`/api/v1/rooms/${roomId}/chatMessages?limit=50`, token, 'GET', (err, messages) => {
      cb(err, messages);
    });
  },
  // Список пользователей
  fetchUsersInRoom(roomId, token, cb) {
    this.fetch(`/api/v1/rooms/${roomId}/users?limit=50`, token, 'GET', (err, users) => {
      cb(err, users);
    });
  },
  // Поиск комнат
  fetchRoomsByQuery(query, token, cb) {
    this.fetch(`/api/v1/rooms?q=${query}`, token, 'GET', (err, rooms) => {
      cb(err, rooms);
    });
  },
  // Послать сообщение
  fetchSendMessageByRoom(roomId, token, cb) {
    this.fetch(`/api/v1/rooms/${roomId[0]}/chatMessages`, token, 'POST', (err, text) => {
      cb(err, text);
    }, roomId[1]);
  }
};

// /// //

// Initialize the Express App
const app = new Express();

// Run Webpack dev server in development mode
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// React And Redux Setup
import { configureStore } from '../client/store';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Helmet from 'react-helmet';

// Import required modules
import routes from '../client/routes';
import { fetchComponentData } from './util/fetchData';
import serverConfig from './config';

// Apply body Parser and server public assets and routes
app.use(compression());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(Express.static(path.resolve(__dirname, '../dist')));

// //
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new OAuth2Strategy({
    authorizationURL:   `${gitterHost}/login/oauth/authorize`,
    tokenURL:           `${gitterHost}/login/oauth/token`,
    clientID:           clientId,
    clientSecret,
    callbackURL:        '/login/callback',
    passReqToCallback:  true
  },
  (req, accessToken, refreshToken, profile, done) => {
    req.session.token = accessToken;
    gitter.fetchCurrentUser(accessToken, (err, user) => err ? done(err) : done(null, user));
  }
));

passport.serializeUser((user, done) => {
  done(null, JSON.stringify(user));
});

passport.deserializeUser((user, done) => {
  done(null, JSON.parse(user));
});

app.get('/login',
  passport.authenticate('oauth2')
);

app.get('/api/curusr', (req, res) => {
	if (req.user) {
  	gitter.fetchRooms(req.user, req.session.token, function(err, rooms) {
    if (err) return res.send(500);

    res.json({
      "user": req.user,
      "token": req.session.token,
      "clientId": clientId,
      "rooms": rooms
    });
  });
  }
});

app.post('/api/getmessages', (req, res) => {
	if (req.body.roomId) {
  	gitter.fetchMessagesInRoom(req.body.roomId, req.session.token, function(err, messages) {
    if (err) {
    	return res.send(500);
    }
    else{
    	res.json({ messages });
    }
  });
  }
});

app.post('/api/getusersroom', (req, res) => {
  if (req.body.roomId) {
    gitter.fetchUsersInRoom(req.body.roomId, req.session.token, function(err, users) {
    if (err) {
      return res.send(500);
    }
    else{
      res.json({ users });
    }
  });
  }
});

app.post('/api/searchroom', (req, res) => {
  if (req.body.query) {
    gitter.fetchRoomsByQuery(req.body.query, req.session.token, function(err, rooms) {
    if (err) {
      return res.send(500);
    }
    else{
      res.json({ rooms });
    }
  });
  }
});

app.post('/api/sendmessage', (req, res) => {
  if (req.body.text) {
    let send = new Array();
    send[0] = req.body.roomId;
    send[1] = req.body.text;
    gitter.fetchSendMessageByRoom(send, req.session.token, function(err, succ) {
    if (err) {
      console.log(err);
      return res.send(500);
    }
    else{
      res.json({ succ });
    }
  });
  }
});

app.get('/test', (req, res) => {
  		res.json(req.session.token)
	});

app.get('/login/callback',
  passport.authenticate('oauth2', {
    successRedirect: '/',
    failureRedirect: '/'
  })
);

// //


// Render Initial HTML
const renderFullPage = (html, initialState) => {
  const head = Helmet.rewind();

  // Import Manifests
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets);

  return `
    <!doctype html>
    <html>
      <head>
        ${head.base.toString()}
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
        ${head.script.toString()}

        ${process.env.NODE_ENV === 'production' ? `<link rel='stylesheet' href='${assetsManifest['/app.css']}' />` : ''}
     </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          ${process.env.NODE_ENV === 'production' ?
          `//<![CDATA[
          window.webpackManifest = ${JSON.stringify(chunkManifest)};
          //]]>` : ''}
        </script>
        <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/vendor.js'] : '/vendor.js'}'></script>
        <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/app.js'] : '/app.js'}'></script>
      </body>
    </html>
  `;
};

const renderError = err => {
  const softTab = '&#32;&#32;&#32;&#32;';
  const errTrace = process.env.NODE_ENV !== 'production' ?
    `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>` : '';
  return renderFullPage(`Server Error${errTrace}`, {});
};

// Server Side Rendering based on routes matched by React-router.
app.use((req, res, next) => {
  console.log(req.ip);
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end(renderError(err));
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (!renderProps) {
      return next();
    }

    const store = configureStore();

    return fetchComponentData(store, renderProps.components, renderProps.params)
      .then(() => {
        const initialView = renderToString(
          <Provider store={store}>
            <IntlWrapper>
              <RouterContext {...renderProps} />
            </IntlWrapper>
          </Provider>
        );
        const finalState = store.getState();

        res
          .set('Content-Type', 'text/html')
          .status(200)
          .end(renderFullPage(initialView, finalState));
      })
      .catch((error) => next(error));
  });
});

// start app
app.listen(serverConfig.port, (error) => {
  if (!error) {
    console.log(`Started on port: ${serverConfig.port}!`); // eslint-disable-line
  }
});

export default app;
