import { Router } from 'express';
import {filterImageFromURL, deleteLocalFiles} from '../../../util/util';

const router: Router = Router();

// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
router.get( '/', async ( req, res ) => {
  const imageUrl = req.query.image_url;

  if (!imageUrl) {
    return res.status(400).send({ message: 'Image url (image_url) is required or malformed.'});
  }

  try {
    const filteredPath = await filterImageFromURL(imageUrl);
    res.status(200).sendFile(filteredPath, async () => {
      await deleteLocalFiles([filteredPath]);
    });
  }
  catch (error) {
    console.log(error);
    res.status(422).send({ message: 'Failed to process image.' })
  }
});

export const FilteredImageRouter: Router = router;