const { Pool } = require('pg');
const properties = require('./json/properties.json');
const users = require('./json/users.json');


const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  return pool
    .query(`SELECT * FROM users WHERE email = $1;`, [email] || null)
    .then((result) => result.rows[0])
    .catch((err) => err.message)
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1;`, [id] || null)
    .then((result) => result.rows[0])
    .catch((err) => err.message)
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {

  return pool
    .query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING*;`, [user.name, user.email, user.password])
    .then((result) => {return result.rows[0]})
    .catch((err) => err.message)
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  
  return pool
    .query(
      `SELECT reservations.*, properties.*, avg(rating) as average_rating
       FROM reservations
       JOIN properties ON reservations.property_id = properties.id
       JOIN property_reviews ON properties.id = property_reviews.property_id
       WHERE reservations.guest_id = $1
       GROUP BY properties.id, reservations.id
       HAVING reservations.start_date != now()::date
       ORDER BY reservations.start_date DESC
       LIMIT $2;`
    , [guest_id, limit])
    .then((result) => result.rows)
    .catch((err) => err.message);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  // Check if a city has been passed in as an option.
  if (options.city) {
    // console.log('options.city: ', options.city);
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  // Check if an owner_id has been passed in as an option.
  if (options.owner_id) {
    // console.log('options.owner_id: ', options.owner_id);
    queryParams.push(Number(options.owner_id));
    queryString += `AND owner_id = $${queryParams.length} `;
  }
  // Check if minimum_price_per_night has been passed in as an option
  if (options.minimum_price_per_night) {
    // console.log('options.minimum_price_per_night: ', options.minimum_price_per_night);
    queryParams.push(Number(options.minimum_price_per_night));
    if (queryParams.length === 1) {
      queryString += `WHERE properties.cost_per_night/100 >= $${queryParams.length} `;
  } else {
    queryString += `AND properties.cost_per_night/100 >= $${queryParams.length} `;
  }
  }

  // Check if maximum_price_per_night has been passed in as an option
  if (options.maximum_price_per_night) {
    // console.log('options.maximum_price_per_night: ', options.maximum_price_per_night);
    queryParams.push(Number(options.maximum_price_per_night));
    if (queryParams.length === 1) {
      queryString += `WHERE properties.cost_per_night/100 <= $${queryParams.length} `;
  } else {
    queryString += `AND properties.cost_per_night/100 <= $${queryParams.length} `;
  }
  } 

  // GROUP BY has to preceed a HAVING statement like in the case of minimum rating being passed in
  queryString += `GROUP BY properties.id` 

  // Check if minimum_rating has been passed in as an option
  if (options.minimum_rating) {
    // console.log('options.minimum_rating: ', options.minimum_rating);
    queryParams.push(Number(options.minimum_rating));
    queryString += ` HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log('queryParams.length: ##########################################', queryParams.length)
  console.log(queryString, queryParams);
  console.log('options: ', options)

  return pool
    .query(queryString, queryParams)
    .then((result) => result.rows)
    .catch((err) => err.message)

};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
 
  return pool
    .query(`INSERT INTO properties
    (owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING*;`, 
    [
      property.owner_id,
      property.title,
      property.description,
      property.thumbnail_photo_url,
      property.cover_photo_url,
      property.cost_per_night,
      property.street,
      property.city,
      property.province,
      property.post_code,
      property.country,
      property.parking_spaces,
      property.number_of_bathrooms,
      property.number_of_bedrooms
    ])
    .then((result) => result.rows[0])
    .catch((err) => err.message)
}
exports.addProperty = addProperty;
