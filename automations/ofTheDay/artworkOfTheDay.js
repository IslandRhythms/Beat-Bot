const axios = require('axios');

module.exports = async function artworkOfTheDay() {
  console.log('getting artwork of the day ...');
  // first check the met
  const res = await axios.get('https://collectionapi.metmuseum.org/public/collection/v1/objects').then(res => res.data);
  // objectIds are not sequential in the array, meaning objectid 52 might be missing but 53 and 51 are there. Therefore need to pull objectId out of the array.
  const selectedObjectId = res.objectIDs[Math.floor(Math.random() * res.objectIDs.length)];
  const artwork = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${selectedObjectId}`)
    .then(res => res.data)
    .catch(e => console.log('what is e', e.message, e.request.path));

  const { pagination } = await axios.get(`https://api.artic.edu/api/v1/images`).then(res => res.data)
  // begin randomization
  // first pick a page
  const page = Math.floor(Math.random() * pagination.total_pages) + 1;
  // now we query for that page
  const { data } = await axios.get(`https://api.artic.edu/api/v1/images?page=${page}`).then(res => res.data).catch(e => console.log(e.message))
  // now that we have our array of artworks, we choose one randomly
  const selectedArtwork = Math.floor(Math.random() * data.length);
  // now we get the image link
  const art = await axios(`https://api.artic.edu/api/v1/artworks/${data[selectedArtwork].artwork_ids[0]}?fields=id,title,image_id`).then(res => res.data).catch(e => console.log(e.message));
  if (art) {
    // example of the data set (paste in firefox) https://api.artic.edu/api/v1/artworks/4S
    const information = await axios(`https://api.artic.edu/api/v1/artworks/${art.data.id}`).then(res => res.data).catch(e => console.log(e.message));

    return { 
      chicago: { image: `${art.config.iiif_url}/${art.data.image_id}/full/843,/0/default.jpg`, title: information.data.title, artist: information.data.artist_display },
      met: { image: artwork.primaryImage, title: artwork.title, artist: artwork.artistDisplayName }
    };
  } else {
    return { met: { image: artwork.primaryImage, title: artwork.title, artist: artwork.artistDisplayName } }
  }

}