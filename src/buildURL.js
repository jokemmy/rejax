

import is from 'whatitis';

function encode( val ) {
  return encodeURIComponent( val ).
    replace( /%40/gi, '@' ).
    replace( /%3A/gi, ':' ).
    replace( /%24/g, '$' ).
    replace( /%2C/gi, ',' ).
    replace( /%20/g, '+' ).
    replace( /%5B/gi, '[' ).
    replace( /%5D/gi, ']' );
}

function isURLSearchParams( val ) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL( url, params, paramsSerializer ) {
  /*eslint no-param-reassign:0*/
  if ( !params ) {
    return url;
  }

  let serializedParams;
  if ( paramsSerializer ) {
    serializedParams = paramsSerializer( params );
  } else if ( isURLSearchParams( params )) {
    serializedParams = params.toString();
  } else {
    const parts = [];

    Object.entries( params ).forEach(([ key, val ]) => {
      if ( val === null || typeof val === 'undefined' ) {
        return;
      }

      if ( is.Array( val )) {
        key = key + '[]';
      } else {
        val = [val];
      }

      val.forEach(( v ) => {
        if ( is.Date( v )) {
          v = v.toISOString();
        } else if ( is.PlainObject( v )) {
          v = JSON.stringify( v );
        }
        parts.push( encode( key ) + '=' + encode( v ));
      });
    });

    serializedParams = parts.join( '&' );
  }

  if ( serializedParams ) {
    var hashmarkIndex = url.indexOf( '#' );
    if ( hashmarkIndex !== -1 ) {
      url = url.slice( 0, hashmarkIndex );
    }

    url += ( url.indexOf( '?' ) === -1 ? '?' : '&' ) + serializedParams;
  }

  return url;
};
