// controllers/photos.mjs
import PhotoSchema from '../models/photo.mjs';
import AlbumSchema from '../models/album.mjs';
import authenticateToken from '../middleware/auth.mjs';
import { validatePhoto } from '../middleware/validators.mjs';

const Photos = class Photos {
  constructor(app, connect) {
    this.app = app;
    this.PhotoModel = connect.model('Photo', PhotoSchema);
    this.AlbumModel = connect.model('Album', AlbumSchema);
    this.run();
  }

  showAllByAlbum() {
    this.app.get('/album/:idalbum/photos', async (req, res) => {
      try {
        const photos = await this.PhotoModel.find({ album: req.params.idalbum });

        return res.status(200).json(photos);
      } catch (err) {
        console.error(`[ERROR] GET /album/${req.params.idalbum}/photos -> ${err}`);
        return res.status(500).json({ code: 500, message: 'Internal Server Error' });
      }
    });
  }

  showById() {
    this.app.get('/album/:idalbum/photo/:idphotos', async (req, res) => {
      try {
        const photo = await this.PhotoModel.findById(req.params.idphotos);

        if (!photo) {
          return res.status(404).json({ code: 404, message: 'Photo non trouvée' });
        }

        return res.status(200).json(photo);
      } catch (err) {
        console.error(`[ERROR] GET /album/${req.params.idalbum}/photo/${req.params.idphotos} -> ${err}`);
        return res.status(500).json({ code: 500, message: 'Internal Server Error' });
      }
    });
  }

  create() {
    this.app.post('/album/:idalbum/photo', authenticateToken, validatePhoto, async (req, res) => {
      try {
        const albumExists = await this.AlbumModel.findById(req.params.idalbum);
        if (!albumExists) {
          return res.status(404).json({ message: 'Album non trouvé' });
        }

        const photoModel = new this.PhotoModel({ ...req.body, album: req.params.idalbum });
        const savedPhoto = await photoModel.save();

        const updatedAlbum = await this.AlbumModel.findByIdAndUpdate(
          req.params.idalbum,
          { $push: { photos: savedPhoto._id } },
          { new: true }
        );

        console.log('Album après ajout de la photo :', updatedAlbum);

        return res.status(201).json(savedPhoto);
      } catch (err) {
        console.error(`[ERROR] POST /album/${req.params.idalbum}/photo -> ${err}`);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    });
  }

  updateById() {
    this.app.put('/album/:idalbum/photo/:idphotos', authenticateToken, validatePhoto, async (req, res) => {
      try {
        const existingPhoto = await this.PhotoModel.findOne({
          _id: req.params.idphotos,
          album: req.params.idalbum
        });

        if (!existingPhoto) {
          return res.status(404).json({ code: 404, message: 'Photo non trouvée ou album incorrect' });
        }

        const updatedPhoto = await this.PhotoModel.findByIdAndUpdate(
          req.params.idphotos,
          req.body,
          { new: true }
        );

        return res.status(200).json(updatedPhoto);
      } catch (err) {
        console.error(`[ERROR] PUT /album/${req.params.idalbum}/photo/${req.params.idphotos} -> ${err}`);
        return res.status(500).json({ code: 500, message: 'Internal Server Error' });
      }
    });
  }

  deleteById() {
    this.app.delete('/album/:idalbum/photo/:idphotos', authenticateToken, async (req, res) => {
      try {
        const deletedPhoto = await this.PhotoModel.findByIdAndDelete(req.params.idphotos);
        if (!deletedPhoto) {
          return res.status(404).json({ message: 'Photo non trouvée' });
        }

        const updatedAlbum = await this.AlbumModel.findByIdAndUpdate(
          req.params.idalbum,
          { $pull: { photos: req.params.idphotos } },
          { new: true }
        );

        console.log('Album après suppression de la photo :', updatedAlbum); // Debug

        return res.status(200).json({ message: 'Photo supprimée avec succès' });
      } catch (err) {
        console.error(`[ERROR] DELETE /album/${req.params.idalbum}/photo/${req.params.idphotos} -> ${err}`);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    });
  }

  run() {
    this.showAllByAlbum();
    this.showById();
    this.create();
    this.updateById();
    this.deleteById();
  }
};

export default Photos;
