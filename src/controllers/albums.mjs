import AlbumSchema from '../models/album.mjs';
import authenticateToken from '../middleware/auth.mjs';
import { validateAlbum } from '../middleware/validators.mjs';

const Albums = class Albums {
  constructor(app, connect) {
    this.app = app;
    this.AlbumModel = connect.model('Album', AlbumSchema);
    this.run();
  }

  deleteById() {
    this.app.delete('/album/:id', authenticateToken, (req, res) => {
      try {
        this.AlbumModel.findByIdAndDelete(req.params.id).then((album) => {
          res.status(200).json(album || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] albums/:id -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  showAll() {
    this.app.get('/albums', (req, res) => {
      try {
        let query = {};
        if (req.query.name) {
          query = { name: new RegExp(req.query.name, 'i') }; // Recherche insensible à la casse
        }

        this.AlbumModel.find(query)
          .populate('photos')
          .then((albums) => {
            res.status(200).json(albums);
          })
          .catch(() => {
            res.status(500).json({
              code: 500,
              message: 'Internal Server Error'
            });
          });
      } catch (err) {
        console.error(`[ERROR] /albums -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  showById() {
    this.app.get('/album/:id', (req, res) => {
      try {
        this.AlbumModel.findById(req.params.id).populate('photos').then((album) => {
          res.status(200).json(album || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] albums/:id -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  updateById() {
    this.app.put('/album/:id', authenticateToken, validateAlbum, async (req, res) => {
      try {
        const updatedAlbum = await this.AlbumModel.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
        if (!updatedAlbum) {
          return res.status(404).json({
            code: 404,
            message: 'Album non trouvé'
          });
        }

        return res.status(200).json(updatedAlbum);
      } catch (err) {
        console.error(`[ERROR] PUT /album/:id -> ${err}`);
        return res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        });
      }
    });
  }

  create() {
    this.app.post('/album/', authenticateToken, validateAlbum, (req, res) => {
      try {
        const albumModel = new this.AlbumModel(req.body);
        albumModel.save().then((album) => {
          res.status(200).json(album || {});
        }).catch(() => {
          res.status(200).json({});
        });
      } catch (err) {
        console.error(`[ERROR] albums/create -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  run() {
    this.create();
    this.showById();
    this.deleteById();
    this.showAll();
    this.updateById();
  }
};

export default Albums;
