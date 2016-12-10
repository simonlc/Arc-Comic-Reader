


// XXX
// XXX This file is not currently used.
// XXX



import { Router } from 'express';
import Comic from './models/comic';
import fetch from 'isomorphic-fetch';
import querystring from 'querystring';

// TODO Link back to comic vine (TOS)
const api_key = 'REDACTED';

const router = Router();

router.get('/volumes/:search',
  async (req, res) => {
    const volumes = await fetch(`http://api.comicvine.com/search${
      querystring.stringify({
        api_key,
        query: req.params.search,
        resources: 'volume',
      })
    }`);
    return res.json(await volumes.json());
  });

export default router;
