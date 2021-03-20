import express from 'express';
import cloudinary from 'cloudinary';
import * as db from './db.js';
import { uploadImage, uploadPoster } from './upload.js';
import {
  createTokenForUser,
  requireAuthentication,
  requireAdminAuthentication,
  optionalAuthentication,
} from './login.js';
import { getLinks } from './utils.js';
import * as fr from './form-rules.js';

export const router = express.Router();

// /tv
router.get('/',
  fr.paginationRules(),
  fr.checkValidationResult,
  async (req, res) => {
    const {
      offset = 0, limit = 10,
    } = req.query;
    const orderBy = 'id';
    const items = await db.getAllFromTable('Series', '*', offset, limit, orderBy);
    if (items) {
      const length = await db.getCountOfTable('Series');
      const { next, prev, href } = getLinks('tv', length, offset, limit);
      return res.json({
        limit,
        offset,
        items,
        _links: {
          self: {
            href,
          },
          next,
          prev,
        },
      });
    }
    return res.status(404).json({ msg: 'Table not found' });
  });

router.post('/',
  requireAdminAuthentication,
  uploadImage,
  fr.serieRules(),
  fr.checkValidationResult,
  async (req, res) => {
    req.body.image = req.file.path;
    if (req.body.id) req.body.id = null;
    const createdSerie = await db.createNewSerie(req.body);
    if (createdSerie) {
      return res.json({ msg: 'Serie created' });
    }

    return res.json({ err: 'Error creating serie' });
  });

// /tv/:id
router.get('/:serieId',
  optionalAuthentication,
  fr.paramIdRules('serieId'),
  fr.checkValidationResult,
  fr.serieExists,
  async (req, res) => {
    const { serieId } = req.params;
    let userId;
    if (req.user) {
      userId = req.user.id;
    }
    const data = await db.getSerieByIdWithSeasons(serieId, userId);
    console.log(data);
    if (!data) {
      return res.status(404).json({
        errors: [
          {
            msg: "not found",
            param: "id",
            location: "params"
          }
        ]
      });
    }
    return res.json({ data });
  });

router.patch('/:serieId',
  // requireAdminAuthentication,
  uploadImage,
  fr.paramIdRules('serieId'),
  fr.patchSerieRules(),
  fr.checkValidationResult,
  async (req, res) => {
    const { serieId } = req.params;
    req.body.image = req.file.path;
    const newSerie = await db.updateSerieById(serieId, req.body);
    return res.json(newSerie);
  });

router.delete('/:serieId',
  requireAdminAuthentication,
  fr.paramIdRules('serieId'),
  fr.checkValidationResult,
  (req, res) => {
    const { serieId } = req.params;
    const deletedSerie = db.deleteSerie(serieId);
    return res.json(deletedSerie);
  });

// /tv/:id/season/
router.get('/:serieId/season',
  fr.paramIdRules('serieId'),
  fr.paginationRules(),
  fr.checkValidationResult,
  async (req, res) => {
    const { serieId } = req.params;

    let {
      offset = 0, limit = 10,
    } = req.query;
    offset = Number.parseInt(offset, 10);
    limit = Number.parseInt(limit, 10);

    const { data, count } = await db.getSeasonsBySerieId(serieId, offset, limit);
    const { next, prev, href } = getLinks(`tv/${serieId}/season`, count, offset, limit);

    if (!data) {
      res.status(404).json({ errors: [{ param: 'id', msg: 'Fann ekki þátt' }] });
    }
    res.json({
      limit, offset, items: data, links: { self: href, prev, next },
    });
  });

router.post('/:serieId/season',
  requireAdminAuthentication,
  uploadPoster,
  fr.seasonRules(),
  fr.checkValidationResult,
  async (req, res) => {
    const { serieId } = req.params;
    req.body.poster = req.file.path;
    req.body.serieId = serieId;
    const createdSeason = await db.createNewSeason(req.body);
    if (createdSeason) {
      return res.json({ msg: 'Season created' });
    }
    return res.status('404').json({ err: 'Error creating season' });
  });

// /tv/:id/season/:id
router.get('/:serieId/season/:seasonNum', async (req, res) => {
  const { serieId, seasonNum } = req.params;
  const season = await db.getSeasonBySerieIdAndSeasonNum(serieId, seasonNum);
  if (!season) {
    res.status(404).json({ msg: 'Fann ekki þátt' });
  }
  const episodes = await db.getEpisodesBySerieIdAndSeasonNum(serieId, seasonNum);
  const combined = Object.assign(season, { episodes });
  res.json({ combined });
});

router.delete('/:serieId/season/:seasonNum',
  fr.paramIdRules('serieId'),
  fr.paramIdRules('seasonNum'),
  fr.checkValidationResult,
  async (req, res) => {
    const { serieId, seasonNum } = req.params;
    await db.deleteSeasonBySerieIdAndSeasonNumber(serieId, seasonNum);
    return res.json({});
  });

// /tv/:id/season/:id/episode/
router.post('/:serieId/season/:seasonNum/episode',
  requireAdminAuthentication,
  fr.paramIdRules('serieId'),
  fr.paramIdRules('seasonNum'),
  async (req, res) => {
    const { serieId, seasonNum } = req.params;
    const episode = req.body;
    episode[serieId] = serieId;
    episode[seasonNum] = seasonNum;
    const result = await db.createNewEpisode(episode);
    if (result) return res.json({ msg: 'Sköpun þáttar tókst' });
    return res.status(404).json({ msg: 'Sköpun þáttar tókst ekki' });
  });

// /tv/:id/season/:id/episode/:id
router.get('/:serieId/season/:seasonNum/episode/:episodeNum', async (req, res) => {
  const { serieId, seasonNum, episodeNum } = req.params;
  await db.getEpisodeByNo(serieId, seasonNum, episodeNum);
  if (!data) {
    res.status('404').json({ msg: 'Fann ekki þátt' });
  }
  res.json(data);
});

router.delete('/:serieId/season/:seasonNum/episode/:episodeNum',
  requireAdminAuthentication,
  fr.paramIdRules('serieId'),
  fr.paramIdRules('seasonNum'),
  fr.paramIdRules('episodeNum'),
  async (req, res) => {
    const { serieId, seasonNum, episodeNum } = req.params;
    const del = await db.deleteEpisode(episodeNum, serieId, seasonNum);
    if (del) return res.json({ msg: 'Þætti hefur verið eytt' });
    return res.status('404').json({ msg: 'Ekki tókst að eyða þætti' });
  });

router.post('/:serieId/rate',
  requireAuthentication,
  fr.paramIdRules('serieId'),
  fr.ratingRules(),
  fr.checkValidationResult,
  async (req, res) => {
    const { serieId } = req.params;
    const { grade } = req.body;
    const userId = req.user.id;
    let data;
    data = await db.createUserRatingBySerieId(serieId, userId, grade);
    if (!data) {
      return res.status(404).json({ msg: 'Uppfærsla tókst ekki' });
    }
    return res.json({ msg: 'Uppfærsla tókst' });
  });

router.patch('/:serieId/rate',
  requireAuthentication,
  fr.paramIdRules('serieId'),
  fr.ratingRules(),
  fr.checkValidationResult,
  async (req, res) => {
    const { serieId } = req.params;
    const { grade } = req.body;
    const userId = req.user.id;
    let data = await db.updateUserRatingBySerieId(serieId, userId, grade);
    if (!data) {
      return res.status(404).json({ msg: 'Uppfærsla tókst ekki' });
    }
    return res.json({ msg: 'Uppfærsla tókst' });
  });

router.delete('/:serieId/rate',
  requireAuthentication,
  fr.paramIdRules('serieId'),
  fr.checkValidationResult,
  async (req, res) => {
    const { serieId } = req.params;
    const userId = req.user.id;
    const del = await db.deleteUserData(serieId, userId);
    if (del) return;
    res.json({ msg: 'Tókst ekki að eyða' });
  });

router.post('/:serieId/state',
  requireAuthentication,
  fr.paramIdRules('serieId'),
  fr.statusRules(),
  fr.checkValidationResult,
  async (req, res) => {
    const { serieId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    let data;
    data = await db.createUserStatusBySerieId(serieId, userId, status);
    if (!data) {
      return res.status(404).json({ msg: 'Uppfærsla tókst ekki' });
    }
    return res.json({ msg: 'Uppfærsla tókst' });
  });

router.patch('/:serieId/state',
  requireAuthentication,
  fr.paramIdRules('serieId'),
  fr.statusRules(),
  fr.checkValidationResult,
  async (req, res) => {
    const { serieId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    let data = await db.updateUserStatusBySerieId(serieId, userId, status);
    if (!data) {
      return res.status(404).json({ msg: 'Uppfærsla tókst ekki' });
    }
    return res.json({ msg: 'Uppfærsla tókst' });
  });

router.delete('/:serieId/state',
  requireAuthentication,
  fr.paramIdRules('serieId'),
  fr.checkValidationResult,
  async (req, res) => {
    const { serieId } = req.params;
    const userId = req.user.id;
    const del = await db.deleteSerie(serieId, userId);
    if (del) return;
    else return res.json({ msg: 'Tókst ekki að eyða' });
  });

export const getGenres = async (req, res) => {
  const {
    offset = 0,
    limit = 10,
  } = req.query;
  const genres = await db.getAllFromTable('Genres', 'name', offset, limit);
  const length = await db.getCountOfTable('Genres');
  const { next, prev, href } = getLinks('genres', length, offset, limit);
  res.json({
    offset: offset,
    limit: limit,
    genres,
    _links: {
      prev,
      self: {
        href,
      },
      next,
    },
  });
};

export const postGenres = async (req, res) => {
  const {
    name,
  } = req.body;
  const q = 'INSERT INTO Genres(name) VALUES ($1) RETURNING *;';
  const result = await db.query(q, [name]);
  if (!result) {
    res.status(401).json({ err: 'Genre er nú þegar til' });
  }
  res.json(result.rows);
};
